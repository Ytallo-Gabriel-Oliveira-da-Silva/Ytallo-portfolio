import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Code2,
  Database,
  Cloud,
  Zap,
  Briefcase,
  Award,
  ArrowRight,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkillCard from "@/components/SkillCard";
import ProjectCard from "@/components/ProjectCard";

export default function Home() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [scrollY, setScrollY] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendMessageMutation = trpc.contact.sendMessage.useMutation();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center pt-20 px-4 relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl opacity-20" />

        <div className="container relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="animate-fade-in-up">
              <div className="mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary animate-spin" />
                <span className="text-primary font-semibold">
                  {t("welcome")}
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                {t("greeting")}{" "}
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  {t("name")}
                </span>
              </h1>

              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                {t("title")} {t("description")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => scrollToSection("projects")}
                  className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-background font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  {t("viewProjects")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => setLocation("/curriculo")}
                  className="px-8 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-all duration-300"
                >
                  Currículo
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="px-8 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-all duration-300"
                >
                  {t("contactMe")}
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
                <div>
                  <div className="text-2xl font-bold text-primary">18</div>
                  <div className="text-sm text-muted-foreground">{t("years")}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">10+</div>
                  <div className="text-sm text-muted-foreground">{t("projects_count")}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">15+</div>
                  <div className="text-sm text-muted-foreground">{t("certificates")}</div>
                </div>
              </div>
            </div>

            {/* Profile Image */}
            <div className="animate-fade-in-down relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-1 border border-primary/20 overflow-hidden">
                <img
                  src="/profile.jpg"
                  alt="Ytallo Gabriel"
                  className="w-full h-full rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 relative">
        <div className="absolute top-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

        <div className="container relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t("skillsTitle")} <span className="text-primary">{t("skillsTitle").split(" ")[1]}</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("skillsSubtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkillCard
              icon={Code2}
              title="Frontend"
              skills={[
                "React",
                "React-Native",
                "JavaScript",
                "TypeScript",
                "Tailwind CSS",
              ]}
              color="from-primary to-cyan-500"
            />
            <SkillCard
              icon={Database}
              title="Backend"
              skills={[
                "Node.js",
                "Express",
                "Python",
                "Java",
                "Spring Boot",
              ]}
              color="from-secondary to-purple-600"
            />
            <SkillCard
              icon={Cloud}
              title="Cloud & Infra"
              skills={["AWS", "Firebase", "MySQL", "Segurança Web", "Redes"]}
              color="from-accent to-pink-600"
            />
            <SkillCard
              icon={Zap}
              title="Outras Tecnologias"
              skills={["Git", "Docker", "REST APIs", "Robótica", "Física"]}
              color="from-cyan-500 to-blue-600"
            />
            <SkillCard
              icon={Briefcase}
              title="Empreendedorismo"
              skills={["Gestão de Projetos", "Liderança", "Inovação", "MEI"]}
              color="from-purple-600 to-pink-600"
            />
            <SkillCard
              icon={Award}
              title="Idiomas"
              skills={["Português", "Inglês Avançado"]}
              color="from-pink-600 to-rose-600"
            />
          </div>
        </div>
      </section>

      {/* Formation Section */}
      <section id="formation" className="py-20 px-4 bg-card/50">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Formação Acadêmica
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Minha trajetória acadêmica e formação técnica em tecnologia.
            </p>
          </div>

          <div className="space-y-5 max-w-4xl mx-auto">
            <div className="animate-fade-in-up border border-border rounded-lg p-6 hover-glow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary p-2.5 flex-shrink-0">
                  <GraduationCap className="w-full h-full text-white" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-foreground">
                    Tecnólogo em Análise e Desenvolvimento de Sistemas
                  </h3>
                  <p className="text-muted-foreground mb-2">UNIGRANDE | Em andamento</p>
                  <p className="text-foreground">
                    Formação acadêmica em desenvolvimento de sistemas, análise de requisitos, arquitetura de software, lógica e soluções digitais.
                  </p>
                </div>
              </div>
            </div>

            <div className="animate-fade-in-up border border-border rounded-lg p-6 hover-glow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-accent p-2.5 flex-shrink-0">
                  <GraduationCap className="w-full h-full text-white" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-foreground">
                    Escola Técnica Estadual Ginásio Pernambucano - Técnico em Análise e Desenvolvimento de Sistemas
                  </h3>
                  <p className="text-muted-foreground mb-2">Concluído em 2025</p>
                  <p className="text-foreground">
                    Formação técnica com foco em programação, lógica, desenvolvimento de software e boas práticas de criação de soluções.
                  </p>
                </div>
              </div>
            </div>

            <div className="animate-fade-in-up border border-border rounded-lg p-6 hover-glow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-pink-600 p-2.5 flex-shrink-0">
                  <GraduationCap className="w-full h-full text-white" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-foreground">
                    Escola Técnica Estadual Ginásio Pernambucano - Ensino Médio
                  </h3>
                  <p className="text-muted-foreground mb-2">Concluído em 2025</p>
                  <p className="text-foreground">
                    Conclusão do ensino médio com formação de base acadêmica e desenvolvimento de pensamento crítico e técnico.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-4 bg-card/50">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t("experienceTitle")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("experienceSubtitle")}
            </p>
          </div>

          <div className="space-y-8">
            {/* Faculdade */}
            <div className="animate-fade-in-up border border-border rounded-lg p-6 hover-glow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary p-2.5 flex-shrink-0">
                  <Briefcase className="w-full h-full text-white" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-foreground">
                    Faculdade: Tecnólogo em Análise e Desenvolvimento de Sistemas
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    UNIGRANDE | Em andamento
                  </p>
                  <p className="text-foreground">
                    Formação acadêmica com foco em desenvolvimento de sistemas, análise de requisitos, arquitetura de software e soluções digitais.
                  </p>
                </div>
              </div>
            </div>

            {/* Cybersegurança */}
            <div className="animate-fade-in-up border border-border rounded-lg p-6 hover-glow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-accent p-2.5 flex-shrink-0">
                  <Award className="w-full h-full text-white" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-foreground">
                    Curso de Cyber Segurança
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    DIO + Riachuelo | Em andamento
                  </p>
                  <p className="text-foreground">
                    Aprendizado em fundamentos de segurança digital, proteção de sistemas, boas práticas e consciência em cybersegurança.
                  </p>
                </div>
              </div>
            </div>

            {/* ETE */}
            <div className="animate-fade-in-up border border-border rounded-lg p-6 hover-glow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-pink-600 p-2.5 flex-shrink-0">
                  <Code2 className="w-full h-full text-white" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-foreground">
                    Técnico em Desenvolvimento de Sistemas
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    ETE Ginásio Pernambucano | 2023 - 2025
                  </p>
                  <p className="text-foreground">
                    Formação técnica em desenvolvimento de sistemas com foco em programação, lógica, solução de problemas e boas práticas de desenvolvimento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t("projectsTitle")} <span className="text-accent">{t("projectsTitle").split(" ").slice(1).join(" ")}</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("projectsSubtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProjectCard
              title="Hydra AI API"
              description="API inteligente para integração de IA, automações e serviços modernos com foco em escalabilidade e facilidade de uso."
              technologies={["Node.js", "TypeScript", "API REST", "IA", "Express"]}
              githubUrl="https://github.com/Ytallo-Gabriel-Oliveira-da-Silva/Hydra-AI-API"
              featured
            />
            <ProjectCard
              title="Sistema de Robótica"
              description="Projeto de robótica com integração de sensores e controle automático."
              technologies={["Python", "Arduino", "Física", "Robótica"]}
            />
            <ProjectCard
              title="Aplicativo Mobile"
              description="Aplicativo desenvolvido em React-Native para iOS e Android."
              technologies={["React-Native", "JavaScript", "Firebase"]}
            />
            <ProjectCard
              title="API REST"
              description="API robusta desenvolvida com Node.js e Express para gerenciamento de dados."
              technologies={["Node.js", "Express", "MySQL", "REST"]}
            />
            <ProjectCard
              title="Dashboard de Gestão"
              description="Painel para análise de dados e organização de processos com foco em usabilidade e informações em tempo real."
              technologies={["React", "TypeScript", "Dashboard", "UX"]}
            />
            <ProjectCard
              title="Automação de Processos"
              description="Fluxos automatizados para reduzir tarefas repetitivas e aumentar a produtividade digital."
              technologies={["Python", "APIs", "Automação", "Integração"]}
            />
          </div>

          <div className="text-center mt-12">
            <a
              href="https://github.com/Ytallo-Gabriel-Oliveira-da-Silva"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-all duration-300"
            >
              {t("viewAll")}
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section id="certificates" className="py-20 px-4 bg-card/50">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t("certificatesTitle")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("certificatesSubtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Tecnólogo em Análise e Desenvolvimento de Sistemas",
                org: "Unigrande",
                year: "Em andamento",
              },
              {
                title: "Técnico em Desenvolvimento de Sistemas",
                org: "ETE Ginásio Pernambucano",
                year: "Concluído",
              },
              {
                title: "Cyber Segurança",
                org: "DIO + Riachuelo",
                year: "Em andamento",
              },
              {
                title: "Monitoria Voluntária Bolsista em Robótica e Física",
                org: "ETE Ginásio Pernambucano",
                year: "2023, 2024 e 2025",
              },
              {
                title: "Imersão DEV com Google Gemini",
                org: "Alura + Google",
                year: "Concluído",
              },
              {
                title: "8ª ONDA",
                org: "Olimpíada Nacional de Aplicativos",
                year: "2024",
              },
            ].map((cert, index) => (
              <div
                key={index}
                className="animate-fade-in-up border border-border rounded-lg p-6 hover-glow"
              >
                <div className="flex items-start gap-4">
                  <Award className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-foreground mb-1">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {cert.org}
                    </p>
                    <p className="text-xs text-primary font-semibold">
                      {cert.year}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/certificados"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-secondary text-background font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
            >
              {t("viewCertificates")}
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t("contactTitle")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("contactSubtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-3xl mx-auto">
            {[
              {
                icon: "📧",
                title: "Email",
                value: "ytallok644549@gmail.com",
                href: "mailto:ytallok644549@gmail.com",
              },
              {
                icon: "📍",
                title: "Localização",
                value: "Paulista - PE, Brasil",
                href: "#",
              },
            ].map((contact, index) => (
              <a
                key={index}
                href={contact.href}
                className="border border-border rounded-lg p-6 text-center hover-glow transition-all duration-300 group"
              >
                <div className="text-4xl mb-3">{contact.icon}</div>
                <h3 className="font-semibold text-foreground mb-2">
                  {contact.title}
                </h3>
                <p className="text-muted-foreground group-hover:text-primary transition-colors">
                  {contact.value}
                </p>
              </a>
            ))}
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <form className="space-y-4 animate-fade-in-up" onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              try {
                const result = await sendMessageMutation.mutateAsync(formData);
                if (result.success) {
                  toast.success(result.message);
                  setFormData({ name: "", email: "", message: "" });
                } else {
                  toast.error(result.message);
                }
              } catch (error) {
                toast.error("Erro ao enviar mensagem. Tente novamente.");
                console.error(error);
              } finally {
                setIsSubmitting(false);
              }
            }}>
              <div>
                <input
                  type="text"
                  placeholder={t("yourName")}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 disabled:opacity-50"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder={t("yourEmail")}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 disabled:opacity-50"
                  required
                />
              </div>
              <div>
                <textarea
                  placeholder={t("yourMessage")}
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 resize-none disabled:opacity-50"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-3 bg-gradient-to-r from-primary to-secondary text-background font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? `${t("sendMessage").split(" ")[0]}...` : t("sendMessage")}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
