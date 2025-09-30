"use client";
import { Menu } from "lucide-react";
import React from "react";
import {
	SheetTrigger,
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "./ui/sheet";
import { Button } from "./ui/button";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import { useCurrentUser } from "@/hooks/useUser";

function ResponsiveMenu() {
	const { data: categories, isLoading, isError } = useCategories();
	const { isAuthenticated } = useCurrentUser();

	return (
		<Sheet>
			<SheetTrigger>
				<Menu className="h-6 w-6 md:hidden" />
			</SheetTrigger>

			<SheetContent side="left">
				<SheetHeader>
					<SheetTitle>Navigation</SheetTitle>
				</SheetHeader>
				<div className="flex flex-col gap-4 h-1/2 w-full">
					<div>
						<p>Categories</p>
						{!isLoading && !isError &&
							categories?.map((category) => (
								<Link
									className="block w-full px-2 py-1 text-lg"
									key={category.id}
									href={`/categories/${category.slug}`}>
									<Button variant="ghost">{category.name}</Button>
								</Link>
							))}
					</div>

					{isAuthenticated && (
						<Link href="/write" className="self-center">
							<Button variant="ghost">Write a Post</Button>
						</Link>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}

export default ResponsiveMenu;
