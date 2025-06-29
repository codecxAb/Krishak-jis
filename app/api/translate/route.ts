import { NextRequest, NextResponse } from 'next/server';

// Simple translation mappings for common farming terms
const translationMappings: Record<string, Record<string, string>> = {
  hi: {
    // Common farming terms
    'wheat': 'गेहूं',
    'rice': 'चावल',
    'maize': 'मक्का',
    'corn': 'मक्का',
    'sugarcane': 'गन्ना',
    'cotton': 'कपास',
    'soybean': 'सोयाबीन',
    'groundnut': 'मूंगफली',
    'peanut': 'मूंगफली',
    'mustard': 'सरसों',
    'barley': 'जौ',
    'pulses': 'दालें',
    'lentils': 'दालें',
    
    // Soil types
    'alluvial soil': 'जलोढ़ मिट्टी',
    'black soil': 'काली मिट्टी',
    'red soil': 'लाल मिट्टी',
    'laterite soil': 'लेटराइट मिट्टी',
    'desert soil': 'रेगिस्तानी मिट्टी',
    'mountain soil': 'पर्वतीय मिट्टी',
    
    // Seasons
    'kharif': 'खरीफ',
    'rabi': 'रबी',
    'zaid': 'जायद',
    'monsoon': 'मानसून',
    'winter': 'सर्दी',
    'summer': 'गर्मी',
    
    // Farming terms
    'fertilizer': 'उर्वरक',
    'pesticide': 'कीटनाशक',
    'irrigation': 'सिंचाई',
    'harvest': 'फसल कटाई',
    'sowing': 'बुवाई',
    'planting': 'रोपण',
    'yield': 'उत्पादन',
    'crop': 'फसल',
    'field': 'खेत',
    'farm': 'खेत',
    'farmer': 'किसान',
    'agriculture': 'कृषि',
    'farming': 'खेती',
    
    // Nutrients
    'nitrogen': 'नाइट्रोजन',
    'phosphorus': 'फास्फोरस',
    'potassium': 'पोटेशियम',
    'organic matter': 'जैविक पदार्थ',
    
    // Common phrases
    'recommended': 'सुझाई गई',
    'suitable': 'उपयुक्त',
    'good': 'अच्छा',
    'excellent': 'उत्कृष्ट',
    'moderate': 'मध्यम',
    'low': 'कम',
    'high': 'उच्च',
    'water': 'पानी',
    'temperature': 'तापमान',
    'humidity': 'नमी',
    'rainfall': 'बारिश',
    'climate': 'जलवायु',
    'weather': 'मौसम'
  }
};

function simpleTranslate(text: string, targetLang: string): string {
  if (targetLang === 'en' || !text) {
    return text;
  }
  
  const mappings = translationMappings[targetLang];
  if (!mappings) {
    return text;
  }
  
  let translatedText = text.toLowerCase();
  
  // Replace known terms
  Object.entries(mappings).forEach(([english, translation]) => {
    const regex = new RegExp(`\\b${english.toLowerCase()}\\b`, 'gi');
    translatedText = translatedText.replace(regex, translation);
  });
  
  // Handle sentence structures for Hindi
  if (targetLang === 'hi') {
    // Basic sentence pattern adjustments
    translatedText = translatedText
      .replace(/is recommended/gi, 'की सिफारिश की जाती है')
      .replace(/is suitable/gi, 'उपयुक्त है')
      .replace(/is good/gi, 'अच्छा है')
      .replace(/for your/gi, 'आपके लिए')
      .replace(/in your/gi, 'आपके में')
      .replace(/based on/gi, 'के आधार पर')
      .replace(/you should/gi, 'आपको चाहिए')
      .replace(/it is/gi, 'यह है')
      .replace(/this is/gi, 'यह है')
      .replace(/the best/gi, 'सबसे अच्छा')
      .replace(/very good/gi, 'बहुत अच्छा')
      .replace(/quite good/gi, 'काफी अच्छा');
  }
  
  return translatedText;
}

export async function POST(request: NextRequest) {
  try {
    const { text, from, to } = await request.json();
    
    if (!text || !to) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      );
    }
    
    // Use simple translation for now
    const translatedText = simpleTranslate(text, to);
    
    return NextResponse.json({
      translatedText,
      originalText: text,
      sourceLanguage: from || 'en',
      targetLanguage: to
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}
