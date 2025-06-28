"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Calendar,
  Wheat,
  Droplets,
  Thermometer,
  Award,
  TrendingUp,
  MapPin,
  Clock,
  DollarSign,
  Leaf,
  Sun,
  CloudRain,
  BarChart3,
  PieChart,
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
  PieChart as RechartsPieChart,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { format, addDays, addMonths } from "date-fns";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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

      // Setup scroll animations
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { x: index % 2 === 0 ? -50 : 50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
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

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "crops", label: "Crop Details", icon: Wheat },
    { id: "calendar", label: "Farming Calendar", icon: Calendar },
    { id: "fertilizer", label: "Fertilizer Plan", icon: Droplets },
  ];

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto p-6 space-y-8">
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
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="recommendation-card bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 shadow-lg border border-green-200"
        >
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
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <Zap className="w-4 h-4 text-green-500" />
                    {strength}
                  </motion.li>
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
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    {area}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
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
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid lg:grid-cols-2 gap-8"
          >
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
          </motion.div>
        )}

        {activeTab === "crops" && (
          <motion.div
            key="crops"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {cropRecommendations.map((crop, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="recommendation-card bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Wheat className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{crop.crop}</h3>
                    <p className="text-sm text-gray-500">{crop.season}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Suitability Score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all duration-1000"
                          style={{ width: `${crop.suitability_score * 100}%` }}
                        />
                      </div>
                      <span className="font-semibold text-green-600">
                        {Math.round(crop.suitability_score * 100)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600">Expected Yield:</span>
                    <span className="font-semibold text-blue-600">{crop.expected_yield}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-500" />
                    <span className="text-gray-600">Location Match:</span>
                    <span className="font-semibold text-purple-600">
                      {crop.location_advantages}
                    </span>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600">{crop.reason}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === "calendar" && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="recommendation-card bg-white rounded-2xl p-8 shadow-lg"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
              <Calendar className="w-8 h-8 text-green-500" />
              Farming Calendar
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              {calendarData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
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
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "fertilizer" && fertilizerPlan && (
          <motion.div
            key="fertilizer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="recommendation-card bg-white rounded-2xl p-8 shadow-lg"
          >
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap gap-4 justify-center pt-8"
      >
        <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
          <DollarSign className="w-5 h-5" />
          Download Report
        </button>
        <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
          <Calendar className="w-5 h-5" />
          Schedule Consultation
        </button>
        <button className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
          <Wheat className="w-5 h-5" />
          Get New Recommendation
        </button>
      </motion.div>
    </div>
  );
};

export default RecommendationResults;
