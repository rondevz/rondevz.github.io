// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import umami from "@yeskunall/astro-umami";

// https://astro.build/config
export default defineConfig({
	site: "https://rondevz.github.io",
	integrations: [
		mdx(),
		sitemap(),
		react(),
		umami({
			id: "6ff2ee5b-612b-4915-8953-aabb0f0f5668",
			autotrack: true,
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
