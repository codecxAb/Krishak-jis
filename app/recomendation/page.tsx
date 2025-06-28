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
import RecommendationResults from "../components/RecommendationResultsSimple";
import indianGeoData from "../../indian_geo.json";

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

// Extract states and districts from the imported JSON data
const STATES = indianGeoData.states.map(stateData => stateData.state);

const DISTRICTS: Record<string, string[]> = indianGeoData.states.reduce((acc, stateData) => {
  acc[stateData.state] = stateData.districts;
  return acc;
}, {} as Record<string, string[]>);

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
    state: "west Bengal",
    district: "Darjeeling",
    farm_size: 5,
    primary_crop_type: "Tea",
    irrigation_method: "Drip Irrigation",
    nitrogen_level: 30,
    phosphorus_level: 20,
    potassium_level: 25,
    calcium_content: 15,
    ph_level: 6.5,
    soil_type: "Loamy",
    temperature: 22,
    humidity: 70,
    water_content: 43,
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
    
    // Clear district when state changes
    if (name === 'state') {
      setFormData(prev => ({
        ...prev,
        district: ""
      }));
    }
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
        // user_id: user.uid,
        ...formData
      };

      console.log("Sending data:", requestData);

      // Use the recommendations API URL from environment variables
      const apiUrl = process.env.NEXT_PUBLIC_RECOMMENDATIONS_API_URL || "https://bba8-45-64-237-226.ngrok-free.app";
      const response = await fetch(`${apiUrl}/recommendations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(requestData),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log("Received data:", data);
      
      // Check if we have the expected data structure
      if (data && data.top_crops) {
        // Transform the API response to match our expected format
        const transformedRecommendations = [
          {
            type: 'farm_assessment',
            overall_score: data.soil_health_score ? (data.soil_health_score / 100) : 0.75,
            soil_health_score: data.soil_health_score ? (data.soil_health_score / 100) : 0.75,
            climate_suitability: data.climate_suitability === "Excellent - Ideal conditions for most crops" ? 0.95 : 0.8,
            summary: `Farm analysis for ${data.farmer_location || `${formData.district}, ${formData.state}`}. ${data.climate_suitability || 'Good conditions for farming'}. ${data.risk_assessment || 'Standard farming conditions'}`,
            key_strengths: [
              data.climate_suitability || "Good climate conditions",
              `Soil health score: ${data.soil_health_score || 75}%`,
              data.risk_assessment || "Favorable farming conditions"
            ],
            areas_for_improvement: [
              "Consider implementing fertilizer recommendations",
              "Follow seasonal calendar for optimal results",
              "Monitor soil nutrients regularly"
            ]
          },
          ...data.top_crops.map((crop: any, index: number) => ({
            type: 'crop_recommendation',
            crop: crop.crop,
            suitability_score: crop.suitability_score || 0,
            expected_yield: `${crop.expected_yield_t_ha || 0} tonnes/ha`,
            season: crop.planting_season?.trim() || 'Not specified',
            reason: `${crop.confidence_level || 'Medium'} confidence recommendation. Expected profit: ₹${crop.estimated_profit_rs_per_ha || 0}/ha. Fertilizer cost: ₹${crop.fertilizer_cost_rs_per_ha || 0}/ha.`,
            location_advantages: crop.region_match ? `Well-suited for ${data.farmer_location || formData.district + ', ' + formData.state} region` : 'Consider local conditions'
          })),
          ...(data.fertilizer_plan ? [{
            type: 'fertilizer_recommendation',
            fertilizer: `NPK Plan - N: ${data.fertilizer_plan.nitrogen_needed_kg_ha}kg/ha, P: ${data.fertilizer_plan.phosphorus_needed_kg_ha}kg/ha, K: ${data.fertilizer_plan.potassium_needed_kg_ha}kg/ha`,
            quantity: `Total cost: ₹${data.fertilizer_plan.total_cost_rs_per_ha}/ha`,
            application_time: data.fertilizer_plan.application_schedule?.join('; ') || 'Follow standard schedule',
            reason: 'Based on soil analysis and crop requirements. Organic alternatives: ' + (data.fertilizer_plan.organic_alternatives?.join(', ') || 'Standard organic options')
          }] : [])
        ];
        
        setRecommendations(transformedRecommendations);
        setSubmitted(true);
        setCurrentStep(steps.length - 1);
      } else {
        throw new Error("Invalid response format from server");
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
                  <option value="">
                    {formData.state ? "Select District" : "Select State First"}
                  </option>
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
                <p className="text-base md:text-lg text-text-secondary">
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
              <RecommendationResults 
                recommendations={recommendations}
                formData={formData}
              />
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
        <div className="container mx-auto px-2 sm:px-4 md:px-6 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-2xl md:text-4xl font-bold text-text-primary mb-2 md:mb-4">
              Crop Recommendation System
            </h1>
            <p className="text-base md:text-lg text-text-secondary">
              Get personalized crop recommendations based on your farm data
            </p>
          </div>

          {/* Voice Assistant */}
          <div className="mb-6 md:mb-8">
            <VoiceFormAssistant 
              formData={formData}
              onFormUpdate={handleInputChange}
              onResponse={(response) => {
                console.log("Voice Assistant Response:", response);
              }}
            />
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8 md:mb-12 overflow-x-auto scrollbar-hide">
            <div className="flex items-center space-x-2 md:space-x-4 min-w-max">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-medium ${
                      index <= currentStep
                        ? "bg-brand-primary text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`ml-1 md:ml-2 text-xs md:text-sm font-medium ${
                      index <= currentStep ? "text-brand-primary" : "text-gray-500"
                    }`}
                  >
                    {step}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="w-8 md:w-16 h-0.5 bg-gray-200 ml-2 md:ml-4"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8">
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
              <div className="flex flex-col md:flex-row justify-between gap-4 mt-8">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                >
                  Previous
                </button>
                <button
                  onClick={nextStep}
                  disabled={currentStep === steps.length - 1}
                  className="bg-brand-primary hover:bg-brand-primary/90 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
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
