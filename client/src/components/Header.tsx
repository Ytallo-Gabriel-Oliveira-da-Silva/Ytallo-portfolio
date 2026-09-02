import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Header() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const navItems = [
    { label: t("home"), id: "home", type: "section" },
    { label: t("skills"), id: "skills", type: "section" },
    { label: "Formação", id: "formation", type: "section" },
    { label: t("experience"), id: "experience", type: "section" },
    { label: t("projects"), id: "projects", type: "section" },
    { label: "Currículo", id: "curriculo", type: "route" },
    { label: t("contact"), id: "contact", type: "section" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-primary hover:border-secondary transition-colors duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary/50">
          <img
            src="/profile-logo.jpg"
            alt="Ytallo Gabriel"
            className="w-full h-full object-cover"
          />
        </div>

        <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() =>
                item.type === "section"
                  ? scrollToSection(item.id)
                  : setLocation("/curriculo")
              }
              className="text-foreground hover:text-primary transition-colors duration-300 relative group text-sm"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300" />
            </button>
          ))}
        </nav>

        <div className="hidden md:block flex-shrink-0">
          <LanguageSwitcher />
        </div>

        <div className="md:hidden flex items-center gap-2 flex-shrink-0">
          <LanguageSwitcher />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-primary p-1"
            title="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="md:hidden bg-card border-b border-border">
          <div className="container px-4 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.type === "section") {
                    scrollToSection(item.id);
                  } else {
                    setLocation("/curriculo");
                  }
                }}
                className="text-foreground hover:text-primary transition-colors duration-300 text-left text-sm"
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
