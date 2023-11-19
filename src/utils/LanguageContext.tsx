"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type LanguageContextType = {
  locale: string;
  setLocale: (locale: string) => void;
};

const defaultLanguageContext: LanguageContextType = {
  locale: "en",
  setLocale: () => {},
};

export const LanguageContext = createContext<LanguageContextType>(
  defaultLanguageContext
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  return context;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [locale, setLocale] = useState("en");

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};
