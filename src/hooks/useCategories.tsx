import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { CategoryLite } from "../../types";

const fetchCategories = async (): Promise<CategoryLite[]> => {
	const { data } = await axios.get("/api/categories");
	return data as CategoryLite[];
};

export function useCategories() {
	return useQuery<CategoryLite[]>({
		queryKey: ["categories"],
		queryFn: fetchCategories,
		staleTime: 30_000,
	});
}
