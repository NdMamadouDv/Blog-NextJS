import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

import PageContainer from "@/components/page-container";
import PostList from "@/components/post-list";
import Categories from "@/components/categories";
import StackCard from "@/components/stack-card";
import { Button } from "@/components/ui/button";
import SeoJsonLd from "@/components/seo-json-ld";
import { siteConfig } from "@/lib/site-config";

const websiteJsonLd = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	name: siteConfig.name,
	url: siteConfig.url,
	description: siteConfig.description,
	inLanguage: siteConfig.locale,
	potentialAction: {
		"@type": "SearchAction",
		target: `${siteConfig.url}/search?q={search_term_string}`,
		"query-input": "required name=search_term_string",
	},
};

export default function Home() {
	return (
		<>
			<SeoJsonLd data={websiteJsonLd} id="website-jsonld" />
			<PageContainer>
				<div className="flex flex-col gap-16 py-12">
					<section className="relative overflow-hidden rounded-3xl border bg-slate-950 text-white">
						<Image
							src="/img/hero.jpg"
							alt="Illustration de bureaux et de developpeurs"
							fill
							priority
							className="absolute inset-0 h-full w-full object-cover opacity-70"
						/>
						<div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-900/40" />
						<div className="relative z-10 px-6 py-16 sm:px-12 lg:px-16">
							<span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium uppercase tracking-widest text-white/80 backdrop-blur">
								<Sparkles size={16} />
								Carnet de projets
							</span>
							<h1 className="mt-6 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
								Construire des experiences web modernes avec Next.js
							</h1>
							<p className="mt-4 max-w-2xl text-base text-slate-200 sm:text-lg">
								Tutoriels, retours d experience et bonnes pratiques pour faire
								evoluer vos projets.
							</p>
							<div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
								<Button asChild size="lg" className="gap-2 text-base">
									<Link href="/posts">
										Explorer les articles
										<ArrowRight size={18} />
									</Link>
								</Button>
								<Button
									asChild
									variant="outline"
									size="lg"
									className="gap-2 border-white/40 bg-white/10 text-white hover:bg-white/20">
									<Link href="/register">
										Rejoindre la communaute
										<Sparkles size={16} />
									</Link>
								</Button>
							</div>
							<div className="mt-12 grid gap-6 sm:grid-cols-3">
								<div>
									<p className="text-3xl font-semibold">20+</p>
									<p className="text-sm text-slate-300">
										Articles publies et maintenus a jour
									</p>
								</div>
								<div>
									<p className="text-3xl font-semibold">6</p>
									<p className="text-sm text-slate-300">
										Projets Next.js deployes dans ce blog
									</p>
								</div>
								<div>
									<p className="text-3xl font-semibold">100%</p>
									<p className="text-sm text-slate-300">
										Code open source, pret a explorer
									</p>
								</div>
							</div>
						</div>
					</section>

					<section className="grid gap-10 lg:grid-cols-[1.2fr,0.8fr]">
						<article className="rounded-3xl border bg-card p-6 shadow-sm sm:p-10">
							<header className="space-y-4">
								<h2 className="text-2xl font-semibold sm:text-3xl">
									Case study: un blog Next.js robuste et evolutif
								</h2>
								<p className="text-base text-muted-foreground">
									Authentification securisee, gestion de roles, moderation des
									commentaires et interface oriente utilisateur.
								</p>
							</header>
							<ul className="mt-8 grid gap-5 text-sm sm:text-base">
								<li className="flex items-start gap-3">
									<CheckCircle2 className="mt-1 h-5 w-5 text-emerald-500" />
									<span>
										Architecture modulaire basee sur Prisma et React Query.
									</span>
								</li>
								<li className="flex items-start gap-3">
									<CheckCircle2 className="mt-1 h-5 w-5 text-emerald-500" />
									<span>
										Dashboard admin, edition en ligne et suivi des interactions.
									</span>
								</li>
								<li className="flex items-start gap-3">
									<CheckCircle2 className="mt-1 h-5 w-5 text-emerald-500" />
									<span>
										Design responsive, optimisations performance et
										accesibilite.
									</span>
								</li>
							</ul>
							<div className="mt-8 flex flex-wrap md:justify-between items-center gap-4">
								<Image
									src="/img/post.jpg"
									alt="Capture du blog"
									height={240}
									width={360}
									className="rounded-2xl border object-cover"
								/>
								<Button
									asChild
									variant="ghost"
									className="gap-2 px-0 text-base font-medium self-end justify-self-end">
									<Link
										href="https://github.com/NdMamadouDv/Blog-NextJS"
										target="_blank"
										rel="noreferrer">
										Voir le code sur GitHub
										<ArrowRight size={18} />
									</Link>
								</Button>
							</div>
						</article>
						<aside className="space-y-6">
							<StackCard />
						</aside>
					</section>

					<section className="space-y-6">
						<header className="space-y-2 text-center">
							<h2 className="text-2xl font-semibold sm:text-3xl">Categories</h2>
							<p className="text-sm text-muted-foreground sm:text-base">
								Explorer les thematiques qui structurent le blog technique.
							</p>
						</header>
						<Categories />
					</section>

					<section className="space-y-6">
						<header className="flex flex-col gap-3 text-center">
							<h2 className="text-2xl font-semibold sm:text-3xl">
								Articles recents
							</h2>
							<p className="text-sm text-muted-foreground sm:text-base">
								Un concentre de tutoriels concrets pour vos prochains projets.
							</p>
						</header>
						<PostList />
					</section>
				</div>
			</PageContainer>
		</>
	);
}
