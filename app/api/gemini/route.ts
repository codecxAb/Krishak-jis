import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Use the correct Gemini API endpoint
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    const payload = {
      contents: [
        {
          parts: [
            {
              text: `You are Krishak AI, a helpful farming assistant. Please provide helpful, accurate information about farming, agriculture, crops, soil, weather, and related topics. Keep responses concise but informative. User question: ${message}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    console.log('Making request to Gemini API...');
    
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('Gemini API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      
      return NextResponse.json(
        { error: `Gemini API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Gemini API response:', data);

    // Extract the generated text from the response
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';

    return NextResponse.json({
      response: generatedText,
      success: true
    });

  } catch (error) {
    console.error('Error in Gemini API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
