import PageContainer from "@/components/page-container";
import PageTitle from "@/components/page-title";
import PostList from "@/components/post-list";
import React from "react";

type Props = { params: { slug: string } };

export default function Categories({ params }: Props) {
	const { slug } = params;
	return (
		<PageContainer>
			<div className="py-10 px-4">
				<PageTitle title={slug.replace("-", " ")} />
				<PostList categorySlug={slug} />
			</div>
		</PageContainer>
	);
}
