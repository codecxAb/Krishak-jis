import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, lang, speaker } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Map language codes to appropriate speakers
    const speakerMap: Record<string, string> = {
      'hin': 'hi_speaker',
      'mar': 'mar_speaker', 
      'tel': 'tel_speaker',
      'eng': 'en_speaker',
      'guj': 'guj_speaker',
      'ben': 'ben_speaker',
      'tam': 'tam_speaker',
      'kan': 'kan_speaker',
      'mal': 'mal_speaker',
      'pan': 'pan_speaker'
    };

    const payload = {
      speaker: speaker || speakerMap[lang] || 'en_speaker',
      text: text,
      lang: lang || 'eng',
      audioFormat: 'mp3',
      modelId: 'mistv2'
    };

    const response = await fetch('https://users.rime.ai/v1/rime-tts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer HOo9-DBEOtY6HY5xvHiSgFYBXjMrXryerGTeBwIx4BY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Rime TTS API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to generate speech' }, 
        { status: response.status }
      );
    }

    // Check if response is audio or JSON
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('audio')) {
      // Return audio directly
      const audioBuffer = await response.arrayBuffer();
      return new NextResponse(audioBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': audioBuffer.byteLength.toString(),
        },
      });
    } else {
      // Handle JSON response (might contain audio URL or base64)
      const data = await response.json();
      
      if (data.audioUrl) {
        // If API returns URL, fetch the audio
        const audioResponse = await fetch(data.audioUrl);
        const audioBuffer = await audioResponse.arrayBuffer();
        return new NextResponse(audioBuffer, {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.byteLength.toString(),
          },
        });
      } else if (data.audioData) {
        // If API returns base64 audio data
        const audioBuffer = Buffer.from(data.audioData, 'base64');
        return new NextResponse(audioBuffer, {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.byteLength.toString(),
          },
        });
      } else {
        return NextResponse.json({ error: 'Invalid response format from TTS API' }, { status: 500 });
      }
    }
  } catch (error) {
    console.error('TTS API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
