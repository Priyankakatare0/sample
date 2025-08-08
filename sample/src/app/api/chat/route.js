import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to get available model with retries
async function getWorkingModel() {
  const modelsToTry = [
    "gemini-1.5-flash",
    "gemini-1.5-pro", 
    "gemini-pro",
    "gemini-1.0-pro"
  ];

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      // Test the model with a simple prompt
      await model.generateContent("Hello");
      return { model, name: modelName };
    } catch (error) {
      console.log(`Model ${modelName} not available:`, error.message);
      continue;
    }
  }
  
  throw new Error('No working Gemini models found');
}

export async function POST(request) {
  try {
    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'API configuration error' }, 
        { status: 500 }
      );
    }

    const body = await request.json();
    const { message } = body;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Valid message is required' }, 
        { status: 400 }
      );
    }

    // Get a working model
    let modelInfo;
    try {
      modelInfo = await getWorkingModel();
    } catch (error) {
      return NextResponse.json(
        { error: 'AI service temporarily unavailable. Please try again later.' }, 
        { status: 503 }
      );
    }

    // Check for image generation command
    if (message.startsWith('/image ')) {
      const prompt = message.replace('/image ', '');
      try {
        // Gemini image generation (base64 image handling)
        const imageResult = await modelInfo.model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { type: 'image' }
        });
        // Try to extract base64 image from the response
        const images = imageResult.response?.candidates?.[0]?.content?.parts?.filter(p => p.inlineData)?.map(p => p.inlineData.data) || [];
        if (!images.length) {
          throw new Error('No image generated');
        }
        // Use the first image and create a data URI
        const imageDataUri = `data:image/png;base64,${images[0]}`;
        return NextResponse.json({ reply: '', image: imageDataUri, model: modelInfo.name });
      } catch (error) {
        return NextResponse.json({ error: 'Image generation failed.' }, { status: 500 });
      }
    }

    // Generate content with retry logic (text)
    let result;
    let attempts = 0;
    const maxAttempts = 3;
    while (attempts < maxAttempts) {
      try {
        result = await modelInfo.model.generateContent(message);
        break; // Success, exit retry loop
      } catch (error) {
        attempts++;
        if (error.message?.includes('overloaded') || error.message?.includes('503')) {
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
            continue;
          } else {
            return NextResponse.json(
              { error: 'AI service is currently overloaded. Please try again in a few moments.' }, 
              { status: 503 }
            );
          }
        } else {
          throw error;
        }
      }
    }

    const response = await result.response;
    const text = response.text();

    if (!text || text.trim().length === 0) {
      throw new Error('Empty response from AI');
    }

    return NextResponse.json({ 
      reply: text,
      model: modelInfo.name
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Handle specific error types
    if (error.message?.includes('API_KEY') || error.message?.includes('401')) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your configuration.' }, 
        { status: 401 }
      );
    }
    
    if (error.message?.includes('QUOTA_EXCEEDED') || error.message?.includes('429')) {
      return NextResponse.json(
        { error: 'API quota exceeded. Please try again later.' }, 
        { status: 429 }
      );
    }
    
    if (error.message?.includes('overloaded') || error.message?.includes('503')) {
      return NextResponse.json(
        { error: 'AI service is currently busy. Please try again in a moment.' }, 
        { status: 503 }
      );
    }
    
    if (error.message?.includes('SAFETY')) {
      return NextResponse.json(
        { error: 'Content was blocked for safety reasons.' }, 
        { status: 400 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { error: 'AI service encountered an error. Please try again.' }, 
      { status: 500 }
    );
  }
}
