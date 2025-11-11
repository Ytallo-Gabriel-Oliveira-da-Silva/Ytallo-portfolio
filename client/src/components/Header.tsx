import { Menu, X } from "lucide-react";
import { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
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
        <div className="text-2xl font-bold animate-glow flex-shrink-0">
          <span className="text-primary">YT</span>
          <span className="text-accent">.</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
          {[
            { label: "Início", id: "home" },
            { label: "Habilidades", id: "skills" },
            { label: "Experiência", id: "experience" },
            { label: "Projetos", id: "projects" },
            { label: "Contato", id: "contact" },
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
              { label: "Início", id: "home" },
              { label: "Habilidades", id: "skills" },
              { label: "Experiência", id: "experience" },
              { label: "Projetos", id: "projects" },
              { label: "Contato", id: "contact" },
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
