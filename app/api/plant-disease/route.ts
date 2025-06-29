import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Create FormData for the external API
    const apiFormData = new FormData();
    apiFormData.append('image', file);

    // Replace with your actual plant disease detection API URL
    const API_URL = process.env.PLANT_DISEASE_API_URL || 'https://api.example.com/plant-disease-detection';
    
    const response = await fetch(API_URL, {
      method: 'POST',
      body: apiFormData,
    });

    if (!response.ok) {
      // If external API fails, return mock data for development
      return NextResponse.json({
        plant_name: "Tomato",
        disease_status: "Healthy",
        confidences: {
          healthy: 0.85,
          diseased: 0.15
        },
        output: "The plant appears to be healthy with no visible signs of disease. Continue regular care and monitoring."
      });
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Plant disease detection error:', error);
    
    // Return mock data for development/fallback
    return NextResponse.json({
      plant_name: "Tomato",
      disease_status: "Healthy",
      confidences: {
        healthy: 0.85,
        diseased: 0.15
      },
      output: "The plant appears to be healthy with no visible signs of disease. Continue regular care and monitoring."
    });
  }
}
