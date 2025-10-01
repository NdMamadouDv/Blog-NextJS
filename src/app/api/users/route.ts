import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

import { getAuthSession } from "@/lib/auth-option";
import prisma from "@/lib/connect";

type UpdateRolePayload = {
	userId?: string;
	role?: Role;
};

export const PATCH = async (req: Request) => {
	try {
		const session = await getAuthSession();
		if (!session || session.user?.role !== "ADMIN") {
			return NextResponse.json({ error: "Action reservee aux administrateurs" }, { status: 403 });
		}

		const { userId, role } = (await req.json()) as UpdateRolePayload;
		if (!userId || !role || !["USER", "ADMIN"].includes(role)) {
			return NextResponse.json({ error: "Parametres invalides" }, { status: 400 });
		}

		const updated = await prisma.user.update({
			where: { id: userId },
			data: { role },
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
			},
		});

		return NextResponse.json(updated, { status: 200 });
	} catch (error) {
		console.error("PATCH /api/users error:", error);
		return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
	}
};