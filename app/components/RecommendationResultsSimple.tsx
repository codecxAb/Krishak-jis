"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  Calendar,
  Wheat,
  Droplets,
  Award,
  TrendingUp,
  MapPin,
  Clock,
  DollarSign,
  Leaf,
  Sun,
  CloudRain,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Zap,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { format, addMonths } from "date-fns";

interface RecommendationResultsProps {
  recommendations: any[];
  formData: any;
}

const RecommendationResults: React.FC<RecommendationResultsProps> = ({
  recommendations,
  formData,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (containerRef.current) {
      // Animate container entrance
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );

      // Animate individual cards
      const cards = containerRef.current.querySelectorAll(".recommendation-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
          delay: 0.3,
        }
      );
    }
  }, [recommendations]);

  // Extract different types of recommendations
  const farmAssessment = recommendations.find(r => r.type === 'farm_assessment');
  const cropRecommendations = recommendations.filter(r => r.type === 'crop_recommendation');
  const fertilizerPlan = recommendations.find(r => r.type === 'fertilizer_recommendation');

  // Generate calendar data for planting and harvesting
  const generateCalendarData = () => {
    const calendar: Array<{
      crop: string;
      planting: string;
      harvesting: string;
      season: string;
      plantingMonth: string;
      harvestingMonth: string;
    }> = [];
    const currentDate = new Date();
    
    cropRecommendations.forEach((crop, index) => {
      const plantingDate = addMonths(currentDate, index);
      const harvestDate = addMonths(plantingDate, 3 + index); // Rough estimate
      
      calendar.push({
        crop: crop.crop,
        planting: format(plantingDate, 'MMM dd, yyyy'),
        harvesting: format(harvestDate, 'MMM dd, yyyy'),
        season: crop.season,
        plantingMonth: format(plantingDate, 'MMM'),
        harvestingMonth: format(harvestDate, 'MMM'),
      });
    });
    
    return calendar;
  };

  const calendarData = generateCalendarData();

  // Chart data
  const suitabilityData = cropRecommendations.map(crop => ({
    name: crop.crop,
    suitability: Math.round(crop.suitability_score * 100),
    yield: parseFloat(crop.expected_yield) || 0,
  }));

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "crops", label: "Crop Details", icon: Wheat },
    { id: "calendar", label: "Farming Calendar", icon: Calendar },
    { id: "fertilizer", label: "Fertilizer Plan", icon: Droplets },
  ];

  return (
    <div ref={containerRef} className="mx-auto w-full max-w-7xl p-2 sm:p-4 md:p-6 space-y-8">
      {/* Header with Animation */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 bg-green-100 rounded-full">
            <Award className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Farm Recommendation Report
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Personalized insights and recommendations for your farm in {formData.district}, {formData.state}
        </p>
      </div>

      {/* Farm Assessment Overview */}
      {farmAssessment && (
        <div className="recommendation-card bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 shadow-lg border border-green-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Farm Health Assessment</h2>
              <p className="text-gray-600">Overall farm performance and health metrics</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#10B981"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${farmAssessment.overall_score * 251.2} 251.2`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-600">
                    {Math.round(farmAssessment.overall_score * 100)}%
                  </span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-800">Overall Score</h3>
            </div>

            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#3B82F6"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${farmAssessment.soil_health_score * 251.2} 251.2`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {Math.round(farmAssessment.soil_health_score * 100)}%
                  </span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-800">Soil Health</h3>
            </div>

            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#8B5CF6"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${farmAssessment.climate_suitability * 251.2} 251.2`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-600">
                    {Math.round(farmAssessment.climate_suitability * 100)}%
                  </span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-800">Climate Match</h3>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="flex items-center gap-2 font-semibold text-green-700 mb-3">
                <CheckCircle className="w-5 h-5" />
                Key Strengths
              </h3>
              <ul className="space-y-2">
                {farmAssessment.key_strengths?.map((strength: string, index: number) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <Zap className="w-4 h-4 text-green-500" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="flex items-center gap-2 font-semibold text-orange-700 mb-3">
                <AlertTriangle className="w-5 h-5" />
                Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {farmAssessment.areas_for_improvement?.map((area: string, index: number) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-full p-2 shadow-lg border">
          <div className="flex space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-green-500 text-white shadow-lg scale-105"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Crop Suitability Chart */}
            <div className="recommendation-card bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-500" />
                Crop Suitability Scores
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={suitabilityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="suitability" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Expected Yields */}
            <div className="recommendation-card bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-500" />
                Expected Yields
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={suitabilityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="yield"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "crops" && (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {cropRecommendations.map((crop, index) => (
              <div
                key={index}
                className="recommendation-card bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 border border-brand-primary/10 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-brand-accent/20 rounded-full">
                    <Wheat className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-primary leading-tight">{crop.crop}</h3>
                    <p className="text-xs text-brand-accent font-medium uppercase tracking-wide">{crop.season}</p>
                  </div>
                </div>
                <div className="space-y-4 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-secondary">Suitability Score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-brand-accent/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-primary transition-all duration-1000"
                          style={{ width: `${crop.suitability_score * 100}%` }}
                        />
                      </div>
                      <span className="font-semibold text-brand-primary">
                        {Math.round(crop.suitability_score * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-brand-accent" />
                    <span className="text-text-secondary">Expected Yield:</span>
                    <span className="font-semibold text-brand-accent">{crop.expected_yield}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-brand-primary" />
                    <span className="text-text-secondary">Location Match:</span>
                    <span className="font-semibold text-brand-primary">
                      {crop.location_advantages}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-brand-accent/20">
                    <p className="text-xs text-text-secondary leading-relaxed">{crop.reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="recommendation-card bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
              <Calendar className="w-8 h-8 text-green-500" />
              Farming Calendar
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              {calendarData.map((item, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200"
                >
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Wheat className="w-5 h-5 text-green-600" />
                    {item.crop}
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Sun className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Planting Time</p>
                        <p className="font-semibold text-green-700">{item.planting}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-full">
                        <Leaf className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Harvesting Time</p>
                        <p className="font-semibold text-orange-700">{item.harvesting}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <CloudRain className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Best Season</p>
                        <p className="font-semibold text-blue-700">{item.season}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "fertilizer" && fertilizerPlan && (
          <div className="recommendation-card bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
              <Droplets className="w-8 h-8 text-blue-500" />
              Fertilizer Recommendation Plan
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-600" />
                  Fertilizer Details
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Recommended Formula</p>
                    <p className="font-semibold text-blue-700">{fertilizerPlan.fertilizer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Quantity & Cost</p>
                    <p className="font-semibold text-green-700">{fertilizerPlan.quantity}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-xl p-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  Application Schedule
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Timing</p>
                    <p className="font-semibold text-green-700">{fertilizerPlan.application_time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Additional Notes</p>
                    <p className="text-sm text-gray-700">{fertilizerPlan.reason}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center pt-8">
        <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
          <DollarSign className="w-5 h-5" />
          Download Report
        </button>
        {/* <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
          <Calendar className="w-5 h-5" />
          Schedule Consultation
        </button> */}
        <button className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
          <Wheat className="w-5 h-5" />
          Get New Recommendation
        </button>
      </div>
    </div>
  );
};

export default RecommendationResults;
