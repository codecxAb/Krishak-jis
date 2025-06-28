"use client";
import React, { useState, useRef, useEffect } from "react";
import { FiMic, FiMicOff, FiVolume2, FiVolumeX, FiMessageCircle, FiEdit3 } from "react-icons/fi";

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

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

interface VoiceFormAssistantProps {
  formData: FormData;
  onFormUpdate: (field: keyof FormData, value: string | number) => void;
  onResponse?: (response: string) => void;
}

const VoiceFormAssistant: React.FC<VoiceFormAssistantProps> = ({ 
  formData,
  onFormUpdate,
  onResponse
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [lastAction, setLastAction] = useState("");

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;

    if (SpeechRecognition && speechSynthesis) {
      setIsSupported(true);
      synthRef.current = speechSynthesis;

      // Initialize speech recognition
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
        handleVoiceCommand(speechResult);
      };

      recognition.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setError("Speech recognition not supported in this browser");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const extractFormData = (text: string): { field: keyof FormData; value: string | number } | null => {
    const lowerText = text.toLowerCase();
    
    // State extraction
    const states = ["punjab", "haryana", "uttar pradesh", "maharashtra", "gujarat", "karnataka"];
    const foundState = states.find(state => lowerText.includes(state));
    if (foundState) {
      const properState = foundState.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      return { field: 'state', value: properState };
    }

    // Farm size extraction
    const farmSizeMatch = lowerText.match(/(\d+(?:\.\d+)?)\s*(?:acres?|hectares?)/);
    if (farmSizeMatch) {
      return { field: 'farm_size', value: parseFloat(farmSizeMatch[1]) };
    }

    // Crop type extraction
    const crops = ["rice", "wheat", "cotton", "sugarcane", "maize", "pulses", "vegetables"];
    const foundCrop = crops.find(crop => lowerText.includes(crop));
    if (foundCrop) {
      const properCrop = foundCrop.charAt(0).toUpperCase() + foundCrop.slice(1);
      return { field: 'primary_crop_type', value: properCrop };
    }

    // Soil type extraction
    const soilTypes = ["alluvial", "black", "red", "laterite", "sandy", "loamy", "clay"];
    const foundSoil = soilTypes.find(soil => lowerText.includes(soil));
    if (foundSoil) {
      const properSoil = foundSoil.charAt(0).toUpperCase() + foundSoil.slice(1);
      return { field: 'soil_type', value: properSoil };
    }

    // Temperature extraction
    const tempMatch = lowerText.match(/(\d+(?:\.\d+)?)\s*(?:degrees?|celsius|°c)/);
    if (tempMatch) {
      return { field: 'temperature', value: parseFloat(tempMatch[1]) };
    }

    // pH level extraction
    const phMatch = lowerText.match(/ph\s*(?:is\s*|level\s*)?(\d+(?:\.\d+)?)/);
    if (phMatch) {
      return { field: 'ph_level', value: parseFloat(phMatch[1]) };
    }

    // Humidity extraction
    const humidityMatch = lowerText.match(/(\d+(?:\.\d+)?)\s*percent\s*humidity/);
    if (humidityMatch) {
      return { field: 'humidity', value: parseFloat(humidityMatch[1]) };
    }

    return null;
  };

  const handleVoiceCommand = async (command: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      // First, try to extract form data
      const formUpdate = extractFormData(command);
      if (formUpdate) {
        onFormUpdate(formUpdate.field, formUpdate.value);
        setLastAction(`Updated ${formUpdate.field} to ${formUpdate.value}`);
        speakText(`I've updated your ${formUpdate.field.replace('_', ' ')} to ${formUpdate.value}`);
        setIsProcessing(false);
        return;
      }

      // If no form data found, send to Gemini AI
      const prompt = `You are Krishak AI, a farming assistant helping farmers fill out a crop recommendation form. 
      The farmer said: "${command}"
      
      Current form data: ${JSON.stringify(formData, null, 2)}
      
      Please provide helpful advice about farming, crops, soil management, or answer their question. 
      If they're asking about what to enter in the form, guide them based on their location and farming conditions.
      Keep your response under 80 words and practical.`;

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.response || "Sorry, I couldn't process your request.";
      
      setResponse(aiResponse);
      setLastAction("Provided farming advice");
      
      if (onResponse) {
        onResponse(aiResponse);
      }

      // Speak the response
      speakText(aiResponse);

    } catch (error) {
      const errorMsg = `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`;
      setError(errorMsg);
      speakText("Sorry, I encountered an error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        setError("Failed to start speech recognition");
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speakText = (text: string) => {
    if (synthRef.current && text) {
      // Cancel any ongoing speech
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        setError("Speech synthesis error");
      };

      synthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700 text-sm">
          Voice assistant is not supported in this browser. Please use Chrome, Safari, or Edge.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-lg p-6 border border-green-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <FiEdit3 className="mr-2 text-green-600" />
          Smart Form Assistant
        </h3>
        
        <div className="flex items-center space-x-2">
          {/* Voice Input Button */}
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing || isSpeaking}
            className={`p-3 rounded-full transition-all duration-300 ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-lg' 
                : 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isListening ? <FiMicOff size={20} /> : <FiMic size={20} />}
          </button>

          {/* Stop Speaking Button */}
          <button
            onClick={stopSpeaking}
            disabled={!isSpeaking}
            className={`p-3 rounded-full transition-all duration-300 ${
              isSpeaking 
                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg' 
                : 'bg-gray-300 text-gray-500'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSpeaking ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
          </button>
        </div>
      </div>

      {/* Status Display */}
      <div className="mb-4 min-h-[20px]">
        {isListening && (
          <div className="flex items-center text-blue-600 text-sm font-medium">
            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></div>
            🎤 Listening... Tell me about your farm
          </div>
        )}
        
        {isProcessing && (
          <div className="flex items-center text-orange-600 text-sm font-medium">
            <div className="w-2 h-2 bg-orange-600 rounded-full mr-2 animate-pulse"></div>
            🤔 Processing your information...
          </div>
        )}
        
        {isSpeaking && (
          <div className="flex items-center text-green-600 text-sm font-medium">
            <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></div>
            🔊 Speaking response...
          </div>
        )}

        {lastAction && !isListening && !isProcessing && !isSpeaking && (
          <div className="flex items-center text-green-700 text-sm">
            <div className="w-2 h-2 bg-green-700 rounded-full mr-2"></div>
            ✅ {lastAction}
          </div>
        )}
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>You said:</strong> "{transcript}"
          </p>
        </div>
      )}

      {/* Response Display */}
      {response && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>🌾 Krishak AI:</strong> {response}
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="text-xs text-gray-600 space-y-1 bg-white p-3 rounded-lg">
        <p className="font-medium text-gray-700 mb-2">💡 Voice Commands Examples:</p>
        <p>• "My farm is in Punjab" - Sets your state</p>
        <p>• "I have 5 acres of land" - Sets farm size</p>
        <p>• "I grow wheat" - Sets primary crop</p>
        <p>• "The soil is sandy" - Sets soil type</p>
        <p>• "Temperature is 25 degrees" - Sets temperature</p>
        <p>• "pH level is 6.5" - Sets pH level</p>
        <p>• Or ask questions like "What crops grow well in Punjab?"</p>
      </div>
    </div>
  );
};

export default VoiceFormAssistant;
