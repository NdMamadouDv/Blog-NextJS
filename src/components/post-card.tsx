import { PostCardData } from "../../types";
import Link from "next/link";
import Image from "next/image";
import { Eye, MessageCircle } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";

type Props = { post: PostCardData };
function PostCard({ post }: Props) {
	return (
		<Link href={`/posts/${post.slug}`}>
			<Card className="flex h-full flex-col justify-between rounded-3xl border bg-background shadow-sm transition hover:-translate-y-1 hover:shadow-md">
				<CardHeader className="space-y-3 p-0">
					<div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl">
						<Image
							src={post.image || "/img/hero.jpg"}
							fill
							alt={post.title}
							className="object-cover transition-transform duration-300 hover:scale-105"
						/>
					</div>
					<div className="space-y-1 px-6 pt-4">
						<Badge variant="outline" className="rounded-full border-slate-300 text-xs uppercase tracking-wide">
							{post.category?.name ?? "General"}
						</Badge>
						<p className="text-lg font-semibold leading-tight">{post.title}</p>
					</div>
				</CardHeader>
				<CardContent className="flex-1 px-6 pb-4">
					{post.description && (
						<p className="text-sm text-muted-foreground line-clamp-3">{post.description}</p>
					)}
				</CardContent>
				<CardFooter className="px-6 pb-6">
					<div className="flex items-center gap-4 text-sm text-muted-foreground">
						<div className="flex items-center gap-1">
							<MessageCircle size={18} />
							<span>{post.commentsCount ?? 0}</span>
						</div>
						<div className="flex items-center gap-1">
							<Eye size={18} />
							<span>{post.view}</span>
						</div>
					</div>
				</CardFooter>
			</Card>
		</Link>
	);
}

export default PostCard;
