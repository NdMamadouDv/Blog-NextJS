import PageContainer from "@/components/page-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PostList from "@/components/post-list";
import Categories from "@/components/categories";

export default function Home() {
	return (
		<PageContainer>
			<div className="py-10 px-4">
				{/* Hero */}
				<div
					className="rounded-lg aspect-square md:aspect-[2.4/1] overflow-hidden bg-cover "
					style={{ backgroundImage: "url(/img/hero.jpg)" }}>
					<div className=" relative h-full w-full flex flex-col justify-center items-center">
						<div className="sm:max-w-2xl max-w-xs bg-secondary/80 p-4 rounded-lg">
							<h1 className="font-bold text-3xl sm:text-5xl text-black dark:text-white text-center">
								{" "}
								Bienvenue dans mon Application/Blog
							</h1>
						</div>
					</div>
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
