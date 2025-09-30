import Comments from "@/components/comments";
import PostPageContent from "../../../components/post-page-content";
import PageContainer from "@/components/page-container";

type Props = { params: { slug: string } };
function SinglePostPage({ params }: Props) {
	const { slug } = params;
	return (
		<PageContainer>
			<div className="p-8">
				<PostPageContent slug={slug} />
				<Comments postSlug={params.slug} />
			</div>
		</PageContainer>
	);
}

export default SinglePostPage;
