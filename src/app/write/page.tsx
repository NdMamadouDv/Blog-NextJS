"use client";
import PageContainer from "@/components/page-container";
import PageTitle from "@/components/page-title";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/useCategories";
import { useCurrentUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { CategoryLite } from "../../../types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import TiptapAvecToolbar from "@/components/editor/TiptapWToolbar";
import Image from "next/image";

type NewPostBody = {
	title: string;
	description: string;
	content: string;
	slug: string;
	image: string;
	catSlug: string;
};

export default function Page() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [catSlug, setCatSlug] = useState("");
	const [content, setContent] = useState("<p></p>");
	const [file, setFile] = useState<File>();
	const [imageObjectUrl, setImageObjectUrl] = useState<string | null>(null);
	const { status, isAuthenticated } = useCurrentUser();
	const { data: categories, isFetching } = useCategories();

	const router = useRouter();

	useEffect(() => {
		if (status === "unauthenticated") router.replace("/login");
	}, [status, router]);

	const onChangeFile = (e: SyntheticEvent) => {
		const files = (e.target as HTMLInputElement).files;
		if (!files || !files[0]) {
			return;
		}
		setFile(files[0]);
		setImageObjectUrl(URL.createObjectURL(files[0]));
	};

	const uploadImage = async () => {
		try {
			if (!file) return;
			const data = new FormData();
			data.set("file", file);
			const response = await axios.post("/api/upload", data);
			return response.data as string;
		} catch (error) {
			console.error("Error", error);
		}
	};

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (body: NewPostBody) => {
			const { data } = await axios.post("/api/posts", body);
			return data;
		},
		onSuccess: (data) => {
			setTitle("");
			setDescription("");
			setContent("");
			setCatSlug("");
			setFile(undefined);
			setImageObjectUrl(null);
			router.push(`/posts/${data.slug}`);
		},
	});

	const handleSubmit = async (e: SyntheticEvent) => {
		e.preventDefault();
		if (!title.trim() || !description.trim() || !content || !catSlug) return;
		const uploadedImage = await uploadImage();
		await mutateAsync({
			title,
			description,
			content,
			catSlug,
			slug: title.trim().toLowerCase().replace("", "-"),
			image: uploadedImage ?? "",
		});
	};

	if (status === "loading") {
		return (
			<PageContainer>
				<p>Chargement en cours...</p>
			</PageContainer>
		);
	}

	if (!isAuthenticated) {
		return (
			<PageContainer>
				<p className="text-center text-slate-500">
					Vous devez etre connecte pour rediger un article.
				</p>
			</PageContainer>
		);
	}

	return (
		<div className="p-4">
			<PageContainer>
				<PageTitle title="Ecrivez votre post ici" />
				<div className="flex flex-col gap-8">
					<Input
						type="text"
						value={title}
						placeholder="Titre de votre article"
						onChange={(e) => setTitle(e.target.value)}
					/>

					<Textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Ajoutez une courte description pour vos lecteurs"
					/>

					<div className="mb-6">
						{imageObjectUrl && (
							<div className="relative w-40 h-40 mx-auto">
								<Image src={imageObjectUrl} fill alt={title} />
							</div>
						)}
						<Input type="file" onChange={onChangeFile} name="image" />
					</div>

					<Select value={catSlug} onValueChange={(value) => setCatSlug(value)}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Selectionnez une categorie" />
						</SelectTrigger>
						<SelectContent>
							{categories?.map((category: CategoryLite) => (
								<SelectItem key={category.id} value={category.slug}>
									{category.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<TiptapAvecToolbar value={content} onChange={setContent} />

					<Button
						disabled={isFetching || isPending}
						onClick={handleSubmit}
						className="mx-auto">
						Publier
					</Button>
				</div>
			</PageContainer>
		</div>
	);
}
