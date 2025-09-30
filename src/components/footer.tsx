"use client";
import React from "react";
import PageContainer from "./page-container";
import Link from "next/link";
import { Button } from "./ui/button";
import { useCurrentUser } from "@/hooks/useUser";
import { useCategories } from "@/hooks/useCategories";

function Footer() {
	const { isAuthenticated } = useCurrentUser();
	const { data: categories, isLoading, isError } = useCategories();

	const categoryList = !isLoading && !isError && categories?.length ? categories : [];

	return (
		<footer className=" border-t">
			<PageContainer>
				<div className="flex flex-col md:flex-row items-start md:items-center justify-between">
					<div className="flex gap-2 flex-col md:flex-row items-start">
						{categoryList.map((category) => (
							<div key={category.id}>
								<Link href={`/categories/${category.slug}`}>
									<Button variant="ghost">{category.name}</Button>
								</Link>
							</div>
						))}
						{isAuthenticated && (
							<Button variant="ghost">
								<Link href="/write">Ecrire un post</Link>
							</Button>
						)}
					</div>
				</div>
			</PageContainer>
		</footer>
	);
}

export default Footer;
