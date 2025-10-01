"use client";
import { useCategories } from "@/hooks/useCategories";

import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { CategoryLite } from "../../types";
import { Skeleton } from "./ui/skeleton";

function Categories() {
	const { data, isLoading, error } = useCategories();

	if (isLoading)
		return (
			<div className="flex items-center justify-center mt-4">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
					<Skeleton className="h-[50px] w-[125px] rounded-xl" />
					<Skeleton className="h-[50px] w-[125px] rounded-xl" />
					<Skeleton className="h-[50px] w-[125px] rounded-xl" />
					<Skeleton className="h-[50px] w-[125px] rounded-xl" />
				</div>
			</div>
		);
	if (error) return <p>Erreur : {String((error as Error).message ?? error)}</p>;
	if (!data?.length) return <p>Aucune catégorie pour le moment.</p>;

	return (
		<div className="mt-4 flex flex-col md:flex-row justify-center items-center gap-4">
			{data.map((category: CategoryLite) => (
				<Button variant="outline" key={category.id}>
					<Link href={`/categories/${category.slug}`}>{category.name}</Link>
				</Button>
			))}
		</div>
	);
}

export default Categories;
