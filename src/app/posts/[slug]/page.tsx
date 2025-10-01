import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Comments from "@/components/comments";
import PostPageContent from "../../../components/post-page-content";
import PageContainer from "@/components/page-container";
import SeoJsonLd from "@/components/seo-json-ld";
import { siteConfig } from "@/lib/site-config";
import prisma from "@/lib/connect";

type Props = { params: { slug: string } };

type PostForSeo = {
	slug: string;
	title: string;
	description: string | null;
	image: string | null;
	author: string | null;
	createdAt: Date;
	updatedAt: Date;
};

const fetchPostForSeo = cache(async (slug: string) => {
	return prisma.post.findUnique({
		where: { slug },
		select: {
			slug: true,
			title: true,
			description: true,
			image: true,
			author: true,
			createdAt: true,
		},
	});
});

const toAbsoluteUrl = (path: string | null | undefined) => {
	if (!path || path.length === 0)
		return `${siteConfig.url}${siteConfig.ogImage}`;
	if (path.startsWith("http")) return path;
	return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const post = (await fetchPostForSeo(params.slug)) as PostForSeo | null;

	if (!post) {
		return {
			title: `Article introuvable | ${siteConfig.name}`,
			description: siteConfig.description,
		};
	}

	const canonicalUrl = `${siteConfig.url}/posts/${post.slug}`;
	const imageUrl = toAbsoluteUrl(post.image);
	const description = post.description ?? siteConfig.description;

	return {
		title: `${post.title} | ${siteConfig.name}`,
		description,
		alternates: {
			canonical: canonicalUrl,
		},
		openGraph: {
			type: "article",
			url: canonicalUrl,
			title: post.title,
			description,
			siteName: siteConfig.name,
			publishedTime: post.createdAt.toISOString(),
			modifiedTime: post.updatedAt.toISOString(),
			images: [
				{
					url: imageUrl,
					width: 1200,
					height: 630,
					alt: post.title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: post.title,
			description,
			images: [imageUrl],
		},
	};
}

export default async function SinglePostPage({ params }: Props) {
	const post = (await fetchPostForSeo(params.slug)) as PostForSeo | null;

	if (!post) {
		notFound();
	}

	const canonicalUrl = `${siteConfig.url}/posts/${post.slug}`;
	const imageUrl = toAbsoluteUrl(post.image);

	const articleJsonLd = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: post.title,
		description: post.description ?? siteConfig.description,
		image: [imageUrl],
		author: {
			"@type": "Person",
			name: post.author ?? siteConfig.creator,
		},
		publisher: {
			"@type": "Person",
			name: siteConfig.creator,
		},
		datePublished: post.createdAt.toISOString(),
		dateModified: post.updatedAt.toISOString(),
		mainEntityOfPage: canonicalUrl,
		url: canonicalUrl,
	};

	return (
		<PageContainer>
			<SeoJsonLd data={articleJsonLd} id="article-jsonld" />
			<div className="p-8">
				<PostPageContent slug={params.slug} />
				<Comments postSlug={params.slug} />
			</div>
		</PageContainer>
	);
}
