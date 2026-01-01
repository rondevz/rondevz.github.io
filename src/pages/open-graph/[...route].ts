import { getCollection } from "astro:content";
import { OGImageRoute } from "astro-og-canvas";

const posts = await getCollection("blog");

const pages = Object.fromEntries(posts.map((post) => [post.id, post.data]));

export const { getStaticPaths, GET } = OGImageRoute({
	param: "route",
	pages,
	getImageOptions: (_path, page) => ({
		title: page.title,
		description: page.description,
		bgImage: {
			path: "./public/metadata-template.jpg",
			fit: "cover",
			position: "center",
		},
		padding: 70,
		font: {
			title: {
				size: 66,
				lineHeight: 1.1,
				weight: "Black",
				color: [246, 51, 154],
			},
			description: {
				size: 36,
				lineHeight: 1.25,
				weight: "Normal",
				color: [30, 41, 59],
			},
		},
		fonts: [
			"./public/fonts/Inter-Regular.ttf",
			"./public/fonts/Inter-Bold.ttf",
			"./public/fonts/Inter-SemiBold.ttf",
			"./public/fonts/Inter-Black.ttf",
		],
	}),
});
