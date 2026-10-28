// @ts-check
import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import umami from "@yeskunall/astro-umami";

// https://astro.build/config
export default defineConfig({
	site: "https://rondevz.com",
	// Preserve the Astro 6 Markdown pipeline and spacing when upgrading for security fixes.
	compressHTML: true,
	markdown: {
		processor: unified(),
	},
	integrations: [
		mdx(),
		sitemap(),
		react(),
		// This integration only injects the tracker script. Its Astro 7 peer allowance is in package.json.
		umami({
			id: "6ff2ee5b-612b-4915-8953-aabb0f0f5668",
			autotrack: true,
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
