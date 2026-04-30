export interface Project {
	title: string;
	description: string;
	techStack: string[];
	link?: string;
	github?: string;
}

export const contributedProjects: Project[] = [
	{
		title: "Phant",
		description:
			"Desktop toolkit for PHP and Laravel teams. Manage sites, switch PHP versions, monitor services, and inspect dumps in one native app built for fast daily development. ",
		techStack: ["PHP", "Laravel", "Wails"],
		github: "https://github.com/rondevz/phant",
	},
	{
		title: "Metavision",
		description:
			"Open-source browser extension that lets you preview social metadata (Open Graph + X/Twitter cards) directly from local development",
		techStack: ["WXT", "Web Extension", "Chrome", "Firefox"],
		github: "https://github.com/rondevz/metavision",
	},
	{
		title: "MoonGuard",
		description: "Keep your sites in orbit. Watch your production web apps status.",
		techStack: ["Laravel", "PHP", "Filament"],
		github: "https://github.com/taecontrol/moonguard",
	},
	{
		title: "Larvis",
		description: "PHP Interface library to communicate with MoonGuard or Krater.",
		techStack: ["Laravel", "PHP"],
		github: "https://github.com/taecontrol/larvis",
	},
];
