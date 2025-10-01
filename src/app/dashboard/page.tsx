import PageContainer from "@/components/page-container";
import PageTitle from "@/components/page-title";
import prisma from "@/lib/connect";
import { getAuthSession } from "@/lib/auth-option";
import { redirect } from "next/navigation";

import DashboardContent from "@/components/dashboard-content";

export type DashboardPost = {
	id: string;
	title: string;
	slug: string;
	createdAt: string;
	commentsCount: number;
};

export type DashboardComment = {
	id: string;
	content: string;
	createdAt: string;
	postSlug: string;
	postTitle: string;
};

export type DashboardUser = {
	id: string;
	email: string | null;
	name: string | null;
	role: "USER" | "ADMIN";
};

const serializeDate = (date: Date) => date.toISOString();

export default async function DashboardPage() {
	const session = await getAuthSession();
	const email = session?.user?.email;

	if (!session || !email) {
		redirect("/login");
	}

	const isAdmin = session.user?.role === "ADMIN";

	const postsPromise = prisma.post.findMany({
		where: { userEmail: email },
		orderBy: { createdAt: "desc" },
		select: {
			id: true,
			title: true,
			slug: true,
			createdAt: true,
			_count: { select: { comments: true } },
		},
	});

	const commentsPromise = prisma.comment.findMany({
		where: { userEmail: email },
		orderBy: { createdAt: "desc" },
		select: {
			id: true,
			content: true,
			createdAt: true,
			post: { select: { slug: true, title: true } },
		},
	});

	const usersPromise = isAdmin
		? prisma.user.findMany({
				orderBy: { createdAt: "desc" },
				select: {
					id: true,
					email: true,
					name: true,
					role: true,
				},
		  })
		: Promise.resolve([] as DashboardUser[]);

	const [posts, comments, users] = await Promise.all([
		postsPromise,
		commentsPromise,
		usersPromise,
	]);

	const serializedPosts: DashboardPost[] = posts.map((post) => ({
		id: post.id,
		title: post.title,
		slug: post.slug,
		createdAt: serializeDate(post.createdAt),
		commentsCount: post._count.comments,
	}));

	const serializedComments: DashboardComment[] = comments
		.filter((comment) => Boolean(comment.post))
		.map((comment) => ({
			id: comment.id,
			content: comment.content,
			createdAt: serializeDate(comment.createdAt),
			postSlug: comment.post!.slug,
			postTitle: comment.post!.title,
		}));

	const serializedUsers: DashboardUser[] = isAdmin
		? (
				users as {
					id: string;
					email: string | null;
					name: string | null;
					role: "USER" | "ADMIN";
				}[]
		  ).map((user) => ({
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
		  }))
		: [];

	return (
		<PageContainer>
			<div className="py-10 px-4 space-y-8">
				<PageTitle title="Tableau de bord" />
				<DashboardContent
					posts={serializedPosts}
					comments={serializedComments}
					users={serializedUsers}
					isAdmin={isAdmin}
				/>
			</div>
		</PageContainer>
	);
}
