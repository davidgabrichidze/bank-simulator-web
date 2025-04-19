import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X, SendHorizontal, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAiAssistant, type AiContext } from '@/hooks/use-ai-assistant';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';

interface HelpBubbleProps {
  context?: AiContext;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

const PREDEFINED_QUESTIONS = [
  "How do I create a new account?",
  "What's the difference between account types?",
  "How do loan applications work?",
  "Where can I find transaction history?"
];

export function HelpBubble({
  context = {},
  position = 'bottom-right',
  className
}: HelpBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<Array<{ question: string; answer: string }>>([]);
  const [suggestion, setSuggestion] = useState('');
  const { queryAi, isLoading } = useAiAssistant();
  const [location] = useLocation();
  
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Derive page context from the current location
  useEffect(() => {
    const pageName = location.split('/')[1] || 'dashboard';
    const enhancedContext = {
      ...context,
      page: pageName,
    };
    context = enhancedContext;
  }, [location, context]);

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input when bubble opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!query.trim() || isLoading) return;
    
    const userQuery = query;
    setQuery('');
    
    try {
      const result = await queryAi(userQuery, context);
      
      if (result.content) {
        setHistory(prev => [...prev, { 
          question: userQuery, 
          answer: result.content 
        }]);
      }
    } catch (error) {
      console.error('Error querying AI assistant:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handlePredefinedQuestion = (question: string) => {
    setQuery(question);
    setSuggestion('');
  };

  const resetChat = () => {
    setHistory([]);
    setQuery('');
    setSuggestion('');
  };

  // Determine position classes
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  }[position];

  return (
    <div className={cn("fixed z-50", positionClasses, className)}>
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="rounded-full h-12 w-12 shadow-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-80 md:w-96 shadow-lg flex flex-col">
          <div className="p-3 bg-primary text-primary-foreground flex items-center justify-between rounded-t-lg">
            <div className="font-semibold">Banking Assistant</div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full hover:bg-primary/20"
                onClick={resetChat}
                disabled={history.length === 0}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full hover:bg-primary/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div 
            className="flex-1 overflow-auto p-4 max-h-80 space-y-4"
            ref={contentRef}
          >
            {history.length === 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-center text-muted-foreground">
                  Hello! I'm your banking assistant. How can I help you today?
                </p>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Suggested questions:
                  </p>
                  {PREDEFINED_QUESTIONS.map((question) => (
                    <Button
                      key={question}
                      variant="outline"
                      size="sm"
                      className="text-xs w-full text-left justify-start h-auto py-2 font-normal"
                      onClick={() => handlePredefinedQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex gap-2 items-start">
                      <div className="bg-muted p-2 rounded-full h-8 w-8 flex items-center justify-center text-xs font-medium">
                        You
                      </div>
                      <div className="bg-muted p-3 rounded-lg text-sm flex-1">
                        {item.question}
                      </div>
                    </div>
                    <div className="flex gap-2 items-start">
                      <div className="bg-primary/10 text-primary p-2 rounded-full h-8 w-8 flex items-center justify-center text-xs font-medium">
                        AI
                      </div>
                      <div className="bg-primary/10 p-3 rounded-lg text-sm flex-1">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {isLoading && (
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
          </div>
          
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Textarea
                ref={inputRef}
                placeholder="Ask a question..."
                className="resize-none min-h-[44px] max-h-32"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button 
                size="icon" 
                disabled={!query.trim() || isLoading}
                onClick={handleSubmit}
                className="shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <SendHorizontal className="h-4 w-4" />
                )}
              </Button>
            </div>
            {suggestion && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs mt-2 text-muted-foreground"
                onClick={() => handlePredefinedQuestion(suggestion)}
              >
                {suggestion}
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}