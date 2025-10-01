"use client";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

function ProfileButton() {
	const { data: session } = useSession();

	const handleLogout = () => {
		signOut();
	};

	if (!session) {
		return (
			<div>
				<Link href="/login">
					<Button>Login</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-3">
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Avatar>
						<AvatarImage src={session.user?.image || "/img/avatar.jpg"} />
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem className="cursor-pointer" asChild>
						<Link href="/profile">Mon profil</Link>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<Button variant="outline" onClick={handleLogout}>
				Se deconnecter
			</Button>
		</div>
	);
}

export default ProfileButton;
