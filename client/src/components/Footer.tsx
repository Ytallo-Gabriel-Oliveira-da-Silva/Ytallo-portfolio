import {
  Github,
  Linkedin,
  Instagram,
  Mail,
  ExternalLink,
} from "lucide-react";

export default function Footer() {
  const socialLinks = [
    {
      icon: Github,
      href: "https://github.com/Ytallo-Gabriel-Oliveira-da-Silva",
      label: "GitHub",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/ytallo-gabriel-863899279",
      label: "LinkedIn",
    },
    {
      icon: Instagram,
      href: "https://instagram.com/ytallo_gabriel.dev",
      label: "Instagram",
    },
    {
      icon: Mail,
      href: "mailto:ytallok644549@gmail.com",
      label: "Email",
    },
  ];

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Ytallo Gabriel
            </h3>
            <p className="text-muted-foreground text-sm">
              Desenvolvedor Full-Stack & Empreendedor apaixonado por criar
              soluções inovadoras com tecnologia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Links Rápidos
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Portfólio de Certificados", href: "http://bit.ly/3SDNw1G" },
                { label: "Garra Inc. Technology", href: "https://instagram.com/garra_inc_technology" },
                { label: "Garra Studios", href: "https://instagram.com/garrastudios" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2 text-sm"
                  >
                    {link.label}
                    <ExternalLink size={14} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Contato
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>📍 Paulista - Pernambuco, Brasil</p>
              <p>📱 (81) 99432-3471</p>
              <p>✉️ ytallok644549@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-border pt-8">
          <div className="flex justify-center gap-6 mb-8">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-background hover:scale-110 transition-all duration-300 hover-glow"
                  title={social.label}
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              © 2025 Ytallo Gabriel. Desenvolvido com{" "}
              <span className="text-primary">❤️</span> e muita{" "}
              <span className="text-accent">criatividade</span>.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
