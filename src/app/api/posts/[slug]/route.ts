import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/connect";
import { getAuthSession } from "@/lib/auth-option";

type Props = { params: Promise<{ slug: string }> };

const postSelect = {
	id: true,
	title: true,
	slug: true,
	description: true,
	content: true,
	author: true,
	image: true,
	view: true,
	createdAt: true,
	category: {
		select: { id: true, name: true, slug: true },
	},
	user: {
		select: { name: true, email: true, image: true },
	},
	_count: { select: { comments: true } },
};

type PostWithCounts = Prisma.PostGetPayload<{ select: typeof postSelect }>;

const serialize = (post: PostWithCounts) => {
	const { _count, ...rest } = post;
	return {
		...rest,
		commentsCount: _count.comments,
	};
};

export const GET = async (_req: Request, { params }: Props) => {
	try {
		const { slug } = await params;
		const post = await prisma.post.update({
			where: { slug },
			data: { view: { increment: 1 } },
			select: postSelect,
		});
		return NextResponse.json(serialize(post), { status: 200 });
	} catch {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}
};

type UpdatePayload = {
	title?: string;
	description?: string;
	content?: string;
	image?: string | null;
};

export const PATCH = async (req: Request, { params }: Props) => {
	try {
		const session = await getAuthSession();
		if (!session || !session.user?.email) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 403 });
		}

		const { slug } = await params;
		const existing = await prisma.post.findUnique({
			where: { slug },
			select: { userEmail: true },
		});

		if (!existing) {
			return NextResponse.json({ error: "Post introuvable" }, { status: 404 });
		}

		const isOwner = existing.userEmail === session.user.email;
		if (!isOwner) {
			return NextResponse.json({ error: "Modification non autorisee" }, { status: 403 });
		}

		const body = (await req.json()) as UpdatePayload;
		const data: UpdatePayload = {};

		if (typeof body.title === "string" && body.title.trim().length > 0) {
			data.title = body.title.trim();
		}
		if (typeof body.description === "string") {
			data.description = body.description.trim();
		}
		if (typeof body.content === "string") {
			data.content = body.content;
		}
		if (typeof body.image === "string") {
			data.image = body.image.trim();
		}
		if (body.image === null) {
			data.image = null;
		}

		if (Object.keys(data).length === 0) {
			return NextResponse.json({ error: "Aucune donnee a mettre a jour" }, { status: 400 });
		}

		const updated = await prisma.post.update({
			where: { slug },
			data,
			select: postSelect,
		});

		return NextResponse.json(serialize(updated), { status: 200 });
	} catch (err) {
		console.error("PATCH /api/posts/[slug] error:", err);
		return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
	}
};

export const DELETE = async (_req: Request, { params }: Props) => {
	try {
		const session = await getAuthSession();
		const email = session?.user?.email;

		if (!session || !email) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 403 });
		}

		const { slug } = await params;
		const existing = await prisma.post.findUnique({
			where: { slug },
			select: { userEmail: true },
		});

		if (!existing) {
			return NextResponse.json({ error: "Post introuvable" }, { status: 404 });
		}

		const isOwner = existing.userEmail === email;
		const isAdmin = session.user?.role === "ADMIN";

		if (!isOwner && !isAdmin) {
			return NextResponse.json({ error: "Suppression non autorisee" }, { status: 403 });
		}

		await prisma.post.delete({ where: { slug } });
		return NextResponse.json({ success: true }, { status: 200 });
	} catch (err) {
		console.error("DELETE /api/posts/[slug] error:", err);
		return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
	}
};




