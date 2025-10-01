"use client";

import React from "react";
import Link from "next/link";

import { useCategories } from "@/hooks/useCategories";
import type { CategoryLite } from "../../types";
import { Skeleton } from "./ui/skeleton";

function Categories() {
	const { data, isLoading, error } = useCategories();

	if (isLoading)
		return (
			<div className="mt-4 flex items-center justify-center">
				<div className="grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
					<Skeleton className="h-10 rounded-full" />
					<Skeleton className="h-10 rounded-full" />
					<Skeleton className="h-10 rounded-full" />
					<Skeleton className="h-10 rounded-full" />
				</div>
			</div>
		);

	if (error) return <p>Erreur : {String((error as Error).message ?? error)}</p>;
	if (!data?.length) return <p>Aucune categorie pour le moment.</p>;

	return (
		<div className="mx-auto w-full max-w-4xl">
			<nav className="flex w-full items-center gap-3 overflow-x-auto pb-2 sm:justify-center">
				{data.map((category: CategoryLite) => (
					<Link
						key={category.id}
						href={`/categories/${category.slug}`}
						className="inline-flex shrink-0 items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800">
						{category.name}
					</Link>
				))}
			</nav>
		</div>
	);
}

export default Categories;
