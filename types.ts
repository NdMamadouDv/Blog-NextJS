import type { Category, Post as PrismaPost } from "@prisma/client";

export type CategoryLite = Pick<Category, "id" | "name" | "slug">;

export type PostCardData = Pick<
	PrismaPost,
	|	"id"
	|	"title"
	|	"slug"
	|	"author"
	|	"createdAt"
	|	"image"
	|	"view"
	|	"content"
	|	"description"
> & {
	category: CategoryLite | null;
	commentsCount: number;
	user?: { name: string | null; image: string | null; email: string } | null;
};
