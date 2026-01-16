export type Skill = {
	name: string;
	category: SkillCategory;
	iconUrl?: string;
};

export type SkillCategory =
	| "Languages"
	| "Frameworks"
	| "Mobile"
	| "3D"
	| "Databases"
	| "Cloud & DevOps"
	| "Desktop"
	| "Game Dev"
	| "Design";

export const skills: Skill[] = [
	{ name: "PHP", category: "Languages", iconUrl: "https://cdn.simpleicons.org/php" },
	{ name: "JavaScript", category: "Languages", iconUrl: "https://cdn.simpleicons.org/javascript" },
	{ name: "TypeScript", category: "Languages", iconUrl: "https://cdn.simpleicons.org/typescript" },
	{ name: "Go", category: "Languages", iconUrl: "https://cdn.simpleicons.org/go" },
	{ name: "C#", category: "Languages", iconUrl: "https://cdn.jsdelivr.net/npm/@programming-languages-logos/csharp@0.0.0/csharp_256x256.png" },

	{ name: "Laravel", category: "Frameworks", iconUrl: "https://cdn.simpleicons.org/laravel" },
	{ name: "React", category: "Frameworks", iconUrl: "https://cdn.simpleicons.org/react" },
	{ name: "Vue.js", category: "Frameworks", iconUrl: "https://cdn.simpleicons.org/vuedotjs" },
	{ name: "Next.js", category: "Frameworks", iconUrl: "https://cdn.simpleicons.org/nextdotjs/ffffff" },
	{ name: "Angular", category: "Frameworks", iconUrl: "https://cdn.simpleicons.org/angular/C3002F" },
	{ name: "Astro", category: "Frameworks", iconUrl: "https://cdn.simpleicons.org/astro" },
	{ name: "Livewire", category: "Frameworks", iconUrl: "https://cdn.simpleicons.org/livewire" },
	{ name: "Inertia.js", category: "Frameworks", iconUrl: "https://cdn.simpleicons.org/inertia" },
	{ name: "Filament", category: "Frameworks", iconUrl: "https://cdn.simpleicons.org/filament" },
	{ name: "Statamic", category: "Frameworks", iconUrl: "https://cdn.simpleicons.org/statamic" },

	{ name: "React Native", category: "Mobile", iconUrl: "https://cdn.simpleicons.org/react" },
	{ name: "Ionic", category: "Mobile", iconUrl: "https://cdn.simpleicons.org/ionic" },
	{ name: "Flutter", category: "Mobile", iconUrl: "https://cdn.simpleicons.org/flutter" },

	{ name: "Tailwind CSS", category: "Design", iconUrl: "https://cdn.simpleicons.org/tailwindcss" },
	{ name: "Figma", category: "Design", iconUrl: "https://cdn.simpleicons.org/figma" },

	{ name: "Node.js", category: "Cloud & DevOps", iconUrl: "https://cdn.simpleicons.org/nodedotjs" },
	{ name: "Docker", category: "Cloud & DevOps", iconUrl: "https://cdn.simpleicons.org/docker" },
	{ name: "DigitalOcean", category: "Cloud & DevOps", iconUrl: "https://cdn.simpleicons.org/digitalocean" },
	{ name: "AWS", category: "Cloud & DevOps", iconUrl: "https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/dark/aws-color.png" },

	{ name: "MySQL", category: "Databases", iconUrl: "https://cdn.simpleicons.org/mysql" },
	{ name: "PostgreSQL", category: "Databases", iconUrl: "https://cdn.simpleicons.org/postgresql" },
	{ name: "SQLite", category: "Databases", iconUrl: "https://cdn.simpleicons.org/sqlite" },
	{ name: "Meilisearch", category: "Databases", iconUrl: "https://cdn.simpleicons.org/meilisearch" },
	{ name: "Turso", category: "Databases", iconUrl: "https://cdn.simpleicons.org/turso" },

	{ name: "Three.js", category: "3D", iconUrl: "https://cdn.simpleicons.org/threedotjs/ffffff" },
	{ name: "Blender", category: "3D", iconUrl: "https://cdn.simpleicons.org/blender" },

	{ name: "Wails", category: "Desktop", iconUrl: "https://cdn.simpleicons.org/wails" },
	{ name: "Tauri", category: "Desktop", iconUrl: "https://cdn.simpleicons.org/tauri" },

	{ name: "Godot", category: "Game Dev", iconUrl: "https://cdn.simpleicons.org/godotengine" },
	{ name: "Phaser", category: "Game Dev", iconUrl: "https://cdn.phaser.io/images/logo/phaser-planet-small.png" },
];
