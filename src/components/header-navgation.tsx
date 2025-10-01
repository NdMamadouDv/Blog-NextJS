"use client";

import * as React from "react";
import Link from "next/link";

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { CategoryLite } from "../../types";
import { useCategories } from "@/hooks/useCategories";
import { useCurrentUser } from "@/hooks/useUser";
import { Skeleton } from "./ui/skeleton";

export function HeaderNavigation() {
	const { data, isLoading, error } = useCategories();
	const { isAuthenticated } = useCurrentUser();

	if (isLoading)
		return (
			<div className="flex items-center justify-center gap-4">
				<Skeleton className="h-[20px] w-[125px] rounded-xl" />
				<Skeleton className="h-[20px] w-[125px] rounded-xl" />
			</div>
		);
	if (error) return <p>Erreur : {String((error as Error).message ?? error)}</p>;
	if (!data?.length) return <p>Aucune categorie pour le moment.</p>;
	return (
		<NavigationMenu viewport={false}>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Categories</NavigationMenuTrigger>

					<NavigationMenuContent className="z-2">
						<ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
							{data.map((category: CategoryLite) => (
								<ListItem
									key={category.id}
									href={`/categories/${category.slug}`}>
									{category.name}
								</ListItem>
							))}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>

				{isAuthenticated && (
					<NavigationMenuItem>
						{/* Affiche le lien d'ecriture uniquement aux utilisateurs connectes. */}
						<NavigationMenuLink
							asChild
							className={navigationMenuTriggerStyle()}>
							<Link href="/write">Ecrire un post</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
				)}
			</NavigationMenuList>
		</NavigationMenu>
	);
}

function ListItem({
	title,
	children,
	href,
	...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
	return (
		<li {...props}>
			<NavigationMenuLink asChild>
				<Link href={href}>
					<div className="text-sm leading-none font-medium">{title}</div>
					<p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
						{children}
					</p>
				</Link>
			</NavigationMenuLink>
		</li>
	);
}
