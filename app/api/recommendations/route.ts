import { NextRequest, NextResponse } from 'next/server';
import indianGeoData from "../../../indian_geo.json";

interface RecommendationRequest {
  user_id: string;
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

interface RecommendationResponse {
  recommendations: any[];
  status: string;
  message?: string;
}

interface Recommendation {
  type: string;
  [key: string]: any;
}

export async function POST(request: NextRequest): Promise<NextResponse<RecommendationResponse>> {
  try {
    const body: RecommendationRequest = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'user_id', 'state', 'district', 'farm_size', 'primary_crop_type', 
      'irrigation_method', 'nitrogen_level', 'phosphorus_level', 
      'potassium_level', 'calcium_content', 'ph_level', 'soil_type', 
      'temperature', 'humidity', 'water_content'
    ];
    
    for (const field of requiredFields) {
      if (!body[field as keyof RecommendationRequest]) {
        return NextResponse.json({
          status: 'error',
          message: `Missing required field: ${field}`,
          recommendations: []
        }, { status: 400 });
      }
    }

    // Validate state and district from geographical data
    const stateData = indianGeoData.states.find(stateData => stateData.state === body.state);
    if (!stateData) {
      return NextResponse.json({
        status: 'error',
        message: `Invalid state: ${body.state}`,
        recommendations: []
      }, { status: 400 });
    }

    const districtExists = stateData.districts.includes(body.district);
    if (!districtExists) {
      return NextResponse.json({
        status: 'error',
        message: `Invalid district: ${body.district} for state: ${body.state}`,
        recommendations: []
      }, { status: 400 });
    }

    // TODO: Replace this with actual ML model API call
    // For now, we'll return mock recommendations based on the data
    const recommendations = generateMockRecommendations(body);
    
    // Log the request for debugging
    console.log('Recommendation request for user:', body.user_id);
    console.log('Request data:', body);
    
    return NextResponse.json({
      status: 'success',
      recommendations,
      message: 'Recommendations generated successfully'
    });
    
  } catch (error) {
    console.error('Error processing recommendation request:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Failed to process recommendation request',
      recommendations: []
    }, { status: 500 });
  }
}

// Mock recommendation generator - replace with actual ML model
function generateMockRecommendations(data: RecommendationRequest): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  // Basic recommendation logic based on soil and climate data
  const soilScore = calculateSoilScore(data);
  const climateScore = calculateClimateScore(data);
  
  // Location-specific crop recommendations
  const locationBasedCrops = getLocationBasedCrops(data.state, data.district);
  
  // Crop suitability recommendations based on location and soil
  if (data.soil_type === 'Alluvial' && data.ph_level >= 6.0 && data.ph_level <= 7.5) {
    const suitableCrop = locationBasedCrops.primary[0] || 'Rice';
    recommendations.push({
      type: 'crop_recommendation',
      crop: suitableCrop,
      suitability_score: 0.9,
      reason: `Alluvial soil with optimal pH is excellent for ${suitableCrop} cultivation in ${data.district}, ${data.state}`,
      expected_yield: getExpectedYield(suitableCrop, data.state),
      season: getCropSeason(suitableCrop, data.state),
      location_advantages: `${data.district} district is known for successful ${suitableCrop} cultivation`
    });
  }
  
  // Add alternative crops based on location
  if (locationBasedCrops.secondary.length > 0) {
    recommendations.push({
      type: 'alternative_crops',
      crops: locationBasedCrops.secondary,
      reason: `These crops are also commonly grown in ${data.district} district and may be suitable for your farm conditions`,
      benefits: 'Crop diversification can reduce risk and improve soil health'
    });
  }
  
  if (data.nitrogen_level < 40) {
    recommendations.push({
      type: 'fertilizer_recommendation',
      fertilizer: 'Urea',
      quantity: `${Math.round((50 - data.nitrogen_level) * 2.2)} kg per hectare`,
      reason: 'Low nitrogen levels detected, additional nitrogen fertilizer recommended',
      application_time: 'Before sowing and at tillering stage'
    });
  }
  
  if (data.phosphorus_level < 25) {
    recommendations.push({
      type: 'fertilizer_recommendation',
      fertilizer: 'DAP (Diammonium Phosphate)',
      quantity: `${Math.round((30 - data.phosphorus_level) * 1.8)} kg per hectare`,
      reason: 'Phosphorus deficiency detected, DAP application recommended',
      application_time: 'At the time of sowing'
    });
  }
  
  if (data.potassium_level < 20) {
    recommendations.push({
      type: 'fertilizer_recommendation',
      fertilizer: 'Muriate of Potash',
      quantity: `${Math.round((25 - data.potassium_level) * 2.0)} kg per hectare`,
      reason: 'Low potassium levels, additional potash fertilizer needed',
      application_time: 'Before sowing'
    });
  }
  
  // pH adjustment recommendations
  if (data.ph_level < 6.0) {
    recommendations.push({
      type: 'soil_treatment',
      treatment: 'Lime Application',
      quantity: `${Math.round((6.5 - data.ph_level) * 500)} kg per hectare`,
      reason: 'Soil is acidic, lime application will help neutralize pH',
      timing: '2-3 weeks before sowing'
    });
  } else if (data.ph_level > 8.0) {
    recommendations.push({
      type: 'soil_treatment',
      treatment: 'Gypsum Application',
      quantity: `${Math.round((data.ph_level - 7.5) * 400)} kg per hectare`,
      reason: 'Soil is alkaline, gypsum will help reduce pH',
      timing: 'Before land preparation'
    });
  }
  
  // Irrigation recommendations
  if (data.irrigation_method === 'Flood Irrigation' && data.primary_crop_type !== 'Rice') {
    recommendations.push({
      type: 'irrigation_recommendation',
      method: 'Drip Irrigation',
      reason: 'Drip irrigation is more efficient for your crop type and soil conditions',
      water_saving: '30-50% reduction in water usage',
      benefits: ['Better nutrient uptake', 'Reduced water stress', 'Higher yield potential']
    });
  }
  
  // Weather-based recommendations
  if (data.temperature > 35) {
    recommendations.push({
      type: 'crop_management',
      practice: 'Shade Management',
      reason: 'High temperature stress detected',
      suggestions: [
        'Provide shade nets during peak summer',
        'Increase irrigation frequency',
        'Apply mulching to reduce soil temperature'
      ]
    });
  }
  
  if (data.humidity > 80) {
    recommendations.push({
      type: 'disease_prevention',
      concern: 'Fungal Disease Risk',
      reason: 'High humidity increases fungal disease susceptibility',
      preventive_measures: [
        'Ensure proper ventilation',
        'Apply preventive fungicide spray',
        'Avoid overhead irrigation',
        'Remove infected plant debris'
      ]
    });
  }
  
  // Overall farm management score
  const overallScore = (soilScore + climateScore) / 2;
  recommendations.push({
    type: 'farm_assessment',
    overall_score: Math.round(overallScore * 100) / 100,
    soil_health_score: Math.round(soilScore * 100) / 100,
    climate_suitability: Math.round(climateScore * 100) / 100,
    summary: `Your farm shows ${overallScore > 0.7 ? 'excellent' : overallScore > 0.5 ? 'good' : 'moderate'} potential for the selected crop.`,
    key_strengths: getKeyStrengths(data),
    areas_for_improvement: getAreasForImprovement(data)
  });
  
  return recommendations;
}

function calculateSoilScore(data: RecommendationRequest): number {
  let score = 0.5; // Base score
  
  // pH score
  if (data.ph_level >= 6.0 && data.ph_level <= 7.5) score += 0.2;
  else if (data.ph_level >= 5.5 && data.ph_level <= 8.0) score += 0.1;
  
  // Nutrient scores
  if (data.nitrogen_level >= 40) score += 0.1;
  if (data.phosphorus_level >= 25) score += 0.1;
  if (data.potassium_level >= 20) score += 0.1;
  
  return Math.min(score, 1.0);
}

function calculateClimateScore(data: RecommendationRequest): number {
  let score = 0.5; // Base score
  
  // Temperature score
  if (data.temperature >= 20 && data.temperature <= 30) score += 0.2;
  else if (data.temperature >= 15 && data.temperature <= 35) score += 0.1;
  
  // Humidity score
  if (data.humidity >= 50 && data.humidity <= 70) score += 0.2;
  else if (data.humidity >= 40 && data.humidity <= 80) score += 0.1;
  
  // Water content score
  if (data.water_content >= 30 && data.water_content <= 60) score += 0.1;
  
  return Math.min(score, 1.0);
}

function getKeyStrengths(data: RecommendationRequest): string[] {
  const strengths: string[] = [];
  
  if (data.ph_level >= 6.0 && data.ph_level <= 7.5) {
    strengths.push('Optimal soil pH for most crops');
  }
  
  if (data.nitrogen_level >= 40) {
    strengths.push('Good nitrogen availability');
  }
  
  if (data.irrigation_method === 'Drip Irrigation') {
    strengths.push('Efficient irrigation system in use');
  }
  
  if (data.temperature >= 20 && data.temperature <= 30) {
    strengths.push('Favorable temperature conditions');
  }
  
  if (strengths.length === 0) {
    strengths.push('Farm shows potential for improvement');
  }
  
  return strengths;
}

function getAreasForImprovement(data: RecommendationRequest): string[] {
  const improvements: string[] = [];
  
  if (data.ph_level < 6.0 || data.ph_level > 8.0) {
    improvements.push('Soil pH adjustment needed');
  }
  
  if (data.nitrogen_level < 40) {
    improvements.push('Nitrogen supplementation required');
  }
  
  if (data.phosphorus_level < 25) {
    improvements.push('Phosphorus levels should be increased');
  }
  
  if (data.potassium_level < 20) {
    improvements.push('Potassium enhancement needed');
  }
  
  if (data.irrigation_method === 'Flood Irrigation') {
    improvements.push('Consider upgrading to efficient irrigation methods');
  }
  
  if (improvements.length === 0) {
    improvements.push('Continue current best practices');
  }
  
  return improvements;
}

// Location-based crop recommendations
function getLocationBasedCrops(state: string, district: string): { primary: string[], secondary: string[] } {
  const locationCrops: Record<string, { primary: string[], secondary: string[] }> = {
    "Punjab": { 
      primary: ["Wheat", "Rice", "Maize"], 
      secondary: ["Cotton", "Sugarcane", "Pulses"] 
    },
    "Haryana": { 
      primary: ["Wheat", "Rice", "Bajra"], 
      secondary: ["Cotton", "Sugarcane", "Mustard"] 
    },
    "Uttar Pradesh": { 
      primary: ["Wheat", "Rice", "Sugarcane"], 
      secondary: ["Maize", "Pulses", "Potato"] 
    },
    "Maharashtra": { 
      primary: ["Cotton", "Sugarcane", "Rice"], 
      secondary: ["Wheat", "Soybean", "Maize"] 
    },
    "Karnataka": { 
      primary: ["Rice", "Maize", "Cotton"], 
      secondary: ["Sugarcane", "Pulses", "Oilseeds"] 
    },
    "Tamil Nadu": { 
      primary: ["Rice", "Sugarcane", "Cotton"], 
      secondary: ["Maize", "Pulses", "Groundnut"] 
    },
    "Gujarat": { 
      primary: ["Cotton", "Wheat", "Rice"], 
      secondary: ["Sugarcane", "Groundnut", "Pulses"] 
    },
    "Rajasthan": { 
      primary: ["Wheat", "Bajra", "Mustard"], 
      secondary: ["Cotton", "Maize", "Pulses"] 
    },
    "Madhya Pradesh": { 
      primary: ["Wheat", "Rice", "Soybean"], 
      secondary: ["Cotton", "Maize", "Pulses"] 
    },
    "West Bengal": { 
      primary: ["Rice", "Wheat", "Jute"], 
      secondary: ["Maize", "Pulses", "Potato"] 
    }
  };
  
  return locationCrops[state] || { primary: ["Rice", "Wheat"], secondary: ["Maize", "Pulses"] };
}

function getExpectedYield(crop: string, state: string): string {
  const yieldData: Record<string, Record<string, string>> = {
    "Rice": {
      "Punjab": "6-7 tons per hectare",
      "Haryana": "5-6 tons per hectare",
      "Uttar Pradesh": "4-5 tons per hectare",
      "default": "3-4 tons per hectare"
    },
    "Wheat": {
      "Punjab": "5-6 tons per hectare",
      "Haryana": "4-5 tons per hectare",
      "Uttar Pradesh": "3-4 tons per hectare",
      "default": "2-3 tons per hectare"
    },
    "Cotton": {
      "Gujarat": "600-700 kg per hectare",
      "Maharashtra": "500-600 kg per hectare",
      "Karnataka": "400-500 kg per hectare",
      "default": "300-400 kg per hectare"
    },
    "Sugarcane": {
      "Uttar Pradesh": "70-80 tons per hectare",
      "Maharashtra": "80-90 tons per hectare",
      "Karnataka": "100-120 tons per hectare",
      "default": "60-70 tons per hectare"
    }
  };
  
  return yieldData[crop]?.[state] || yieldData[crop]?.["default"] || "Yield data not available";
}

function getCropSeason(crop: string, state: string): string {
  const seasonData: Record<string, string> = {
    "Rice": "Kharif (June-November)",
    "Wheat": "Rabi (November-April)",
    "Cotton": "Kharif (April-December)",
    "Sugarcane": "Year-round (12-18 months cycle)",
    "Maize": "Kharif & Rabi",
    "Pulses": "Rabi (October-March)",
    "Bajra": "Kharif (June-September)",
    "Mustard": "Rabi (October-March)",
    "Soybean": "Kharif (June-October)",
    "Groundnut": "Kharif (June-October)"
  };
  
  return seasonData[crop] || "Season information not available";
}
