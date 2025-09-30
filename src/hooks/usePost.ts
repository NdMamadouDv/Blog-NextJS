import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Post } from "@prisma/client";

export type PostWithAuthor = Post & {
	user: { name: string | null; image: string | null; email: string } | null;
	commentsCount: number;
};

const getPostBySlug = async (slug: string): Promise<PostWithAuthor> => {
	const { data } = await axios.get(`/api/posts/${slug}`);
	return data;
};

export function usePost(slug: string) {
	return useQuery({
		queryKey: ["post", slug],
		queryFn: () => getPostBySlug(slug),
		enabled: !!slug,
		staleTime: 30_000,
	});
}
