import { ExternalLink, Github } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}

export default function ProjectCard({
  title,
  description,
  technologies,
  githubUrl,
  liveUrl,
  featured = false,
}: ProjectCardProps) {
  return (
    <div
      className={`group relative ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative bg-card border border-border rounded-lg p-6 hover-glow transition-all duration-300 h-full flex flex-col">
        {featured && (
          <div className="mb-4">
            <span className="px-3 py-1 bg-gradient-to-r from-primary to-accent text-white text-xs font-semibold rounded-full">
              Projeto em Destaque
            </span>
          </div>
        )}

        <h3 className={`font-semibold text-foreground mb-2 ${
          featured ? "text-2xl" : "text-lg"
        }`}>
          {title}
        </h3>

        <p className="text-muted-foreground text-sm mb-4 flex-grow">
          {description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded border border-secondary/20"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-background transition-all duration-300 text-sm font-medium"
            >
              <Github size={16} />
              Código
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent hover:text-background transition-all duration-300 text-sm font-medium"
            >
              <ExternalLink size={16} />
              Ver
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
