import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/connect";
import { hash } from "bcryptjs";

const schema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(6),
});

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { name, email, password } = schema.parse(body);

		const exists = await prisma.user.findUnique({ where: { email } });
		if (exists) {
			return NextResponse.json(
				{ error: "Email déjà utilisé" },
				{ status: 400 }
			);
		}

		const hashed = await hash(password, 12);
		await prisma.user.create({
			data: { name, email, password: hashed, role: "USER" },
		});

		return NextResponse.json({ ok: true }, { status: 201 });
	} catch (e) {
		return NextResponse.json(
			{ error: "Inscription impossible" },
			{ status: 400 }
		);
	}
}
