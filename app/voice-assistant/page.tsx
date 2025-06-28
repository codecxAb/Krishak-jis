"use client";
import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../utils/firebase";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";
import Navbar from "../components/Navbar";
import FarmingChatBot from "../components/FarmingChatBot";
import { FiMessageCircle, FiMic, FiHeadphones } from "react-icons/fi";

const VoiceAssistantPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        router.push("/signin");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to signin
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar user={user} />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <FiHeadphones className="mr-3 text-green-600" />
              Krishak AI Voice Assistant
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get instant answers to your farming questions using voice or text. 
              Our AI assistant is trained to help with crops, soil, weather, and agricultural practices.
            </p>
          </div>

          {/* Features Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
              <div className="flex items-center mb-4">
                <FiMic className="text-3xl text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">Voice Input</h3>
              </div>
              <p className="text-gray-600">
                Speak naturally about your farming questions. Our voice recognition 
                understands farming terminology and regional accents.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
              <div className="flex items-center mb-4">
                <FiMessageCircle className="text-3xl text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">Smart Chat</h3>
              </div>
              <p className="text-gray-600">
                Type your questions and get instant responses. Perfect for detailed 
                farming advice and step-by-step guidance.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
              <div className="flex items-center mb-4">
                <FiHeadphones className="text-3xl text-purple-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">Audio Responses</h3>
              </div>
              <p className="text-gray-600">
                Listen to responses in clear speech. Great for hands-free operation 
                while working in the field.
              </p>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="mb-8">
            <FarmingChatBot />
          </div>

          {/* Tips Section */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FiMessageCircle className="mr-2 text-green-600" />
              💡 Ask me about:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
              <ul className="space-y-2">
                <li>🌾 <strong>Crop Selection:</strong> "What crops grow well in Punjab?"</li>
                <li>🌱 <strong>Planting:</strong> "When should I plant wheat?"</li>
                <li>💧 <strong>Irrigation:</strong> "How much water does rice need?"</li>
              </ul>
              <ul className="space-y-2">
                <li>🌍 <strong>Soil Health:</strong> "How to improve soil fertility?"</li>
                <li>🐛 <strong>Pest Control:</strong> "Natural pest control methods"</li>
                <li>🌦️ <strong>Weather:</strong> "Monsoon farming tips"</li>
              </ul>
              <ul className="space-y-2">
                <li>🧪 <strong>Fertilizers:</strong> "Organic fertilizer recommendations"</li>
                <li>📈 <strong>Market:</strong> "Best time to sell crops"</li>
                <li>🔄 <strong>Crop Rotation:</strong> "Sustainable farming practices"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistantPage;
