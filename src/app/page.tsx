import PageContainer from "@/components/page-container";
import PostList from "@/components/post-list";
import Categories from "@/components/categories";
import Image from "next/image";
import StackCard from "@/components/stack-card";
import Link from "next/link";

export default function Home() {
	return (
		<PageContainer>
			<div className="py-10 px-4 flex flex-col gap-6">
				{/* Hero */}
				<div
					className="rounded-lg aspect-square md:aspect-[2.4/1] overflow-hidden bg-cover "
					style={{ backgroundImage: "url(/img/hero.jpg)" }}>
					<div className=" relative h-full w-full flex flex-col justify-center items-center">
						<div className="sm:max-w-2xl max-w-xs bg-secondary/80 p-4 rounded-lg">
							<h1 className="font-bold text-3xl sm:text-5xl text-black dark:text-white text-center">
								{" "}
								Mon blog technique — projets, code, retours
							</h1>
						</div>
					</div>
				</div>
				{/* Case study */}
				<div className="p-8 bg-slate-200 rounded-xl">
					<div className="flex flex-col gap-4">
						<h2 className="font-bold mt-2 text-2xl sm:text-4xl text-slate-700">
							Case Study : Développement d’un blog moderne avec Next.js
						</h2>
						<h3 className="italic">
							Authentification, rôles, dashboard et UX optimisée.
						</h3>
						<Image
							src="/img/post.jpg"
							alt="Blog"
							height={200}
							width={200}
							className="rounded-lg"
						/>
					</div>

					<StackCard />
					<h3 className="mt-1">Voir le code: ➡️</h3>
					<Link href="https://github.com/NdMamadouDv/Blog-NextJS" />
				</div>

				{/* Catégories */}
				<h2 className="font-bold text-center mt-4 text-2xl sm:text-4xl text-slate-700">
					Catégories
				</h2>
				<Categories />
				{/* posts */}
				<div className="">
					<PostList />
				</div>
			</div>
		</PageContainer>
	);
}
