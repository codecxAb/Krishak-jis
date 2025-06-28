"use client";
import React, { useState, useRef, useEffect } from "react";
import { FiMic, FiMicOff, FiVolume2, FiVolumeX, FiMessageCircle } from "react-icons/fi";

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceAssistantProps {
  onResponse?: (response: string) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ 
  onResponse
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

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
        handleSpeechQuery(speechResult);
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

  const handleSpeechQuery = async (query: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.response || "Sorry, I couldn't process your request.";
      
      setResponse(aiResponse);
      if (onResponse) {
        onResponse(aiResponse);
      }

      // Speak the response
      speakText(aiResponse);

    } catch (error) {
      const errorMsg = `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`;
      setError(errorMsg);
      speakText("Sorry, I encountered an error processing your request.");
    } finally {
      setIsProcessing(false);
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
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <FiMessageCircle className="mr-2 text-green-600" />
          Krishak Voice Assistant
        </h3>
        
        <div className="flex items-center space-x-2">
          {/* Voice Input Button */}
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing || isSpeaking}
            className={`p-3 rounded-full transition-all duration-300 ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                : 'bg-green-500 hover:bg-green-600 text-white'
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
                ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                : 'bg-gray-300 text-gray-500'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSpeaking ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
          </button>
        </div>
      </div>

      {/* Status Display */}
      <div className="mb-4">
        {isListening && (
          <div className="flex items-center text-blue-600 text-sm">
            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></div>
            Listening... Speak now
          </div>
        )}
        
        {isProcessing && (
          <div className="flex items-center text-orange-600 text-sm">
            <div className="w-2 h-2 bg-orange-600 rounded-full mr-2 animate-pulse"></div>
            Processing your question...
          </div>
        )}
        
        {isSpeaking && (
          <div className="flex items-center text-green-600 text-sm">
            <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></div>
            Speaking response...
          </div>
        )}
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>You said:</strong> {transcript}
          </p>
        </div>
      )}

      {/* Response Display */}
      {response && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Krishak AI:</strong> {response}
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
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Click the microphone to start voice input</p>
        <p>• Ask questions about farming, crops, soil, or weather</p>
        <p>• Click the speaker button to stop audio response</p>
      </div>
    </div>
  );
};

export default VoiceAssistant;
