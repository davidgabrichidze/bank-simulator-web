import React, { createContext, useContext, useState, ReactNode } from 'react';
import { HelpBubble } from './help-bubble';
import { type AiContext } from '@/hooks/use-ai-assistant';

// Context for managing help context
interface HelpContextType {
  setContext: (context: AiContext) => void;
  context: AiContext;
  showHelpBubble: boolean;
  setShowHelpBubble: (show: boolean) => void;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export function useHelpContext() {
  const context = useContext(HelpContext);
  if (!context) {
    throw new Error('useHelpContext must be used within a HelpContextProvider');
  }
  return context;
}

interface HelpContextProviderProps {
  children: ReactNode;
  initialContext?: AiContext;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function HelpContextProvider({
  children,
  initialContext = {},
  position = 'bottom-right'
}: HelpContextProviderProps) {
  const [context, setContext] = useState<AiContext>(initialContext);
  const [showHelpBubble, setShowHelpBubble] = useState(true);

  return (
    <HelpContext.Provider value={{ context, setContext, showHelpBubble, setShowHelpBubble }}>
      {children}
      {showHelpBubble && <HelpBubble context={context} position={position} />}
    </HelpContext.Provider>
  );
}

// Helper component to set context for a specific section/page
interface WithHelpContextProps {
  children: ReactNode;
  context: AiContext;
}

export function WithHelpContext({ children, context }: WithHelpContextProps) {
  const helpContext = useHelpContext();
  
  React.useEffect(() => {
    const prevContext = helpContext.context;
    helpContext.setContext({ ...prevContext, ...context });
    
    return () => {
      // Reset to previous context when component unmounts
      helpContext.setContext(prevContext);
    };
  }, [context, helpContext]);
  
  return <>{children}</>;
}