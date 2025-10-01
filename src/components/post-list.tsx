"use client";

import React from "react";

import { usePosts } from "@/hooks/usePosts";
import PostCard from "./post-card";
import { Skeleton } from "./ui/skeleton";

type Props = { categorySlug?: string };

function PostList({ categorySlug }: Props) {
	const { data, isLoading, error } = usePosts({ categorySlug });

	if (isLoading)
		return (
			<div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{Array.from({ length: 4 }).map((_, index) => (
					<div key={index} className="space-y-3">
						<Skeleton className="aspect-[4/3] w-full rounded-2xl" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="h-4 w-2/4" />
						</div>
					</div>
				))}
			</div>
		);
	if (error) return <p>Erreur: {error.message}</p>;
	if (!data?.length) return <p>Aucun post pour le moment.</p>;

	return (
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{data.map((post) => (
				<PostCard key={post.id} post={post} />
			))}
		</div>
	);
}

export default PostList;
