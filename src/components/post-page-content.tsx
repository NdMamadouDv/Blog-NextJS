"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Eye, MessageCircle } from "lucide-react";
import { usePost } from "@/hooks/usePost";
import { useCurrentUser } from "@/hooks/useUser";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import TiptapAvecToolbar from "@/components/editor/TiptapWToolbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import type { PostWithAuthor } from "@/hooks/usePost";

type Props = { slug: string };
type UpdatePayload = {
	title?: string;
	description?: string;
	content?: string;
	image?: string | null;
};

const FALLBACK_IMAGE = "/img/hero.jpg";

export default function PostPageContent({ slug }: Props) {
	const { data, isLoading, error } = usePost(slug);
	const { user, isAuthenticated } = useCurrentUser();
	const queryClient = useQueryClient();

	const [isEditing, setIsEditing] = useState(false);
	const [formTitle, setFormTitle] = useState("");
	const [formDescription, setFormDescription] = useState("");
	const [formContent, setFormContent] = useState("");
	const [formImage, setFormImage] = useState<string | null>(null);
	const [file, setFile] = useState<File | null>(null);
	const previewUrlRef = useRef<string | null>(null);

	useEffect(() => {
		return () => {
			if (previewUrlRef.current) {
				URL.revokeObjectURL(previewUrlRef.current);
			}
		};
	}, []);

	const post = data;
	const author = post?.user;

	const isAuthor = Boolean(
		isAuthenticated && user?.email && post?.user?.email && user.email === post.user.email
	);

	const resetFormFromPost = useCallback(() => {
		if (!post) return;
		setFormTitle(post.title ?? "");
		setFormDescription(post.description ?? "");
		setFormContent(post.content ?? "");
		setFormImage(post.image ?? null);
		setFile(null);
		if (previewUrlRef.current) {
			URL.revokeObjectURL(previewUrlRef.current);
			previewUrlRef.current = null;
		}
	}, [post]);

	useEffect(() => {
		resetFormFromPost();
	}, [resetFormFromPost]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selected = e.target.files?.[0];
		if (!selected) return;

		setFile(selected);
		if (previewUrlRef.current) {
			URL.revokeObjectURL(previewUrlRef.current);
		}
		const url = URL.createObjectURL(selected);
		previewUrlRef.current = url;
		setFormImage(url);
	};

	const handleRemoveImage = () => {
		if (previewUrlRef.current) {
			URL.revokeObjectURL(previewUrlRef.current);
			previewUrlRef.current = null;
		}
		setFormImage(null);
		setFile(null);
	};

	const uploadImage = async () => {
		if (!file) return undefined;
		const dataUpload = new FormData();
		dataUpload.set("file", file);
		const response = await axios.post("/api/upload", dataUpload);
		return response.data as string;
	};

	const { mutateAsync, isPending: isSaving } = useMutation({
		mutationFn: async (payload: UpdatePayload) => {
			const { data: updated } = await axios.patch(`/api/posts/${slug}`, payload);
			return updated as PostWithAuthor;
		},
		onSuccess: (updatedPost) => {
			queryClient.setQueryData<PostWithAuthor>(["post", slug], updatedPost);
			setIsEditing(false);
			setFile(null);
			if (previewUrlRef.current) {
				URL.revokeObjectURL(previewUrlRef.current);
				previewUrlRef.current = null;
			}
		},
	});

	const handleSave = async () => {
		if (!post) return;

		const updates: UpdatePayload = {};
		const trimmedTitle = formTitle.trim();
		const trimmedDescription = formDescription.trim();

		if (trimmedTitle && trimmedTitle !== post.title) {
			updates.title = trimmedTitle;
		}
		if (trimmedDescription !== (post.description ?? "")) {
			updates.description = trimmedDescription;
		}
		if (formContent && formContent !== post.content) {
			updates.content = formContent;
		}

		if (file) {
			const uploaded = await uploadImage();
			if (uploaded) {
				updates.image = uploaded;
			}
		} else if ((formImage ?? null) !== (post.image ?? null)) {
			updates.image = formImage ?? null;
		}

		if (Object.keys(updates).length === 0) {
			setIsEditing(false);
			resetFormFromPost();
			return;
		}

		await mutateAsync(updates);
	};

	const handleCancel = () => {
		resetFormFromPost();
		setIsEditing(false);
	};

	if (isLoading) return <p>Chargement...</p>;
	if (error) return <p>Erreur : {String(error)}</p>;
	if (!post) return <p>Aucun post trouve</p>;

	return (
		<div>
			<div className="relative rounded-lg aspect-square md:aspect-[2.4/1] overflow-hidden bg-cover">
				<Image
					src={post.image || FALLBACK_IMAGE}
					alt={post.title}
					fill
					className="z-0 object-cover"
				/>
				<div className="h-full w-full flex flex-col justify-center items-center">
					<div className="z-2 sm:max-w-2xl max-w-xs bg-secondary/80 p-4 rounded-lg">
						<h1 className="font-bold text-3xl sm:text-5xl text-black dark:text-white text-center">
							{post.title || "Pas de titre"}
						</h1>
					</div>
				</div>
			</div>

			<div className="flex justify-between items-start flex-col md:flex-row md:items-center p-3 mb-3 gap-4">
				<div className="flex justify-center items-center gap-3">
					<Avatar>
						<AvatarImage src={author?.image ?? "/img/avatar.jpg"} />
						<AvatarFallback>{post.author?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
					</Avatar>
					<div>
						<p>{post.author}</p>
						{post?.createdAt && (
							<p className="text-slate-500 text-sm">
								Publie le {new Date(post.createdAt).toLocaleDateString("fr-FR", {
									day: "2-digit",
									month: "2-digit",
									year: "numeric",
								})}
							</p>
						)}
					</div>
				</div>

				<div className="flex gap-4 items-center">
					<div className="flex items-center gap-1 text-slate-600">
						<MessageCircle size={20} />
						<p>{post.commentsCount ?? 0}</p>
					</div>
					<div className="flex items-center gap-1 text-slate-600">
						<Eye size={20} />
						<p>{post.view}</p>
					</div>
					{isAuthor && (
						<Button variant="ghost" onClick={() => setIsEditing((prev) => !prev)}>
							{isEditing ? "Fermer l'edition" : "Modifier le post"}
						</Button>
					)}
				</div>
			</div>

			{isEditing ? (
				<div className="mt-6 space-y-4 rounded-lg border p-4 bg-background">
					<Input
						value={formTitle}
						onChange={(e) => setFormTitle(e.target.value)}
						placeholder="Titre"
					/>
					<Textarea
						value={formDescription}
						onChange={(e) => setFormDescription(e.target.value)}
						placeholder="Ajoutez une courte description"
					/>
					{formImage && (
						<div className="relative w-full max-w-md h-48 mx-auto overflow-hidden rounded-md">
							<Image src={formImage} alt={formTitle} fill className="object-cover" />
						</div>
					)}
					<div className="flex items-center gap-3 flex-wrap">
						<Input type="file" onChange={handleFileChange} className="max-w-xs" />
						{(formImage || file) && (
							<Button variant="outline" type="button" onClick={handleRemoveImage}>
								Retirer l'image
							</Button>
						)}
					</div>
					<TiptapAvecToolbar value={formContent} onChange={setFormContent} />
					<div className="flex justify-end gap-3">
						<Button variant="outline" type="button" onClick={handleCancel} disabled={isSaving}>
							Annuler
						</Button>
						<Button type="button" onClick={handleSave} disabled={isSaving}>
							{isSaving ? "Enregistrement..." : "Enregistrer"}
						</Button>
					</div>
				</div>
			) : (
				<>
					{post.description && (
						<p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
							{post.description}
						</p>
					)}
					<Separator />
					<div
						className="mt-6"
						dangerouslySetInnerHTML={{
							__html: post.content as unknown as string,
						}}
					/>
				</>
			)}
		</div>
	);
}
