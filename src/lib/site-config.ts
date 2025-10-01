export const siteConfig = {
	name: "Blog Next.js - Mamadou Ndiaye",
	description:
		"Articles techniques et retours d experience sur Next.js, React, Prisma et les bonnes pratiques du developpement web.",
	url:
		process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog-next-js-weld.vercel.app/",
	ogImage: "/img/hero.jpg",
	locale: "fr_FR",
	creator: "Mamadou Ndiaye",
	keywords: [
		"Next.js",
		"React",
		"Prisma",
		"TypeScript",
		"Blog technique",
		"Developpement web",
		"Tutoriel",
	],
};

export type SiteConfig = typeof siteConfig;
