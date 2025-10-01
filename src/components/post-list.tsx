"use client";
import React from "react";
import PostCard from "./post-card";
import { usePosts } from "@/hooks/usePosts";

type Props = { categorySlug?: string };

function PostList({ categorySlug }: Props) {
	const { data, isLoading, error } = usePosts({ categorySlug });

	if (isLoading) return <p>Chargement...</p>;
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
