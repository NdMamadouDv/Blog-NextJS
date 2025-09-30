import { writeFile, mkdir } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export const POST = async (req: Request) => {
	const data = await req.formData();
	const file: File | null = data.get("file") as File | null;
	if (!file) {
		return NextResponse.json({ message: "Pas de fichier !" }, { status: 400 });
	}
	const bytes = await file.arrayBuffer();
	const buffer = Buffer.from(bytes);

	// 1) S'assurer que le dossier existe
	const uploadsDir = path.join(process.cwd(), "public", "img");
	await mkdir(uploadsDir, { recursive: true });

	// 2) Construire un chemin *sans* slash en tête (sinon path.join casse sur Windows)
	const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
	const absPath = path.join(uploadsDir, fileName);

	try {
		await writeFile(absPath, buffer);
		const url = `/img/${fileName}`;
		return NextResponse.json(url, { status: 200 });
	} catch (error) {
		console.log("fichier mal uploadé", error);
		return NextResponse.json(
			{ message: "Something went wrong" },
			{ status: 500 }
		);
	}
};
