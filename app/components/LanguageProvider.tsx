"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from '../utils/translation';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, fallback?: string) => string;
  translateDynamic: (text: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: (lang: string) => {},
  t: (key: string, fallback?: string) => fallback || key,
  translateDynamic: async (text: string) => text,
});

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState("en");
  const { t, translateDynamic } = useTranslation(language);

  // Load saved language
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "en";
    setLanguageState(savedLanguage);
  }, []);

  const setLanguage = (newLanguage: string) => {
    setLanguageState(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t,
    translateDynamic,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
