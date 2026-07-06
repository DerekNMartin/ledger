'use client';
import { useState, createContext, useContext } from 'react';

type PrivacyModeContextType = {
  /** When enabled, all private data is hidden from view. */
  privacyModeEnabled: boolean;
  togglePrivacyMode: () => void;
};

const PrivacyModeContext = createContext<PrivacyModeContextType | undefined>(undefined);

export function PrivacyModeProvider({ children }: { children: React.ReactNode }) {
  const [privacyModeEnabled, setPrivacyModeEnabled] = useState(false);

  function togglePrivacyMode() {
    setPrivacyModeEnabled((isEnabled) => !isEnabled);
  }

  return (
    <PrivacyModeContext.Provider value={{ privacyModeEnabled, togglePrivacyMode }}>
      {children}
    </PrivacyModeContext.Provider>
  );
}

export function usePrivacyMode() {
  const context = useContext(PrivacyModeContext);
  if (!context) {
    throw new Error('usePrivacyMode must be used within a PrivacyModeProvider');
  }
  return context;
}
