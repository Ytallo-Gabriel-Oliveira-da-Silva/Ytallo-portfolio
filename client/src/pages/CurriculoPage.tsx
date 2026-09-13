import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Download, FileText, Globe, Languages } from "lucide-react";

const CURRICULO_ASSETS = {
  pt: {
    image: "/curriculos/imgs/curriculo-PTBR-img.jpg",
    pdf: "/curriculos/pdfs/Curr%C3%ADculo-pt-Br.PDF",
    fileName: "curriculo-pt-br.pdf",
  },
  en: {
    image: "/curriculos/imgs/curriculo-ingles-img.jpg",
    pdf: "/curriculos/pdfs/curriculum-ytallo-EN.PDF",
    fileName: "curriculum-ytallo-en.pdf",
  },
} as const;

const curriculoData = {
  pt: {
    title: "Currículo",
    headline: "Ytallo Gabriel Oliveira da Silva",
    summary:
      "Desenvolvedor Full Stack com foco em aplicações web, automações, interfaces modernas e soluções digitais escaláveis.",
    sections: {
      contato: "Contato",
      formacao: "Formação Acadêmica",
      habilidades: "Habilidades",
      experiencia: "Experiência",
      projetos: "Projetos",
    },
    contact: [
      "E-mail: ytallok644549@gmail.com",
      "Localização: Paulista - PE, Brasil",
      "GitHub: github.com/Ytallo-Gabriel-Oliveira-da-Silva",
    ],
    formation: [
      "Tecnólogo em Análise e Desenvolvimento de Sistemas - UNIGRANDE - em andamento",
      "Escola Técnica Estadual Ginásio Pernambucano - Técnico em Análise e Desenvolvimento de Sistemas - concluído em 2025",
      "Escola Técnica Estadual Ginásio Pernambucano - Ensino Médio - concluído em 2025",
    ],
    skills: [
      "React",
      "TypeScript",
      "Node.js",
      "Python",
      "Java",
      "HTML/CSS",
      "API REST",
      "SQL",
      "Git",
      "Automação",
      "IA",
      "Cybersegurança",
    ],
    experience: [
      "Desenvolvimento de interfaces e aplicações web com foco em funcionalidade, performance e UX.",
      "Criação de sistemas, automações e integrações para melhorar processos digitais.",
      "Atuação com tecnologias modernas como React, Node.js, Python, bancos de dados e APIs.",
    ],
    projects: [
      "Hydra AI API - API de integrações e automações com inteligência artificial.",
      "Projetos de automação e soluções web para produtividade e otimização de processos.",
      "Aplicações com foco em interface moderna, arquitetura limpa e usabilidade.",
    ],
    footer: "Perfil profissional atualizado e em constante evolução.",
  },
  en: {
    title: "Curriculum Vitae",
    headline: "Ytallo Gabriel Oliveira da Silva",
    summary:
      "Full Stack Developer focused on web applications, automations, modern interfaces and scalable digital solutions.",
    sections: {
      contato: "Contact",
      formacao: "Education",
      habilidades: "Skills",
      experiencia: "Experience",
      projetos: "Projects",
    },
    contact: [
      "Email: ytallok644549@gmail.com",
      "Location: Paulista - PE, Brazil",
      "GitHub: github.com/Ytallo-Gabriel-Oliveira-da-Silva",
    ],
    formation: [
      "Technologist in Systems Analysis and Development - UNIGRANDE - in progress",
      "State Technical School Ginásio Pernambucano - Technical in Systems Analysis and Development - completed in 2025",
      "State Technical School Ginásio Pernambucano - High School - completed in 2025",
    ],
    skills: [
      "React",
      "TypeScript",
      "Node.js",
      "Python",
      "Java",
      "HTML/CSS",
      "REST API",
      "SQL",
      "Git",
      "Automation",
      "AI",
      "Cybersecurity",
    ],
    experience: [
      "Development of web interfaces and applications focused on functionality, performance and UX.",
      "Creation of systems, automations and integrations to improve digital processes.",
      "Work with modern technologies such as React, Node.js, Python, databases and APIs.",
    ],
    projects: [
      "Hydra AI API - API for integrations and automations with artificial intelligence.",
      "Automation projects and web solutions for productivity and process optimization.",
      "Applications focused on modern interface, clean architecture and usability.",
    ],
    footer: "Professional profile constantly evolving.",
  },
};

export default function CurriculoPage() {
  const [, setLocation] = useLocation();
  const [language, setLanguage] = useState<"pt" | "en">("pt");

  const curriculo = curriculoData[language];
  const assets = CURRICULO_ASSETS[language];

  const downloadPdf = async () => {
    const response = await fetch(assets.pdf, { cache: "no-store" });
    if (!response.ok) return;

    const fileUrl = URL.createObjectURL(await response.blob());
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = assets.fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(fileUrl);
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-8 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-3">
          <button
            onClick={() => setLocation("/")}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground hover:border-primary hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>

          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <FileText size={14} />
            {curriculo.title}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-[0_0_30px_rgba(0,217,255,0.08)] md:p-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-primary">Ytallo Gabriel</p>
              <h1 className="mt-2 text-3xl font-black md:text-5xl">{curriculo.title}</h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setLanguage("pt")}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors ${
                  language === "pt"
                    ? "border-primary bg-primary text-background"
                    : "border-border bg-background text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                <Languages size={16} />
                Português
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors ${
                  language === "en"
                    ? "border-primary bg-primary text-background"
                    : "border-border bg-background text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                <Globe size={16} />
                English
              </button>
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button
              onClick={downloadPdf}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-semibold text-background hover:shadow-lg hover:shadow-primary/40 transition-all"
            >
              <Download size={16} />
              Baixar PDF
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-[#0f172a] to-[#0b1220] p-3 shadow-[0_0_30px_rgba(0,217,255,0.08)]">
            <img
              src={assets.image}
              alt={`Currículo ${language === "pt" ? "em português" : "em inglês"}`}
              className="h-auto w-full rounded-xl border border-white/10 bg-background object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
