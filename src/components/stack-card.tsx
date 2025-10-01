import Image from "next/image";

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";

const techLogos = [
	{ src: "/img/nextjs.png", alt: "Next.js" },
	{ src: "/img/prisma.png", alt: "Prisma" },
	{ src: "/img/tailwindcss.png", alt: "Tailwind CSS" },
	{ src: "/img/nextauth.png", alt: "NextAuth" },
	{ src: "/img/vercel.png", alt: "Vercel" },
];

export default function StackCard() {
	return (
		<div className="grid gap-4 sm:grid-cols-2">
			<Card className="h-full rounded-3xl border bg-background shadow-sm">
				<CardHeader>
					<CardTitle className="text-lg">Stack technique</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className="space-y-2 text-sm text-muted-foreground">
						<li>Next.js, React et TypeScript</li>
						<li>Prisma et PostgreSQL</li>
						<li>Stylisation avec Tailwind CSS</li>
						<li>Authentification NextAuth</li>
					</ul>
				</CardContent>
				<CardFooter className="flex flex-wrap items-center gap-3">
					{techLogos.map((logo) => (
						<Image
							key={logo.alt}
							src={logo.src}
							alt={logo.alt}
							height={40}
							width={40}
							className="h-10 w-10 object-contain"
						/>
					))}
				</CardFooter>
			</Card>

			<Card className="h-full rounded-3xl border bg-background shadow-sm">
				<CardHeader>
					<CardTitle className="text-lg">Fonctionnalites clefs</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className="space-y-2 text-sm text-muted-foreground">
						<li>Authentification, roles et moderation</li>
						<li>Edition en ligne avec Tiptap</li>
						<li>Commentaires et statistiques de lecture</li>
						<li>Dashboard administrateur personnalise</li>
					</ul>
				</CardContent>
			</Card>

			<Card className="h-full rounded-3xl border bg-background shadow-sm">
				<CardHeader>
					<CardTitle className="text-lg">Deploiement</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3 text-sm text-muted-foreground">
					<p>Hebergement sur Vercel pour profiter du rendu hybride.</p>
					<p>Monitoring des performances et du SEO via les outils Vercel.</p>
				</CardContent>
				<CardFooter>
					<Image src="/img/vercel.png" alt="Vercel" height={48} width={48} className="h-12 w-12 object-contain" />
				</CardFooter>
			</Card>

			<Card className="h-full rounded-3xl border bg-background shadow-sm">
				<CardHeader>
					<CardTitle className="text-lg">Experience utilisateur</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 text-sm text-muted-foreground">
					<p>Mode sombre, navigation mobile et transitions fluides.</p>
					<p>Composants accessibles avec gestion des erreurs.</p>
				</CardContent>
			</Card>
		</div>
	);
}

