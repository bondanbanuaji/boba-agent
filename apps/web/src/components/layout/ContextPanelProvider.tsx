'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface ContextPanelContextType {
  content: ReactNode | null;
  isOpen: boolean;
  setContent: (content: ReactNode | null) => void;
  setIsOpen: (isOpen: boolean) => void;
}

const ContextPanelContext = createContext<ContextPanelContextType | undefined>(undefined);

export function ContextPanelProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ReactNode | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ContextPanelContext.Provider value={{ content, isOpen, setContent, setIsOpen }}>
      {children}
    </ContextPanelContext.Provider>
  );
}

export function useContextPanel() {
  const context = useContext(ContextPanelContext);
  if (!context) {
    throw new Error('useContextPanel must be used within a ContextPanelProvider');
  }
  return context;
}
