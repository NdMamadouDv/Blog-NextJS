import { PostCardData } from "../../types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Params = {
	categorySlug?: string;
	page?: number;
	limit?: number;
};

// const fetchPosts = async (categorySlug?: string): Promise<PostCardData[]> => {
// 	const url = categorySlug
// 		? `/api/posts?category=${categorySlug}`
// 		: `/api/posts`;
// 	const { data } = await axios.get(url);
// 	return data as PostCardData[];
// };

const fetchPosts = async (params: Params): Promise<PostCardData[]> => {
	const { data } = await axios.get("/api/posts", { params });
	return data.items ?? data;
};

export function usePosts(params: Params = {}) {
	const { categorySlug, page = 1, limit = 12 } = params;
	return useQuery<PostCardData[]>({
		queryKey: ["posts", categorySlug ?? "all"],
		queryFn: () => fetchPosts({ categorySlug, page, limit }),
		staleTime: 30_000,
	});
}
