import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { ArrowLeft, ArrowRight, Award, BookOpen, ExternalLink, Home } from "lucide-react";

export type Certificate = {
  slug: string;
  title: string;
  institution: string;
  status: string;
  year: string;
  category: string;
  description: string;
  highlight: string;
  image: string;
  syllabus: string[];
  badge: string;
};

const certificates: Certificate[] = [
  {
    slug: "imersao-front-end-alura",
    title: "Imersão Front-End",
    institution: "ALURA",
    status: "Concluído",
    year: "2023",
    category: "Frontend",
    description: "Curso voltado para a criação de interfaces modernas com foco em HTML, CSS e fundamentos de desenvolvimento web.",
    highlight: "Base sólida em front-end e UX.",
    image: "/profile-logo.jpg",
    syllabus: ["HTML", "CSS", "Design responsivo", "Arquitetura de interfaces"],
    badge: "Front-End",
  },
  {
    slug: "imersao-front-end-2-edicao-alura",
    title: "Imersão Front-End 2ª Edição",
    institution: "ALURA",
    status: "Concluído",
    year: "2024",
    category: "Frontend",
    description: "Continuação da formação em front-end, com aprofundamento em técnicas, produção visual e organização de projetos.",
    highlight: "Aprofundamento em desenvolvimento de interfaces.",
    image: "/profile-logo.jpg",
    syllabus: ["Componentização", "Acessibilidade", "Projetos práticos", "UI/UX"],
    badge: "Front-End",
  },
  {
    slug: "react-dev-alura",
    title: "React DEV",
    institution: "ALURA",
    status: "Concluído",
    year: "2024",
    category: "Frontend",
    description: "Curso focado em React, componentes, estado, rotas e desenvolvimento de aplicações web modernas.",
    highlight: "Experiência prática com React.",
    image: "/profile-logo.jpg",
    syllabus: ["React", "Hooks", "Estado", "Roteamento"],
    badge: "React",
  },
  {
    slug: "imersao-dev-google-gemini",
    title: "Imersão DEV com Google Gemini",
    institution: "ALURA + GOOGLE",
    status: "Concluído",
    year: "2024",
    category: "Inteligência Artificial",
    description: "Experiência com desenvolvimento e integração de IA conversacional em fluxos de aplicação real.",
    highlight: "Exploração de IA aplicada em projetos digitais.",
    image: "/profile-logo.jpg",
    syllabus: ["Google Gemini", "IA aplicada", "Prototipação", "Integração"] ,
    badge: "IA",
  },
  {
    slug: "html-css-ambientes-desenvolvimento",
    title: "HTML e CSS: Ambientes de Desenvolvimento",
    institution: "ALURA",
    status: "Concluído",
    year: "2025",
    category: "Frontend",
    description: "Curso de ambientes de desenvolvimento web, com foco em organização, práticas e produtividade no fluxo de trabalho.",
    highlight: "Melhorando qualidade e eficiência no desenvolvimento.",
    image: "/profile-logo.jpg",
    syllabus: ["Configuração de ambiente", "Boas práticas", "Fluxo de trabalho", "Produtividade"],
    badge: "HTML/CSS",
  },
  {
    slug: "dados-com-python",
    title: "Dados com Python",
    institution: "ALURA",
    status: "Concluído",
    year: "2025",
    category: "Python",
    description: "Formação em manipulação de dados com Python, incluindo análise e organização de informações.",
    highlight: "Aprendizado focado em dados e automações.",
    image: "/profile-logo.jpg",
    syllabus: ["Python", "Análise de dados", "Estruturas", "Automação"],
    badge: "Python",
  },
  {
    slug: "solve-for-tomorrow",
    title: "Solve for Tomorrow",
    institution: "Samsung",
    status: "Concluído",
    year: "2024",
    category: "Tecnologia e Inovação",
    description: "Participação em projeto voltado a tecnologia, inovação e desenvolvimento de soluções com impacto real.",
    highlight: "Experiência em inovação tecnológica.",
    image: "/profile-logo.jpg",
    syllabus: ["Inovação", "Tecnologia", "Soluções reais", "Projeto social"],
    badge: "Inovação",
  },
  {
    slug: "empreendedorismo-ja-pernambuco",
    title: "Empreendedorismo",
    institution: "JA Pernambuco Mini Empresa",
    status: "Concluído",
    year: "2024",
    category: "Empreendedorismo",
    description: "Curso e vivência em empreendedorismo, gestão e desenvolvimento de ideias com pensamento de negócio.",
    highlight: "Fortalecimento em gestão e visão de negócio.",
    image: "/profile-logo.jpg",
    syllabus: ["Empreendedorismo", "Gestão", "Ideação", "Negócios"],
    badge: "Negócios",
  },
  {
    slug: "cyber-seguranca-dio-riachuelo",
    title: "Cyber Segurança",
    institution: "DIO + Riachuelo",
    status: "Em andamento",
    year: "2026",
    category: "Segurança",
    description: "Formação em cyber segurança com foco em fundamentos, proteção digital e práticas de segurança.",
    highlight: "Crescimento em segurança digital e proteção de sistemas.",
    image: "/profile-logo.jpg",
    syllabus: ["Cybersegurança", "Fundamentos", "Proteção digital", "Segurança da informação"],
    badge: "Segurança",
  },
  {
    slug: "letramento-digital-senai",
    title: "Letramento Digital",
    institution: "SENAI",
    status: "Concluído",
    year: "2026",
    category: "Digital",
    description: "Curso voltado ao desenvolvimento de habilidades digitais essenciais para o mundo contemporâneo.",
    highlight: "Ampliação de competências digitais.",
    image: "/profile-logo.jpg",
    syllabus: ["Digital", "Ferramentas", "Produtividade", "Tecnologia"],
    badge: "Digital",
  },
  {
    slug: "onda-8",
    title: "8ª ONDA",
    institution: "ONDA",
    status: "Concluído",
    year: "2024",
    category: "Inovação",
    description: "Participação na Olimpíada Nacional de Aplicativos, com desenvolvimento e solução para desafios de tecnologia.",
    highlight: "Desenvolvimento de soluções aplicadas.",
    image: "/profile-logo.jpg",
    syllabus: ["Aplicativos", "Ideação", "Prototipação", "Tecnologia"],
    badge: "Aplicativos",
  },
  {
    slug: "mostra-brasileira-foguetes",
    title: "18ª Mostra Brasileira de Foguetes",
    institution: "MOBFOG + OBA",
    status: "Concluído",
    year: "2024",
    category: "Ciência e Tecnologia",
    description: "Participação em evento técnico-científico com foco em foguetes, inovação e tecnologia aplicada.",
    highlight: "Integração entre ciência, tecnologia e criação.",
    image: "/profile-logo.jpg",
    syllabus: ["Foguetes", "Tecnologia", "Ciência aplicada", "Inovação"],
    badge: "Foguetes",
  },
  {
    slug: "olimpiada-astronomia-astronautica",
    title: "Olimpíada Brasileira de Astronomia e Astronáutica",
    institution: "S.A.B + OBA",
    status: "Concluído",
    year: "2024",
    category: "Ciência",
    description: "Participação em olimpíada nacional com foco em astronomia, astronautica e aplicação científica.",
    highlight: "Reconhecimento em ciência e tecnologia.",
    image: "/profile-logo.jpg",
    syllabus: ["Astronomia", "Astronáutica", "Ciência", "Pesquisa"],
    badge: "Ciência",
  },
  {
    slug: "monitoria-robotica-fisica",
    title: "Monitoria Voluntária Bolsista - Robótica e Física",
    institution: "ETE Ginásio Pernambucano",
    status: "Concluído",
    year: "2023, 2024 e 2025",
    category: "Ensino e Mentoria",
    description: "Experiência em monitoria e apoio acadêmico em robótica e física, com atuação em três anos consecutivos.",
    highlight: "Atuação em mentoria e apoio ao ensino técnico.",
    image: "/profile-logo.jpg",
    syllabus: ["Robótica", "Física", "Mentoria", "Ensino"],
    badge: "Mentoria",
  },
  {
    slug: "web3-week-6-edicao",
    title: "WEB3 Week 6ª Edição",
    institution: "Luiz Tools",
    status: "Concluído",
    year: "2025",
    category: "Web3",
    description: "Evento e formação em temas de web3, inovação digital e novas tecnologias emergentes.",
    highlight: "Aprofundamento em tendências digitais e web3.",
    image: "/profile-logo.jpg",
    syllabus: ["Web3", "Blockchain", "Inovação", "Tecnologia emergente"],
    badge: "Web3",
  },
];

function CertificatesPage() {
  const [, setLocation] = useLocation();
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ slug: string; name: string; url: string }>>([]);

  useEffect(() => {
    fetch("/api/public/manifest")
      .then((response) => (response.ok ? response.json() : null))
      .then((manifest) => {
        const items = manifest?.certificados ? Object.entries(manifest.certificados) : [];
        setUploadedFiles(
          items.map(([slug, value]: [string, any]) => ({
            slug,
            name: value?.name || slug,
            url: value?.url || "#",
          }))
        );
      })
      .catch(() => setUploadedFiles([]));
  }, []);

  const allCertificates = useMemo(() => {
    const dynamic = uploadedFiles.map((file) => ({
      slug: file.slug,
      title: file.name.replace(/\.[^/.]+$/, ""),
      institution: "Arquivo enviado via painel admin",
      status: "Disponível",
      year: "Atualizado",
      category: "PDF",
      description: "Arquivo carregado diretamente na central de gestão do site.",
      highlight: "Arquivo atualizado no painel administrativo.",
      image: "/profile-logo.jpg",
      syllabus: ["PDF", "Atualização administrada", "Disponível no site"],
      badge: "PDF",
    }));

    return [...dynamic, ...certificates];
  }, [uploadedFiles]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-6xl py-10 md:py-16">
        <div className="mb-8 flex items-center justify-between gap-4">
          <button
            onClick={() => setLocation("/")}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground hover:border-primary hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar para a página principal
          </button>

          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-primary">
            <Award size={14} />
            Certificados
          </div>
        </div>

        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black md:text-5xl">Certificados e Conquistas</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
            Lista completa dos meus cursos, formações, participações e experiências relevantes.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {allCertificates.map((certificate) => (
            <button
              key={certificate.slug}
              onClick={() => setLocation(`/certificado/${certificate.slug}`)}
              className="group rounded-2xl border border-border bg-card p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(0,217,255,0.12)]"
            >
              <div className="mb-4 overflow-hidden rounded-xl border border-border bg-background/50 p-3">
                <div className="flex h-28 items-center justify-center rounded-lg bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15 text-center">
                  <div className="text-center">
                    <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <BookOpen size={18} />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {certificate.badge}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                  {certificate.status}
                </span>
                <span className="text-xs text-muted-foreground">{certificate.year}</span>
              </div>

              <h2 className="text-xl font-bold text-foreground">{certificate.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{certificate.institution}</p>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.18em] text-primary">Ver detalhes</span>
                <ArrowRight size={16} className="text-primary transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CertificateDetailPage() {
  const [match, params] = useRoute("/certificado/:slug");
  const [, setLocation] = useLocation();

  const certificate = certificates.find((item) => item.slug === params?.slug) ?? certificates[0];

  if (!match || !certificate) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center text-foreground">
        <div className="max-w-md rounded-2xl border border-border bg-card p-8">
          <h1 className="text-2xl font-bold">Certificado não encontrado</h1>
          <p className="mt-3 text-muted-foreground">Essa página não existe ou foi removida.</p>
          <button
            onClick={() => setLocation("/")}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-background"
          >
            <Home size={16} />
            Voltar para o início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-5xl py-10 md:py-16">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => setLocation("/certificados")}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground hover:border-primary hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar para a lista
          </button>

          <button
            onClick={() => setLocation("/")}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground hover:border-primary hover:text-primary transition-colors"
          >
            <Home size={16} />
            Página principal
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[0_0_30px_rgba(0,217,255,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_1.4fr]">
            <div className="border-b border-border bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-6 lg:border-b-0 lg:border-r">
              <div className="flex h-full min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-primary/30 bg-background/40 p-6 text-center">
                <div>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Award size={28} />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Mockup do certificado</p>
                  <p className="mt-3 text-sm text-muted-foreground">Área reservada para imagem do documento</p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                  {certificate.badge}
                </span>
                <span className="rounded-full border border-border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {certificate.status}
                </span>
              </div>

              <h1 className="text-3xl font-black md:text-4xl">{certificate.title}</h1>

              <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                <p><span className="font-semibold text-foreground">Instituição:</span> {certificate.institution}</p>
                <p><span className="font-semibold text-foreground">Ano:</span> {certificate.year}</p>
                <p><span className="font-semibold text-foreground">Categoria:</span> {certificate.category}</p>
              </div>

              <div className="mt-8 rounded-2xl border border-border bg-background/50 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Descrição</p>
                <p className="mt-3 text-base leading-7 text-foreground">{certificate.description}</p>
              </div>

              <div className="mt-8">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Destaque</p>
                <p className="mt-3 text-lg font-medium text-foreground">{certificate.highlight}</p>
              </div>

              <div className="mt-8">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Conteúdo principal</p>
                <ul className="mt-4 space-y-3">
                  {certificate.syllabus.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-foreground">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => setLocation("/certificados")}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-background transition-opacity hover:opacity-90"
                >
                  <ArrowLeft size={16} />
                  Voltar para a lista
                </button>
                <a
                  href="https://github.com/Ytallo-Gabriel-Oliveira-da-Silva"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  Ver perfil
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CertificatesPage;
