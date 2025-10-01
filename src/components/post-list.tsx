"use client";
import React from "react";
import PostCard from "./post-card";
import { usePosts } from "@/hooks/usePosts";
import { Skeleton } from "./ui/skeleton";

type Props = { categorySlug?: string };

function PostList({ categorySlug }: Props) {
	const { data, isLoading, error } = usePosts({ categorySlug });

	if (isLoading)
		return (
			<div className="mt-12">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 space-y-3">
					<div className="">
						<Skeleton className="h-[125px] w-[250px] rounded-xl" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-[250px]" />
							<Skeleton className="h-4 w-[200px]" />
						</div>
					</div>
					<div className="">
						<Skeleton className="h-[125px] w-[250px] rounded-xl" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-[250px]" />
							<Skeleton className="h-4 w-[200px]" />
						</div>
					</div>
					<div className="">
						<Skeleton className="h-[125px] w-[250px] rounded-xl" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-[250px]" />
							<Skeleton className="h-4 w-[200px]" />
						</div>
					</div>
					<div className="">
						<Skeleton className="h-[125px] w-[250px] rounded-xl" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-[250px]" />
							<Skeleton className="h-4 w-[200px]" />
						</div>
					</div>
				</div>
			</div>
		);
	if (error) return <p>Erreur: {error.message}</p>;
	if (!data?.length) return <p>Aucun post pour le moment.</p>;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
			{data.map((post) => (
				<PostCard key={post.id} post={post} />
			))}
		</div>
	);
}

export default PostList;
