import React from "react";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";
import Image from "next/image";

export default function StackCard() {
	return (
		<div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 ">
			<Card className="w-[280px]">
				<CardHeader>
					<CardTitle>Stack technique</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className="list-disc">
						<li className="">NextJs</li>
						<li className="">Prisma</li>
						<li className="">TailwindCss</li>
						<li className="">NextAuth</li>
						<li className="">Vercel</li>
					</ul>
				</CardContent>
				<CardFooter className="gap-1">
					<Image src="/img/nextjs.png" height={50} alt="" width={50} />
					<Image src="/img/prisma.png" height={50} alt="" width={50} />
					<Image src="/img/tailwindcss.png" height={50} alt="" width={50} />
					<Image src="/img/nextauth.png" height={30} alt="" width={30} />
					<Image src="/img/vercel.png" height={30} alt="" width={30} />
				</CardFooter>
			</Card>
			<Card className="w-[280px]">
				<CardHeader>
					<CardTitle>Fonctionnalités</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className="list-disc">
						<li className="">Authentification + rôles</li>
						<li className="">
							Créer, lire, modifier, supprimer les articles de blog
						</li>
						<li className="">Poster des commentaires</li>
					</ul>
				</CardContent>
				<CardFooter className="gap-1">
					<Image src="/img/dashboard.png" height={1200} alt="" width={1500} />
				</CardFooter>
			</Card>
			<Card className="w-[280px]">
				<CardHeader>
					<CardTitle>Déploiement & conception</CardTitle>
				</CardHeader>
				<CardContent>Vercel et temps de conception : 2 semaines.</CardContent>
				<CardFooter className="flex flex-col items-center justify-center">
					{" "}
					<Image src="/img/vercel.png" height={60} alt="" width={60} />
					<p className="italic text-xs">Logo Vercel</p>
				</CardFooter>
			</Card>
			<Card className="w-[280px]">
				<CardHeader>
					<CardTitle>Dashboard</CardTitle>
				</CardHeader>
				<CardContent>
					Gestion des utilisateurs, edition des rôles, contenu
				</CardContent>
			</Card>
		</div>
	);
}
