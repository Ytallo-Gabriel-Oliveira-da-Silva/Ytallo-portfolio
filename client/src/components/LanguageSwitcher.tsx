import { useState, useEffect } from "react";
import { Check } from "lucide-react";

interface Language {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

const languages: Language[] = [
  { code: "pt", name: "Português", flag: "🇧🇷", nativeName: "Português" },
  { code: "en", name: "English", flag: "🇺🇸", nativeName: "English" },
  { code: "es", name: "Español", flag: "🇪🇸", nativeName: "Español" },
  { code: "fr", name: "Français", flag: "🇫🇷", nativeName: "Français" },
  { code: "de", name: "Deutsch", flag: "🇩🇪", nativeName: "Deutsch" },
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage");
    if (savedLanguage) {
      const lang = languages.find((l) => l.code === savedLanguage);
      if (lang) setCurrentLanguage(lang);
    }

    const browserLang = navigator.language.split("-")[0];
    const detectedLang = languages.find((l) => l.code === browserLang);
    if (detectedLang && !savedLanguage) {
      setCurrentLanguage(detectedLang);
    }
  }, []);

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem("selectedLanguage", language.code);
    setIsOpen(false);
    console.log(`Idioma alterado para: ${language.name}`);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 px-2 py-1 md:px-4 md:py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 whitespace-nowrap text-xs md:text-sm"
        title="Selecionar idioma"
      >
        <span className="text-base md:text-lg">{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.name}</span>
      </button>

      {isOpen && (
        <>
          <div className="absolute top-full right-0 mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 w-48 md:w-56">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language)}
                className="w-full px-4 py-3 text-left hover:bg-slate-800 transition-colors duration-200 flex items-center justify-between border-b border-slate-700 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{language.flag}</span>
                  <div>
                    <p className="font-semibold text-white text-sm">{language.name}</p>
                    <p className="text-xs text-slate-400">{language.nativeName}</p>
                  </div>
                </div>
                {currentLanguage.code === language.code && (
                  <Check size={16} className="text-cyan-400 animate-pulse" />
                )}
              </button>
            ))}
          </div>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  );
}
