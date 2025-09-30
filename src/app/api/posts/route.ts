import { NextResponse } from "next/server";
import prisma from "@/lib/connect";
import { getAuthSession } from "@/lib/auth-option";

export const GET = async (req: Request) => {
	const { searchParams } = new URL(req.url);
	const categorySlug = searchParams.get("category") ?? undefined;

	const posts = await prisma.post.findMany({
		where: categorySlug ? { category: { slug: categorySlug } } : undefined,
		orderBy: { createdAt: "desc" },
		select: {
			id: true,
			title: true,
			slug: true,
			author: true,
			description: true,
			createdAt: true,
			image: true,
			view: true,
			content: true,
			category: { select: { name: true, slug: true } },
			user: { select: { name: true, email: true, image: true } },
			_count: { select: { comments: true } },
		},
	});

	const serialized = posts.map(({ _count, ...post }) => ({
		...post,
		commentsCount: _count.comments,
	}));

	return NextResponse.json(serialized, { status: 200 });
};

function slugify(s: string) {
	return s
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/-{2,}/g, "-")
		.replace(/^-|-$/g, "");
}
type NewPostBody = {
	title: string;
	description: string;
	content: string;
	catSlug: string;
	image?: string;
	slug?: string;
};

export const POST = async (req: Request) => {
	try {
		const session = await getAuthSession();
		if (!session || !session.user?.email) {
			return NextResponse.json(
				{ message: "Not authenticated" },
				{ status: 403 }
			);
		}

		const body = (await req.json()) as NewPostBody;

		const title = body.title?.trim();
		const description = body.description?.trim();
		const content = body.content;
		const catSlug = body.catSlug?.trim();

		if (!title || !description || !content || !catSlug) {
			return NextResponse.json(
				{ message: "Donnees manquantes" },
				{ status: 400 }
			);
		}

		const category = await prisma.category.findUnique({
			where: { slug: catSlug },
			select: { id: true },
		});
		if (!category) {
			return NextResponse.json(
				{ message: "Categorie inconnue" },
				{ status: 400 }
			);
		}

		const finalSlug = body.slug ? slugify(body.slug) : slugify(title);
		const finalImage =
			typeof body.image === "string" && body.image.trim() !== ""
				? body.image
				: "/img/hero.jpg";
		const nameFromSession =
			session.user?.name ?? session.user?.email?.split("@")[0] ?? "Anonyme";
		const author = String(nameFromSession);

		const post = await prisma.post.create({
			data: {
				title,
				description,
				slug: finalSlug,
				content,
				image: finalImage,
				categoryId: category.id,
				userEmail: session.user.email!,
				author,
			},
			select: {
				id: true,
				title: true,
				slug: true,
				description: true,
				createdAt: true,
				category: { select: { name: true, slug: true } },
			},
		});

		return NextResponse.json(post, { status: 201 });
	} catch (err) {
		console.error("POST /api/posts error:", err);
		return NextResponse.json({ message: "Internal Error" }, { status: 500 });
	}
};
