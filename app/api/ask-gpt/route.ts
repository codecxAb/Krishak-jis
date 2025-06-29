import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, language, context } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Enhanced system prompt for farming assistant
    const systemPrompt = `${context || 'You are a helpful farming assistant for Indian farmers.'} 
    
    Guidelines:
    - Provide practical, actionable advice about farming, crops, fertilizers, weather, and agricultural techniques
    - Be encouraging and supportive to farmers
    - Use simple, clear language appropriate for farmers
    - Include specific recommendations when possible
    - If the user asks in ${language}, respond in the same language
    - Focus on sustainable and profitable farming practices
    - Consider Indian farming conditions and practices
    
    User's question: ${prompt}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API Error:', errorData);
      return NextResponse.json(
        { error: 'Failed to get AI response' }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || 'मुझे खेद है, मैं आपकी मदद नहीं कर सका।';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
