import { PostCardData } from "../../types";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Eye, MessageCircle } from "lucide-react";

type Props = { post: PostCardData };
function PostCard({ post }: Props) {
	return (
		<Link href={`/posts/${post.slug}`}>
			<Card className="flex flex-col justify-between rounded-lg border-2 h-[100%]">
				<CardHeader>
					<div className="aspect-square relative">
						<Image
							src={post.image || "/img/hero.jpg"}
							fill
							alt={post.title}
							className="aspect-square object-cover transition-all duration-300 hover:scale-110"
						/>
					</div>
					<p className="text-semibold text-lg mt-3">{post.title} </p>
				</CardHeader>
				<CardContent>
					<Badge variant="outline">{post.category?.name}</Badge>
					{post.description && (
						<p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-3">
							{post.description}
						</p>
					)}
				</CardContent>
				<CardFooter>
					<div className="flex gap-2">
						<div className="flex items-center gap-1">
							<MessageCircle size={26} className="text-slate-500" />
							<p className="text-slate-500"> {post.commentsCount ?? 0}</p>
						</div>
						<div className="flex items-center gap-1">
							<Eye size={26} className="text-slate-500" />
							<p className="text-slate-500"> {post.view}</p>
						</div>
					</div>
				</CardFooter>
			</Card>
		</Link>
	);
}

export default PostCard;
