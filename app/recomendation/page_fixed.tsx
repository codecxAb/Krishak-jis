"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSend,
  FiAlertCircle,
  FiLoader,
  FiCheckCircle,
} from "react-icons/fi";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../utils/firebase";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";
import Navbar from "../components/Navbar";
import VoiceFormAssistant from "../components/VoiceFormAssistant";

// Type definitions for form data
interface FormData {
  state: string;
  district: string;
  farm_size: number;
  primary_crop_type: string;
  irrigation_method: string;
  nitrogen_level: number;
  phosphorus_level: number;
  potassium_level: number;
  calcium_content: number;
  ph_level: number;
  soil_type: string;
  temperature: number;
  humidity: number;
  water_content: number;
}

interface RecommendationResponse {
  recommendations: any[];
  status: string;
  message?: string;
}

const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Gujarat", "Haryana", "Himachal Pradesh",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab",
  "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"
];

const DISTRICTS: Record<string, string[]> = {
  "Uttar Pradesh": ["Agra", "Allahabad", "Bareilly", "Ghaziabad", "Kanpur", "Lucknow", "Meerut", "Varanasi"],
  "Maharashtra": ["Mumbai", "Pune", "Nashik", "Nagpur", "Aurangabad", "Solapur"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli", "Belgaum", "Mangalore"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  "Haryana": ["Gurgaon", "Faridabad", "Panipat", "Ambala", "Karnal"],
  // Add more as needed
};

const CROP_TYPES = [
  "Rice", "Wheat", "Maize", "Cotton", "Sugarcane", "Pulses", "Oilseeds", 
  "Vegetables", "Fruits", "Spices", "Tea", "Coffee"
];

const IRRIGATION_METHODS = [
  "Tube Well", "Canal", "River", "Rainwater Harvesting", "Drip Irrigation", 
  "Sprinkler", "Flood Irrigation"
];

const SOIL_TYPES = [
  "Alluvial", "Black", "Red", "Laterite", "Sandy", "Loamy", "Clay", "Silty"
];

const steps = [
  "Farm Details",
  "Soil Analysis", 
  "Environmental Data",
  "Submit"
];

const RecommendationPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    state: "",
    district: "",
    farm_size: 0,
    primary_crop_type: "",
    irrigation_method: "",
    nitrogen_level: 0,
    phosphorus_level: 0,
    potassium_level: 0,
    calcium_content: 0,
    ph_level: 0,
    soil_type: "",
    temperature: 0,
    humidity: 0,
    water_content: 0,
  });
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [submitted, setSubmitted] = useState(false);
  
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        router.push("/signin");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  const handleInputChange = (name: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitRecommendationRequest = async () => {
    if (!user) {
      setError("User not authenticated");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare the data exactly as required
      const requestData = {
        user_id: user.uid,
        ...formData
      };

      console.log("Sending data:", requestData);

      // Replace with your actual API endpoint
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RecommendationResponse = await response.json();
      
      if (data.status === "success") {
        setRecommendations(data.recommendations || []);
        setSubmitted(true);
        setCurrentStep(steps.length - 1);
      } else {
        throw new Error(data.message || "Failed to get recommendations");
      }
    } catch (err) {
      console.error("Error submitting recommendation request:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-text-primary mb-6">Farm Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-text-primary font-medium mb-2">State *</label>
                <select
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  required
                >
                  <option value="">Select State</option>
                  {STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-text-primary font-medium mb-2">District *</label>
                <select
                  value={formData.district}
                  onChange={(e) => handleInputChange("district", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  required
                  disabled={!formData.state}
                >
                  <option value="">Select District</option>
                  {formData.state && DISTRICTS[formData.state]?.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-text-primary font-medium mb-2">Farm Size (acres) *</label>
                <input
                  type="number"
                  value={formData.farm_size || ""}
                  onChange={(e) => handleInputChange("farm_size", parseFloat(e.target.value) || 0)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  placeholder="e.g., 5.0"
                  step="0.1"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-text-primary font-medium mb-2">Primary Crop Type *</label>
                <select
                  value={formData.primary_crop_type}
                  onChange={(e) => handleInputChange("primary_crop_type", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  required
                >
                  <option value="">Select Crop Type</option>
                  {CROP_TYPES.map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-text-primary font-medium mb-2">Irrigation Method *</label>
                <select
                  value={formData.irrigation_method}
                  onChange={(e) => handleInputChange("irrigation_method", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  required
                >
                  <option value="">Select Irrigation Method</option>
                  {IRRIGATION_METHODS.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-text-primary mb-6">Soil Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-text-primary font-medium mb-2">Nitrogen Level (kg/ha) *</label>
                <input
                  type="number"
                  value={formData.nitrogen_level || ""}
                  onChange={(e) => handleInputChange("nitrogen_level", parseFloat(e.target.value) || 0)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  placeholder="e.g., 50"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-text-primary font-medium mb-2">Phosphorus Level (kg/ha) *</label>
                <input
                  type="number"
                  value={formData.phosphorus_level || ""}
                  onChange={(e) => handleInputChange("phosphorus_level", parseFloat(e.target.value) || 0)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  placeholder="e.g., 30"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-text-primary font-medium mb-2">Potassium Level (kg/ha) *</label>
                <input
                  type="number"
                  value={formData.potassium_level || ""}
                  onChange={(e) => handleInputChange("potassium_level", parseFloat(e.target.value) || 0)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  placeholder="e.g., 20"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-text-primary font-medium mb-2">Calcium Content (mg/kg) *</label>
                <input
                  type="number"
                  value={formData.calcium_content || ""}
                  onChange={(e) => handleInputChange("calcium_content", parseFloat(e.target.value) || 0)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  placeholder="e.g., 15"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-text-primary font-medium mb-2">pH Level *</label>
                <input
                  type="number"
                  value={formData.ph_level || ""}
                  onChange={(e) => handleInputChange("ph_level", parseFloat(e.target.value) || 0)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  placeholder="e.g., 6.5"
                  step="0.1"
                  min="0"
                  max="14"
                  required
                />
              </div>

              <div>
                <label className="block text-text-primary font-medium mb-2">Soil Type *</label>
                <select
                  value={formData.soil_type}
                  onChange={(e) => handleInputChange("soil_type", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  required
                >
                  <option value="">Select Soil Type</option>
                  {SOIL_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-text-primary mb-6">Environmental Data</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-text-primary font-medium mb-2">Temperature (°C) *</label>
                <input
                  type="number"
                  value={formData.temperature || ""}
                  onChange={(e) => handleInputChange("temperature", parseFloat(e.target.value) || 0)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  placeholder="e.g., 25"
                  min="-10"
                  max="50"
                  required
                />
              </div>

              <div>
                <label className="block text-text-primary font-medium mb-2">Humidity (%) *</label>
                <input
                  type="number"
                  value={formData.humidity || ""}
                  onChange={(e) => handleInputChange("humidity", parseFloat(e.target.value) || 0)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  placeholder="e.g., 70"
                  min="0"
                  max="100"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-text-primary font-medium mb-2">Water Content (%) *</label>
                <input
                  type="number"
                  value={formData.water_content || ""}
                  onChange={(e) => handleInputChange("water_content", parseFloat(e.target.value) || 0)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  placeholder="e.g., 40"
                  min="0"
                  max="100"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {!submitted ? (
              <div className="text-center">
                <h3 className="text-2xl font-bold text-text-primary mb-6">Review & Submit</h3>
                <p className="text-text-secondary mb-8">
                  Please review your information and click submit to get your crop recommendations.
                </p>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <FiAlertCircle className="text-red-500 mr-2" />
                      <p className="text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={submitRecommendationRequest}
                  disabled={loading}
                  className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiSend className="mr-2" />
                      Get Recommendations
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="flex items-center justify-center mb-6">
                  <FiCheckCircle className="text-green-500 text-6xl" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-4">Recommendations Generated!</h3>
                <p className="text-text-secondary mb-8">
                  Your crop recommendations have been successfully generated based on your farm data.
                </p>
                
                {recommendations.length > 0 && (
                  <div className="bg-background-secondary rounded-lg p-6 text-left">
                    <h4 className="text-lg font-bold text-text-primary mb-4">Your Recommendations:</h4>
                    <div className="space-y-4">
                      {recommendations.map((rec, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                          <pre className="text-sm text-text-secondary overflow-auto">
                            {JSON.stringify(rec, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin text-4xl text-brand-primary mx-auto mb-4" />
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary">
      <Navbar user={user} />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-text-primary mb-4">
              Crop Recommendation System
            </h1>
            <p className="text-lg text-text-secondary">
              Get personalized crop recommendations based on your farm data
            </p>
          </div>

          {/* Voice Assistant */}
          <div className="mb-8">
            <VoiceFormAssistant 
              formData={formData}
              onFormUpdate={handleInputChange}
              onResponse={(response) => {
                console.log("Voice Assistant Response:", response);
              }}
            />
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      index <= currentStep
                        ? "bg-brand-primary text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      index <= currentStep ? "text-brand-primary" : "text-gray-500"
                    }`}
                  >
                    {step}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="w-16 h-0.5 bg-gray-200 ml-4"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            {currentStep < steps.length - 1 && !submitted && (
              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={nextStep}
                  disabled={currentStep === steps.length - 1}
                  className="bg-brand-primary hover:bg-brand-primary/90 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationPage;
