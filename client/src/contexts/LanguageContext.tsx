import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "@/lib/translations";

type LanguageCode = "pt" | "en" | "es" | "fr" | "de";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("pt");

  useEffect(() => {
    // Recuperar idioma salvo do localStorage
    const savedLanguage = localStorage.getItem("selectedLanguage") as LanguageCode;
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    } else {
      // Detectar idioma do navegador
      const browserLang = navigator.language.split("-")[0] as LanguageCode;
      if (Object.keys(translations).includes(browserLang)) {
        setLanguageState(browserLang);
      }
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem("selectedLanguage", lang);
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k];
      } else {
        return key; // Retorna a chave se não encontrar a tradução
      }
    }

    return typeof value === "string" ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage deve ser usado dentro de LanguageProvider");
  }
  return context;
}
