import { Menu, X } from "lucide-react";
import { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Header() {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-primary hover:border-secondary transition-colors duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary/50">
          <img
            src="/profile-logo.jpg"
            alt="Ytallo Gabriel"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
          {[
            { label: t("home"), id: "home" },
            { label: t("skills"), id: "skills" },
            { label: t("experience"), id: "experience" },
            { label: t("projects"), id: "projects" },
            { label: t("contact"), id: "contact" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-foreground hover:text-primary transition-colors duration-300 relative group text-sm"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300" />
            </button>
          ))}
        </nav>

        {/* Desktop Language Switcher */}
        <div className="hidden md:block flex-shrink-0">
          <LanguageSwitcher />
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-2 flex-shrink-0">
          {/* Mobile Language Switcher */}
          <LanguageSwitcher />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-primary p-1"
            title="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-card border-b border-border">
          <div className="container px-4 py-4 flex flex-col gap-4">
            {[
              { label: t("home"), id: "home" },
              { label: t("skills"), id: "skills" },
              { label: t("experience"), id: "experience" },
              { label: t("projects"), id: "projects" },
              { label: t("contact"), id: "contact" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
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
