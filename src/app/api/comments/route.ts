import { getAuthSession } from "@/lib/auth-option";
import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
	const session = await getAuthSession();

	if (!session || !session.user) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 403 });
	}

	const { content, postSlug } = await req.json();

	if (!content || !postSlug) {
		return NextResponse.json({ error: "Donnees invalides" }, { status: 400 });
	}

	const email = session.user.email;
	if (!email) {
		return NextResponse.json({ error: "Email manquant" }, { status: 400 });
	}

	try {
		const comment = await prisma.comment.create({
			data: {
				content,
				postSlug,
				userEmail: email,
			},
			select: {
				id: true,
				content: true,
				createdAt: true,
				postSlug: true,
				user: { select: { name: true, image: true } },
			},
		});
		return NextResponse.json(comment, { status: 201 });
	} catch (error) {
		console.error("Erreur lors de la creation d'un commentaire", error);
		return NextResponse.json(
			{ error: "Probleme de creation de commentaire" },
			{ status: 500 }
		);
	}
};

export const GET = async (req: Request) => {
	const { searchParams } = new URL(req.url);
	const postSlug = searchParams.get("slug");

	if (!postSlug) {
		return NextResponse.json({ error: "Slug manquant" }, { status: 400 });
	}

	try {
		const comments = await prisma.comment.findMany({
			where: { postSlug },
			orderBy: { createdAt: "desc" },
			select: {
				id: true,
				content: true,
				createdAt: true,
				postSlug: true,
				user: { select: { name: true, image: true } },
			},
		});
		return NextResponse.json(comments, { status: 200 });
	} catch (error) {
		console.error("Erreur lors de la recuperation des commentaires", error);
		return NextResponse.json({ error: "Impossible de recuperer les commentaires" }, { status: 500 });
	}
};

type DeletePayload = { commentId?: string };

export const DELETE = async (req: Request) => {
	const session = await getAuthSession();
	if (!session || session.user?.role !== "ADMIN") {
		return NextResponse.json({ error: "Action reservee aux admins" }, { status: 403 });
	}

	const { commentId } = (await req.json()) as DeletePayload;
	if (!commentId) {
		return NextResponse.json({ error: "Commentaire non precis" }, { status: 400 });
	}

	try {
		await prisma.comment.delete({ where: { id: commentId } });
		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		console.error("Erreur lors de la suppression d'un commentaire", error);
		return NextResponse.json({ error: "Suppression impossible" }, { status: 500 });
	}
};
