import { LucideIcon } from "lucide-react";

interface SkillCardProps {
  icon: LucideIcon;
  title: string;
  skills: string[];
  color?: string;
}

export default function SkillCard({
  icon: Icon,
  title,
  skills,
  color = "from-primary to-accent",
}: SkillCardProps) {
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative bg-card border border-border rounded-lg p-6 hover-glow transition-all duration-300 h-full">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} p-2.5 mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-full h-full text-white" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-3">{title}</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20 hover:border-primary/50 transition-colors duration-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
