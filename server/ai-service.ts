import { Request, Response } from 'express';

// Response type for Perplexity API
interface PerplexityResponse {
  id: string;
  model: string;
  object: string;
  created: number;
  citations: string[];
  choices: {
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
    delta: {
      role: string;
      content: string;
    };
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Basic cache to prevent repeated identical questions
const responseCache = new Map<string, { response: string, timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

export async function handleAiQuery(req: Request, res: Response) {
  try {
    const { context, query } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Query is required and must be a string',
      });
    }

    // Create a cache key based on context and query
    const cacheKey = `${JSON.stringify(context)}_${query}`;
    const cachedResponse = responseCache.get(cacheKey);
    
    // Return cached response if available and not expired
    if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_TTL) {
      return res.json({
        success: true,
        data: { content: cachedResponse.response },
      });
    }

    // Construct the system message based on the context
    let systemMessage = "You are a helpful financial assistant in a banking application. ";
    
    // Add more specific context if available
    if (context) {
      if (context.page) {
        systemMessage += `The user is currently on the ${context.page} page. `;
      }
      
      if (context.entity && context.entityType) {
        systemMessage += `They are working with a ${context.entityType} named '${context.entity}'. `;
      }
      
      if (context.action) {
        systemMessage += `They are currently trying to ${context.action}. `;
      }
    }
    
    systemMessage += "Provide concise, helpful responses that address the user's question about banking, finance, or how to use the application. Keep responses under 150 words, be professional but friendly.";

    // Prepare the API request
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: systemMessage
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.2,
        max_tokens: 300,
        top_p: 0.9,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', errorText);
      
      return res.status(response.status).json({
        success: false,
        message: `AI service error: ${response.statusText}`,
      });
    }

    const data: PerplexityResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'No response generated from AI service',
      });
    }

    const aiResponse = data.choices[0].message.content;
    
    // Cache the response
    responseCache.set(cacheKey, { 
      response: aiResponse, 
      timestamp: Date.now() 
    });

    return res.json({
      success: true,
      data: { content: aiResponse },
    });
  } catch (error) {
    console.error('AI service error:', error);
    
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error in AI service',
    });
  }
}