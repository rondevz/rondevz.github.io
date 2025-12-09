export interface Project {
  title: string;
  description: string;
  techStack: string[];
  link?: string;
  github?: string;
}

export const contributedProjects: Project[] = [
  {
    title: "MoonGuard",
    description: "Keep your sites in orbit. Watch your production web apps status.",
    techStack: ["PHP", "Laravel", "Filament"],
    github: "https://github.com/taecontrol/moonguard"
  },
  {
    title: "Larvis",
    description: "PHP Interface library to communicate with MoonGuard or Krater.",
    techStack: ["PHP"],
    github: "https://github.com/taecontrol/larvis"
  },
];
