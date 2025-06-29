"use client";
import { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  MessageCircle, 
  Globe, 
  User, 
  Bot,
  Settings,
  X,
  Play,
  Pause
} from 'lucide-react';

const LANGUAGES = [
  { code: 'hin', name: 'हिंदी (Hindi)', speaker: 'hi_speaker', flag: '🇮🇳' },
  { code: 'mar', name: 'मराठी (Marathi)', speaker: 'mar_speaker', flag: '🇮🇳' },
  { code: 'tel', name: 'తెలుగు (Telugu)', speaker: 'tel_speaker', flag: '🇮🇳' },
  { code: 'tam', name: 'தமிழ் (Tamil)', speaker: 'tam_speaker', flag: '🇮🇳' },
  { code: 'ben', name: 'বাংলা (Bengali)', speaker: 'ben_speaker', flag: '🇮🇳' },
  { code: 'guj', name: 'ગુજરાતી (Gujarati)', speaker: 'guj_speaker', flag: '🇮🇳' },
  { code: 'kan', name: 'ಕನ್ನಡ (Kannada)', speaker: 'kan_speaker', flag: '🇮🇳' },
  { code: 'mal', name: 'മലയാളം (Malayalam)', speaker: 'mal_speaker', flag: '🇮🇳' },
  { code: 'pan', name: 'ਪੰਜਾਬੀ (Punjabi)', speaker: 'pan_speaker', flag: '🇮🇳' },
  { code: 'eng', name: 'English', speaker: 'en_speaker', flag: '🇺🇸' }
];

interface ConversationEntry {
  from: 'user' | 'bot';
  text: string;
  timestamp: Date;
  audioUrl?: string;
}

export default function VoiceAgent() {
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window === 'undefined' || !('webkitSpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = language.code === 'eng' ? 'en-US' : `${language.code}-IN`;
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;
    
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = async (event: any) => {
      const userText = event.results[0][0].transcript;
      const userEntry: ConversationEntry = {
        from: 'user',
        text: userText,
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, userEntry]);
      setListening(false);
      setIsLoading(true);

      try {
        const reply = await fetchGPTReply(userText);
        const botEntry: ConversationEntry = {
          from: 'bot',
          text: reply,
          timestamp: new Date()
        };
        
        setConversation(prev => [...prev, botEntry]);
        await speakText(reply);
      } catch (error) {
        console.error('Error processing conversation:', error);
        const errorEntry: ConversationEntry = {
          from: 'bot',
          text: 'मुझे खेद है, मैं आपकी बात समझ नहीं सका। कृपया फिर से कोशिश करें।',
          timestamp: new Date()
        };
        setConversation(prev => [...prev, errorEntry]);
      } finally {
        setIsLoading(false);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setListening(false);
      setIsLoading(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    return () => {
      recognition?.stop();
    };
  }, [language]);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  // Add welcome message when language changes
  useEffect(() => {
    const welcomeMessages = {
      'hin': 'नमस्ते! मैं आपका कृषक सहायक हूं। खेती-बाड़ी के बारे में कुछ भी पूछें।',
      'mar': 'नमस्कार! मी तुमचा कृषक सहायक आहे. शेतीविषयक कोणताही प्रश्न विचारा.',
      'tel': 'నమస్కారం! నేను మీ కృషక సహాయకుడిని. వ్యవసాయం గురించి ఏదైనా అడగండి.',
      'tam': 'வணக்கம்! நான் உங்கள் கிருஷக் உதவியாளர். விவசாயம் பற்றி எதுவேனும் கேளுங்கள்.',
      'ben': 'নমস্কার! আমি আপনার কৃষক সহায়ক। কৃষিকাজ সম্পর্কে যেকোনো প্রশ্ন করুন।',
      'guj': 'નમસ્તે! હું તમારો કૃષક સહાયક છું. ખેતી વિશે કંઈપણ પૂછો.',
      'kan': 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕೃಷಕ ಸಹಾಯಕ. ಕೃಷಿಯ ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ.',
      'mal': 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ കൃഷക സഹായകൻ. കൃഷിയെക്കുറിച്ച് എന്തും ചോദിക്കൂ.',
      'pan': 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਕਿਸਾਨ ਸਹਾਇਕ ਹਾਂ। ਖੇਤੀ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ।',
      'eng': 'Hello! I am your Krishak assistant. Ask me anything about farming and agriculture.'
    };

    if (conversation.length === 0) {
      const welcomeEntry: ConversationEntry = {
        from: 'bot',
        text: welcomeMessages[language.code as keyof typeof welcomeMessages] || welcomeMessages.eng,
        timestamp: new Date()
      };
      setConversation([welcomeEntry]);
    }
  }, [language]);

  const fetchGPTReply = async (userText: string): Promise<string> => {
    const response = await fetch('/api/ask-gpt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: userText, 
        language: language.code,
        context: "You are a helpful farming assistant for Indian farmers. Provide practical advice about crops, fertilizers, weather, and farming techniques. Respond in the user's language."
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    return data.reply;
  };

  const speakText = async (text: string): Promise<void> => {
    setSpeaking(true);
    try {
      const response = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text, 
          lang: language.code, 
          speaker: language.speaker 
        })
      });

      if (!response.ok) {
        throw new Error('TTS request failed');
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      
      setCurrentAudio(audio);
      
      audio.onended = () => {
        setSpeaking(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error('TTS Error:', error);
      setSpeaking(false);
    }
  };

  const toggleListening = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
    } else {
      if (speaking && currentAudio) {
        currentAudio.pause();
        setSpeaking(false);
      }
      recognitionRef.current?.start();
    }
  };

  const stopSpeaking = () => {
    if (currentAudio) {
      currentAudio.pause();
      setSpeaking(false);
      setCurrentAudio(null);
    }
  };

  const clearConversation = () => {
    setConversation([]);
    stopSpeaking();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-green-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">🧑‍🌾 Krishak Voice Assistant</h1>
                <p className="text-sm text-gray-600">स्मार्ट खेती के लिए आपका AI सहायक</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLanguageModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="text-lg">{language.flag}</span>
                <span className="font-medium">{language.name.split(' ')[0]}</span>
              </button>
              <button
                onClick={clearConversation}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Clear conversation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Conversation Area */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 h-96 overflow-y-auto border border-green-100">
          <div className="p-6 space-y-4">
            {conversation.map((entry, index) => (
              <div
                key={index}
                className={`flex ${entry.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    entry.from === 'user'
                      ? 'bg-green-500 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {entry.from === 'bot' && (
                      <Bot className="w-4 h-4 mt-1 text-green-600 flex-shrink-0" />
                    )}
                    {entry.from === 'user' && (
                      <User className="w-4 h-4 mt-1 text-white flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{entry.text}</p>
                      <p className={`text-xs mt-1 ${
                        entry.from === 'user' ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        {formatTime(entry.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-green-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={conversationEndRef} />
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
          <div className="flex items-center justify-center gap-4">
            {/* Main Voice Button */}
            <button
              onClick={toggleListening}
              disabled={isLoading || speaking}
              className={`p-6 rounded-full transition-all duration-300 transform hover:scale-105 ${
                listening
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200'
                  : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-200'
              } ${(isLoading || speaking) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {listening ? (
                <MicOff className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>

            {/* Stop Speaking Button */}
            {speaking && (
              <button
                onClick={stopSpeaking}
                className="p-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-200"
              >
                <Pause className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Status Text */}
          <div className="text-center mt-4">
            {listening && (
              <p className="text-red-600 font-medium animate-pulse">
                🎤 सुन रहा हूं... बोलें
              </p>
            )}
            {isLoading && (
              <p className="text-blue-600 font-medium">
                🤔 सोच रहा हूं...
              </p>
            )}
            {speaking && (
              <p className="text-green-600 font-medium animate-pulse">
                🔊 बोल रहा हूं...
              </p>
            )}
            {!listening && !isLoading && !speaking && (
              <p className="text-gray-600">
                🎙️ बातचीत शुरू करने के लिए माइक बटन दबाएं
              </p>
            )}
          </div>

          {/* Language Info */}
          <div className="text-center mt-2">
            <p className="text-sm text-gray-500">
              वर्तमान भाषा: <span className="font-medium text-blue-600">{language.name}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">भाषा चुनें / Choose Language</h2>
                <button
                  onClick={() => setShowLanguageModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLanguageModal(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                      language.code === lang.code
                        ? 'bg-green-100 text-green-700 border-2 border-green-300'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
