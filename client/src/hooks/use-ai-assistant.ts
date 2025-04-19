import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Types for AI context and responses
export interface AiContext {
  page?: string;
  entity?: string;
  entityType?: string;
  action?: string;
  [key: string]: any;
}

export interface AiQueryResult {
  content: string;
  isLoading: boolean;
  error: string | null;
}

// Hook for interacting with AI assistant
export function useAiAssistant() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to query the AI assistant
  const queryAi = async (query: string, context: AiContext = {}): Promise<AiQueryResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiRequest<{ success: boolean; data: { content: string }; message?: string }>(
        '/api/ai/query',
        {
          method: 'POST',
          body: JSON.stringify({ query, context }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!result.success) {
        throw new Error(result.message || 'Failed to get AI response');
      }

      setResponse(result.data.content);
      return {
        content: result.data.content,
        isLoading: false,
        error: null
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast({
        title: 'Error querying AI assistant',
        description: errorMessage,
        variant: 'destructive',
      });
      return {
        content: '',
        isLoading: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    queryAi,
    response,
    isLoading,
    error,
  };
}