"use client";
import React, { SyntheticEvent, useMemo, useState } from "react";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircleIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { PostWithAuthor } from "@/hooks/usePost";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/useUser";

type CreateComment = {
	content: string;
	postSlug: string;
};

type CommentWithUser = {
	id: string;
	content: string;
	createdAt: string;
	postSlug: string;
	user: {
		name: string | null;
		image: string | null;
	} | null;
};

const fetchComments = async (slug: string): Promise<CommentWithUser[]> => {
	const { data } = await axios.get("/api/comments", { params: { slug } });
	return data;
};

const createComment = async (
	newComment: CreateComment
): Promise<CommentWithUser> => {
	const { data } = await axios.post("/api/comments", newComment);
	return data;
};

const deleteComment = async (commentId: string) => {
	await axios.delete("/api/comments", { data: { commentId } });
};

export default function Comments({ postSlug }: { postSlug: string }) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const callbackUrl = useMemo(() => {
		const query = searchParams.toString();
		const base = query ? `${pathname}?${query}` : pathname;
		return `${base}#comments`;
	}, [pathname, searchParams]);
	const [content, setContent] = useState("");
	const { status, isAdmin } = useCurrentUser();
	const queryClient = useQueryClient();

	const {
		data: comments = [],
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["comments", postSlug],
		queryFn: () => fetchComments(postSlug),
		enabled: !!postSlug,
		staleTime: 10_000,
	});

	const createMutation = useMutation({
		mutationFn: createComment,
		onSuccess: (comment: CommentWithUser) => {
			queryClient.setQueryData<CommentWithUser[] | undefined>(
				["comments", postSlug],
				(old) => (old ? [comment, ...old] : [comment])
			);
			queryClient.setQueryData<PostWithAuthor | undefined>(
				["post", postSlug],
				(previous) =>
					previous
						? { ...previous, commentsCount: previous.commentsCount + 1 }
						: previous
			);
			setContent("");
		},
	});

	const deleteMutation = useMutation({
		mutationFn: deleteComment,
		onSuccess: (_, commentId) => {
			queryClient.setQueryData<CommentWithUser[] | undefined>(
				["comments", postSlug],
				(old) => old?.filter((comment) => comment.id !== commentId)
			);
			queryClient.setQueryData<PostWithAuthor | undefined>(
				["post", postSlug],
				(previous) =>
					previous
						? {
								...previous,
								commentsCount: Math.max(0, previous.commentsCount - 1),
						  }
						: previous
			);
		},
	});

	const onSubmit = async (e: SyntheticEvent) => {
		e.preventDefault();
		if (!content) {
			return;
		}
		await createMutation.mutateAsync({ content, postSlug });
	};

	const handleDelete = async (commentId: string) => {
		if (!isAdmin) return;
		await deleteMutation.mutateAsync(commentId);
	};

	const showAuthWarning = status === "unauthenticated";

	return (
		<div className="mt-10">
			<Separator />
			<h2 className="text-2xl text-slate-500 font-semibold mt-4">
				Commentaires
			</h2>
			<div className="mt-2 mb-6">
				<div>
					{showAuthWarning && (
						<Alert variant="default">
							<AlertCircleIcon />
							<AlertTitle>
								Vous ne pouvez pas commenter pour le moment.
							</AlertTitle>
							<AlertDescription>
								<p className="underline">Solution :</p>
								<ul className="list-inside list-decimal text-sm">
									<li>
										Creer un compte ou bien se connecter via Google/GitHub ici:{" "}
										<Link
											href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
											className="text-blue-500 underline">
											Se connecter
										</Link>{" "}
									</li>
									<li>Commenter</li>
								</ul>
							</AlertDescription>
						</Alert>
					)}
					<Textarea
						value={content}
						placeholder="Tapez votre commentaire ici"
						onChange={(e) => setContent(e.target.value)}
						disabled={status !== "authenticated"}
					/>
					<Button
						disabled={
							content === "" ||
							createMutation.isPending ||
							status !== "authenticated"
						}
						className="mt-4"
						onClick={onSubmit}>
						{createMutation.isPending ? "Envoi en cours.." : "Commenter"}
					</Button>
				</div>
			</div>

			<div className="space-y-4">
				{isLoading && (
					<p className="text-sm text-slate-500">
						Chargement des commentaires...
					</p>
				)}
				{isError && (
					<p className="text-sm text-red-500">
						Impossible de charger les commentaires.
					</p>
				)}
				{!isLoading && !isError && comments.length === 0 && (
					<p className="text-sm text-slate-500">
						Soyez le premier a laisser un commentaire.
					</p>
				)}
				{comments.map((comment) => (
					<div key={comment.id} className="flex gap-3">
						<Avatar className="h-10 w-10">
							<AvatarImage src={comment.user?.image ?? "/img/avatar.jpg"} />
							<AvatarFallback>
								{comment.user?.name?.charAt(0)?.toUpperCase() ?? "?"}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1">
							<div className="flex items-center gap-2">
								<p className="font-semibold text-sm">
									{comment.user?.name ?? "Utilisateur"}
								</p>
								<span className="text-xs text-slate-500">
									{new Date(comment.createdAt).toLocaleDateString("fr-FR", {
										day: "2-digit",
										month: "2-digit",
										year: "numeric",
									})}
								</span>
							</div>
							<p className="text-sm text-slate-600 dark:text-slate-300">
								{comment.content}
							</p>
						</div>
						{isAdmin && (
							<Button
								variant="ghost"
								size="icon"
								onClick={() => handleDelete(comment.id)}
								disabled={deleteMutation.isPending}
								title="Supprimer le commentaire">
								<Trash2 className="h-4 w-4" />
							</Button>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

