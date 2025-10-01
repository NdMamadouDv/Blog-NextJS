"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import type {
	DashboardComment,
	DashboardPost,
	DashboardUser,
} from "./page";

const formatDate = (isoDate: string) => {
	try {
		return new Intl.DateTimeFormat("fr-FR", {
			dateStyle: "medium",
			timeStyle: "short",
		}).format(new Date(isoDate));
	} catch {
		return isoDate;
	}
};

type DashboardContentProps = {
	posts: DashboardPost[];
	comments: DashboardComment[];
	users: DashboardUser[];
	isAdmin: boolean;
};

export default function DashboardContent({
	posts,
	comments,
	users,
	isAdmin,
}: DashboardContentProps) {
	const router = useRouter();
	const [pendingSlug, setPendingSlug] = React.useState<string | null>(null);
	const [pendingUserId, setPendingUserId] = React.useState<string | null>(null);
	const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
	const [isRefreshing, startTransition] = React.useTransition();

	const handleDelete = async (slug: string) => {
		if (!window.confirm("Confirmez-vous la suppression de cet article ?")) {
			return;
		}

		setErrorMessage(null);
		setPendingSlug(slug);

		try {
			const response = await fetch(`/api/posts/${slug}`, { method: "DELETE" });
			if (!response.ok) {
				const data = (await response.json().catch(() => ({}))) as { error?: string };
				throw new Error(data?.error ?? "Suppression impossible");
			}

			startTransition(() => {
				router.refresh();
			});
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : "Suppression impossible");
		} finally {
			setPendingSlug(null);
		}
	};

	const handleRoleChange = async (userId: string, role: "USER" | "ADMIN") => {
		setErrorMessage(null);
		setPendingUserId(userId);

		try {
			const response = await fetch("/api/users", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId, role }),
			});

			if (!response.ok) {
				const data = (await response.json().catch(() => ({}))) as { error?: string };
				throw new Error(data?.error ?? "Impossible de mettre a jour le role");
			}

			startTransition(() => {
				router.refresh();
			});
		} catch (error) {
			setErrorMessage(
				error instanceof Error
					? error.message
					: "Impossible de mettre a jour le role"
			);
		} finally {
			setPendingUserId(null);
		}
	};

	return (
		<div className="space-y-8">
			{errorMessage && (
				<Alert variant="destructive">
					<AlertDescription>{errorMessage}</AlertDescription>
				</Alert>
			)}

			{isAdmin && (
				<Card>
					<CardHeader>
						<CardTitle>Administration des roles</CardTitle>
						<CardDescription>
							Modifier les droits des utilisateurs de la plateforme.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{users.length === 0 ? (
							<p className="text-sm text-muted-foreground">
								Aucun utilisateur a afficher.
							</p>
						) : (
							<ul className="space-y-3">
								{users.map((user) => {
									const isUpdating = pendingUserId === user.id;
									return (
										<li
											key={user.id}
											className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
											<div>
												<p className="font-medium">{user.name ?? user.email ?? "Utilisateur"}</p>
												<p className="text-sm text-muted-foreground">
													{user.email ?? "Email indisponible"}
												</p>
											</div>
											<Select
												value={user.role}
												onValueChange={(value) =>
													handleRoleChange(user.id, value as "USER" | "ADMIN")
												}
												disabled={isUpdating}
											>
												<SelectTrigger className="w-[180px]">
													<SelectValue placeholder="Selectionner le role" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="USER">Utilisateur</SelectItem>
													<SelectItem value="ADMIN">Administrateur</SelectItem>
												</SelectContent>
											</Select>
										</li>
									);
								})}
							</ul>
						)}
					</CardContent>
				</Card>
			)}

			<Card>
				<CardHeader>
					<CardTitle>Vos articles</CardTitle>
					<CardDescription>Gerez les publications que vous avez redigees.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{posts.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							Vous n'avez pas encore publie d'article.
						</p>
					) : (
						<ul className="space-y-4">
							{posts.map((post) => {
								const isDeleting = pendingSlug === post.slug;
								return (
									<li
										key={post.id}
										className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
										<div className="space-y-1">
											<p className="font-medium">{post.title}</p>
											<p className="text-sm text-muted-foreground flex flex-wrap items-center gap-2">
												<span>Publie le {formatDate(post.createdAt)}</span>
												<Badge variant="secondary">
													{post.commentsCount} commentaire{post.commentsCount > 1 ? "s" : ""}
												</Badge>
											</p>
										</div>
										<div className="flex flex-wrap items-center gap-2">
											<Button variant="outline" asChild>
												<Link href={`/posts/${post.slug}`}>Ouvrir</Link>
											</Button>
											<Button
												variant="destructive"
												onClick={() => handleDelete(post.slug)}
												disabled={isDeleting || isRefreshing}>
												{isDeleting ? "Suppression..." : "Supprimer"}
											</Button>
										</div>
									</li>
								);
							})}
						</ul>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Vos commentaires</CardTitle>
					<CardDescription>Retrouvez vos dernieres interventions.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{comments.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							Vous n'avez pas encore laisse de commentaire.
						</p>
					) : (
						<ul className="space-y-4">
							{comments.map((comment) => (
								<li key={comment.id} className="rounded-lg border p-4 space-y-3">
									<div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
										<div>
											<p className="font-medium">{comment.postTitle}</p>
											<p className="text-sm text-muted-foreground">
												Publie le {formatDate(comment.createdAt)}
											</p>
										</div>
										<Button variant="link" asChild className="px-0">
											<Link href={`/posts/${comment.postSlug}`}>Voir l'article</Link>
										</Button>
									</div>
									<p className="text-sm leading-relaxed text-muted-foreground">
										{comment.content}
									</p>
								</li>
							))}
						</ul>
					)}
				</CardContent>
			</Card>
		</div>
	);
}