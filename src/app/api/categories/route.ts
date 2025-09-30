// /api/categories
import { NextResponse } from "next/server";
import prisma from "@/lib/connect";

export const GET = async () => {
	const categories = await prisma.category.findMany({
		select: { id: true, name: true, slug: true },
		orderBy: { name: "asc" },
	});
	return NextResponse.json(categories, { status: 200 });
};
