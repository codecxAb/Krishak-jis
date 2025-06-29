"use client";
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Camera, 
  Leaf, 
  AlertCircle, 
  CheckCircle, 
  Loader,
  Image as ImageIcon,
  X,
  Download
} from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { useTranslation } from '../utils/translation';

interface PlantDiseaseResult {
  plant_name: string;
  disease_status: string;
  confidences: {
    healthy: number;
    diseased: number;
  };
  output: string;
}

const PlantDoctor: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PlantDiseaseResult | null>(null);
  const [translatedResult, setTranslatedResult] = useState<PlantDiseaseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language } = useLanguage();
  const { t, translateDynamic } = useTranslation(language);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
      setResult(null);
      setTranslatedResult(null);
    } else {
      setError('Please select a valid JPG or PNG image file.');
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
      setResult(null);
      setTranslatedResult(null);
    } else {
      setError('Please select a valid JPG or PNG image file.');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setError(null);

    // First, test if the API is reachable with a GET request
    const apiUrl = process.env.NEXT_PUBLIC_PLANT_DISEASE_API_URL || "https://cebe-45-64-237-226.ngrok-free.app";
    console.log('Testing API connectivity...');
    
    try {
      const testResponse = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });
      console.log('API test response status:', testResponse.status);
    } catch (testError) {
      console.error('API connectivity test failed:', testError);
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedImage);

      const apiUrl = process.env.NEXT_PUBLIC_PLANT_DISEASE_API_URL || "https://cebe-45-64-237-226.ngrok-free.app";
      console.log('API URL:', apiUrl);
      console.log('Full request URL:', `${apiUrl}/predict`);
      console.log('FormData contents:', Array.from(formData.entries()));

      const response = await fetch(`${apiUrl}/predict`, {
        method: 'POST',
        body: formData,
        headers: {
          'ngrok-skip-browser-warning': 'true', // For ngrok URLs
        },
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        
        // Check if it's a 405 Method Not Allowed error
        if (response.status === 405) {
          console.error('405 Method Not Allowed - trying different endpoint');
          // Try alternative endpoints
          const altResponse = await fetch(`${apiUrl}/`, {
            method: 'POST',
            body: formData,
            headers: {
              'ngrok-skip-browser-warning': 'true',
            },
          });
          
          if (altResponse.ok) {
            const altResponseText = await altResponse.text();
            console.log('Alternative endpoint response:', altResponseText);
            const data = JSON.parse(altResponseText);
            setResult(data);
            return;
          }
        }
        
        throw new Error(`HTTP ${response.status}: ${response.statusText || 'Failed to analyze image'}`);
      }

      // Get response as text first to debug
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      // Try to parse JSON
      let data: PlantDiseaseResult;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed data:', data);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid response format from server');
      }

      setResult(data);

      // Translate the result if language is Hindi
      if (language === 'hi') {
        try {
          const translatedOutput = await translateDynamic(data.output);
          const translatedPlantName = await translateDynamic(data.plant_name);
          const translatedDiseaseStatus = await translateDynamic(data.disease_status);
          
          setTranslatedResult({
            ...data,
            plant_name: translatedPlantName,
            disease_status: translatedDiseaseStatus,
            output: translatedOutput
          });
        } catch (translationError) {
          console.error('Translation error:', translationError);
          setTranslatedResult(data); // Fallback to original
        }
      }
    } catch (err) {
      console.error('Full error object:', err);
      
      let errorMessage = 'Failed to analyze the image. Please try again.';
      
      if (err instanceof Error) {
        console.error('Error message:', err.message);
        if (err.message.includes('JSON')) {
          errorMessage = 'Server returned invalid data. Please try again.';
        } else if (err.message.includes('HTTP 405')) {
          errorMessage = 'Server endpoint not found. Please check the API configuration.';
        } else if (err.message.includes('HTTP')) {
          errorMessage = `Server error: ${err.message}`;
        } else if (err.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection.';
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResult(null);
    setTranslatedResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayResult = language === 'hi' ? translatedResult || result : result;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 bg-brand-accent/20 rounded-lg">
            <Leaf className="w-8 h-8 text-brand-primary" />
          </div>
          <h2 className="text-3xl font-bold text-text-primary">
            {t('plant_doctor.title')}
          </h2>
        </div>
        <p className="text-text-secondary max-w-2xl mx-auto">
          {t('plant_doctor.subtitle')}
        </p>
      </div>

      {/* Upload Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              selectedImage 
                ? 'border-brand-primary bg-brand-accent/10' 
                : 'border-brand-accent/30 hover:border-brand-primary hover:bg-brand-accent/5'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Selected plant"
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
                <button
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-700 mb-2">
                    {t('plant_doctor.upload_image')}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    {t('plant_doctor.drag_drop')}
                  </p>
                  <p className="text-xs text-gray-400">
                    {t('plant_doctor.file_types')}
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors shadow-lg"
                >
                  <Camera className="w-5 h-5" />
                  {t('plant_doctor.choose_file')}
                </button>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          {selectedImage && (
            <div className="mt-6">
              <button
                onClick={analyzeImage}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    {t('plant_doctor.analyzing')}
                  </>
                ) : (
                  <>
                    <Leaf className="w-5 h-5" />
                    {t('plant_doctor.analyze_plant')}
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        <div>
          <AnimatePresence>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <div>
                    <h3 className="font-semibold text-red-800">
                      {t('plant_doctor.error')}
                    </h3>
                    <p className="text-red-600">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {displayResult && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-200">
                <div className="space-y-6">
                  {/* Plant Name */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Leaf className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {t('plant_doctor.plant_name')}
                      </p>
                      <p className="text-lg font-semibold text-gray-800">
                        {displayResult.plant_name}
                      </p>
                    </div>
                  </div>

                  {/* Disease Status */}
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      displayResult.disease_status.toLowerCase().includes('healthy') 
                        ? 'bg-green-100' 
                        : 'bg-red-100'
                    }`}>
                      {displayResult.disease_status.toLowerCase().includes('healthy') ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {t('plant_doctor.health_status')}
                      </p>
                      <p className={`text-lg font-semibold ${
                        displayResult.disease_status.toLowerCase().includes('healthy')
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {displayResult.disease_status}
                      </p>
                    </div>
                  </div>

                  {/* Confidence Scores */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">
                      {t('plant_doctor.confidence_scores')}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {t('plant_doctor.healthy')}
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          {Math.round(displayResult.confidences.healthy * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${displayResult.confidences.healthy * 100}%` }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {t('plant_doctor.diseased')}
                        </span>
                        <span className="text-sm font-medium text-red-600">
                          {Math.round(displayResult.confidences.diseased * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${displayResult.confidences.diseased * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Analysis Output */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      {t('plant_doctor.detailed_analysis')}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {displayResult.output}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>

          {!displayResult && !error && !isLoading && (
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">
                {t('plant_doctor.results_here')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantDoctor;
