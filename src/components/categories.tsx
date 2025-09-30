"use client";
import { useCategories } from "@/hooks/useCategories";

import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { CategoryLite } from "../../types";

function Categories() {
	const { data, isLoading, error } = useCategories();

	if (isLoading) return <p>Chargement…</p>;
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
