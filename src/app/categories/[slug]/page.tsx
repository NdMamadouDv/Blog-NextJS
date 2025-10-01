import PageContainer from "@/components/page-container";
import PageTitle from "@/components/page-title";
import PostList from "@/components/post-list";
import { notFound } from "next/navigation";
import React from "react";

type PageProps = {
	params?: {
		slug?: string | string[];
	};
};

export default function Categories({ params }: PageProps) {
	const slugParam = params?.slug;
	const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

	if (!slug) {
		notFound();
	}

	return (
		<PageContainer>
			<div className="py-10 px-4">
				<PageTitle title={slug.replace(/-/g, " ")} />
				<PostList categorySlug={slug} />
			</div>
		</PageContainer>
	);
}