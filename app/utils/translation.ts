// Translation service for multilingual support
export interface TranslationMap {
  [key: string]: {
    en: string;
    hi: string;
    [key: string]: string;
  };
}

export const translations: TranslationMap = {
  // Navigation
  'nav.home': {
    en: 'Home',
    hi: 'होम'
  },
  'nav.dashboard': {
    en: 'Dashboard',
    hi: 'डैशबोर्ड'
  },
  'nav.recommendations': {
    en: 'Recommendations',
    hi: 'सिफारिशें'
  },
  'nav.voice_agent': {
    en: 'Voice Assistant',
    hi: 'आवाज सहायक'
  },
  'nav.sign_in': {
    en: 'Sign In',
    hi: 'साइन इन'
  },
  
  // Home Page
  'home.title': {
    en: 'Welcome to Krishak',
    hi: 'कृषक में आपका स्वागत है'
  },
  'home.subtitle': {
    en: 'Smart farming solutions for Indian farmers',
    hi: 'भारतीय किसानों के लिए स्मार्ट खेती समाधान'
  },
  
  // Recommendation Form
  'form.personal_details': {
    en: 'Personal Details',
    hi: 'व्यक्तिगत विवरण'
  },
  'form.farmer_name': {
    en: 'Farmer Name',
    hi: 'किसान का नाम'
  },
  'form.contact_number': {
    en: 'Contact Number',
    hi: 'संपर्क नंबर'
  },
  'form.state': {
    en: 'State',
    hi: 'राज्य'
  },
  'form.district': {
    en: 'District',
    hi: 'जिला'
  },
  'form.soil_crop_data': {
    en: 'Soil & Crop Data',
    hi: 'मिट्टी और फसल डेटा'
  },
  'form.soil_type': {
    en: 'Soil Type',
    hi: 'मिट्टी का प्रकार'
  },
  'form.crop_type': {
    en: 'Crop Type',
    hi: 'फसल का प्रकार'
  },
  'form.farm_area': {
    en: 'Farm Area (acres)',
    hi: 'खेत का क्षेत्रफल (एकड़)'
  },
  'form.season': {
    en: 'Season',
    hi: 'मौसम'
  },
  'form.ph_level': {
    en: 'Soil pH Level',
    hi: 'मिट्टी का pH स्तर'
  },
  'form.nitrogen': {
    en: 'Nitrogen (N)',
    hi: 'नाइट्रोजन (N)'
  },
  'form.phosphorus': {
    en: 'Phosphorus (P)',
    hi: 'फास्फोरस (P)'
  },
  'form.potassium': {
    en: 'Potassium (K)',
    hi: 'पोटेशियम (K)'
  },
  'form.get_recommendations': {
    en: 'Get Recommendations',
    hi: 'सिफारिशें प्राप्त करें'
  },
  
  // Recommendations Results
  'results.title': {
    en: 'Your Crop Recommendations',
    hi: 'आपकी फसल सिफारिशें'
  },
  'results.based_on': {
    en: 'Based on your soil and location data',
    hi: 'आपकी मिट्टी और स्थान डेटा के आधार पर'
  },
  'results.recommended_crops': {
    en: 'Recommended Crops',
    hi: 'सुझाई गई फसलें'
  },
  'results.confidence': {
    en: 'Confidence',
    hi: 'विश्वास'
  },
  'results.season_info': {
    en: 'Season',
    hi: 'मौसम'
  },
  'results.soil_compatibility': {
    en: 'Soil Compatibility',
    hi: 'मिट्टी संगतता'
  },
  'results.expected_yield': {
    en: 'Expected Yield',
    hi: 'अपेक्षित उत्पादन'
  },
  'results.farming_tips': {
    en: 'Farming Tips',
    hi: 'खेती के सुझाव'
  },
  
  // Voice Agent
  'voice.title': {
    en: 'Voice Assistant',
    hi: 'आवाज सहायक'
  },
  'voice.subtitle': {
    en: 'Ask me anything about farming in your preferred language',
    hi: 'अपनी पसंदीदा भाषा में खेती के बारे में कुछ भी पूछें'
  },
  'voice.select_language': {
    en: 'Select Language',
    hi: 'भाषा चुनें'
  },
  'voice.start_conversation': {
    en: 'Start Conversation',
    hi: 'बातचीत शुरू करें'
  },
  'voice.listening': {
    en: 'Listening...',
    hi: 'सुन रहा है...'
  },
  'voice.processing': {
    en: 'Processing...',
    hi: 'प्रोसेसिंग...'
  },
  'voice.speak_now': {
    en: 'Speak now',
    hi: 'अब बोलें'
  },
  'voice.tap_to_speak': {
    en: 'Tap to speak',
    hi: 'बोलने के लिए टैप करें'
  },
  
  // Common
  'common.loading': {
    en: 'Loading...',
    hi: 'लोड हो रहा है...'
  },
  'common.error': {
    en: 'Error',
    hi: 'त्रुटि'
  },
  'common.success': {
    en: 'Success',
    hi: 'सफलता'
  },
  'common.cancel': {
    en: 'Cancel',
    hi: 'रद्द करें'
  },
  'common.confirm': {
    en: 'Confirm',
    hi: 'पुष्टि करें'
  },
  'common.back': {
    en: 'Back',
    hi: 'वापस'
  },
  'common.next': {
    en: 'Next',
    hi: 'अगला'
  },
  'common.submit': {
    en: 'Submit',
    hi: 'जमा करें'
  },
  
  // Plant Doctor
  'plant_doctor.title': {
    en: 'Plant Doctor',
    hi: 'पौधे का डॉक्टर'
  },
  'plant_doctor.subtitle': {
    en: 'Upload a photo of your plant and get instant health analysis using AI-powered disease detection.',
    hi: 'अपने पौधे की तस्वीर अपलोड करें और AI-आधारित बीमारी का पता लगाने की सुविधा का उपयोग करके तुरंत स्वास्थ्य विश्लेषण प्राप्त करें।'
  },
  'plant_doctor.upload_image': {
    en: 'Upload Your Plant Image',
    hi: 'अपनी तस्वीर अपलोड करें'
  },
  'plant_doctor.drag_drop': {
    en: 'Drag and drop here or click to browse',
    hi: 'यहाँ खींचें और छोड़ें या ब्राउज़ करने के लिए क्लिक करें'
  },
  'plant_doctor.file_types': {
    en: 'Accepts JPG and PNG files',
    hi: 'JPG या PNG फ़ाइलें स्वीकार की जाती हैं'
  },
  'plant_doctor.choose_file': {
    en: 'Choose File',
    hi: 'फ़ाइल चुनें'
  },
  'plant_doctor.analyze_plant': {
    en: 'Analyze Plant',
    hi: 'पौधे का विश्लेषण करें'
  },
  'plant_doctor.analyzing': {
    en: 'Analyzing...',
    hi: 'विश्लेषण कर रहे हैं...'
  },
  'plant_doctor.plant_name': {
    en: 'Plant Name',
    hi: 'पौधे का नाम'
  },
  'plant_doctor.health_status': {
    en: 'Health Status',
    hi: 'स्वास्थ्य स्थिति'
  },
  'plant_doctor.confidence_scores': {
    en: 'Confidence Scores',
    hi: 'विश्वास स्कोर'
  },
  'plant_doctor.healthy': {
    en: 'Healthy',
    hi: 'स्वस्थ'
  },
  'plant_doctor.diseased': {
    en: 'Diseased',
    hi: 'रोगग्रस्त'
  },
  'plant_doctor.detailed_analysis': {
    en: 'Detailed Analysis',
    hi: 'विस्तृत विश्लेषण'
  },
  'plant_doctor.results_here': {
    en: 'Results will appear here',
    hi: 'परिणाम यहाँ दिखाए जाएंगे'
  },
  'plant_doctor.error': {
    en: 'Error',
    hi: 'त्रुटि'
  },

  // Dashboard tabs
  'dashboard.overview': {
    en: 'Overview',
    hi: 'अवलोकन'
  },
  'dashboard.plant_doctor': {
    en: 'Plant Doctor',
    hi: 'पौधे का डॉक्टर'
  },
  'dashboard.analytics': {
    en: 'Analytics',
    hi: 'विश्लेषण'
  },
  'dashboard.tasks': {
    en: 'Tasks',
    hi: 'कार्य'
  },
  'dashboard.analytics_coming_soon': {
    en: 'Analytics Coming Soon',
    hi: 'विश्लेषण आ रहा है'
  },
  'dashboard.analytics_description': {
    en: 'Detailed farm analytics and insights will be available soon.',
    hi: 'विस्तृत फार्म विश्लेषण और अंतर्दृष्टि जल्द ही उपलब्ध होगी।'
  },
  'dashboard.task_management_coming_soon': {
    en: 'Task Management Coming Soon',
    hi: 'कार्य प्रबंधन आ रहा है'
  },
  'dashboard.task_management_description': {
    en: 'Advanced task management features will be available soon.',
    hi: 'उन्नत कार्य प्रबंधन सुविधाएँ जल्द ही उपलब्ध होंगी।'
  },
  'dashboard.chatbot_assistant': {
    en: 'AI Assistant',
    hi: 'एआई सहायक'
  },
  'dashboard.chatbot_description': {
    en: 'Ask questions about farming, crops, and get expert advice.',
    hi: 'खेती, फसलों के बारे में सवाल पूछें और विशेषज्ञ सलाह प्राप्त करें।'
  },
};

export class TranslationService {
  private currentLanguage: string = 'en';
  
  setLanguage(language: string) {
    this.currentLanguage = language;
  }
  
  getCurrentLanguage(): string {
    return this.currentLanguage;
  }
  
  translate(key: string, fallback?: string): string {
    const translation = translations[key];
    if (translation && translation[this.currentLanguage]) {
      return translation[this.currentLanguage];
    }
    return fallback || key;
  }
  
  // Translate dynamic content (like recommendation results)
  async translateDynamicContent(text: string, targetLanguage: string): Promise<string> {
    if (targetLanguage === 'en' || !text) {
      return text;
    }
    
    try {
      // For production, you might want to use Google Translate API or similar
      // For now, we'll use a simple API call to a translation service
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          from: 'en',
          to: targetLanguage
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.translatedText || text;
      }
    } catch (error) {
      console.error('Translation error:', error);
    }
    
    return text;
  }
  
  // Get all available languages
  getAvailableLanguages() {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' }
    ];
  }
}

// Singleton instance
export const translationService = new TranslationService();

// Hook for React components
export function useTranslation(language: string) {
  translationService.setLanguage(language);
  
  return {
    t: (key: string, fallback?: string) => translationService.translate(key, fallback),
    translateDynamic: (text: string) => translationService.translateDynamicContent(text, language),
    currentLanguage: language,
    availableLanguages: translationService.getAvailableLanguages()
  };
}
