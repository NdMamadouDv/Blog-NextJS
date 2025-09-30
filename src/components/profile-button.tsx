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
	const { data: session, status } = useSession();

	// console.log("session", session, "status", status);
	// User is Not connecter -> Button loggin
	//  user is connecter -> Hide button
	const onLogout = () => {
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
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar>
					<AvatarImage src={session?.user?.image || "/img/avatar.jpg"} />
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onClick={onLogout} className="cursor-pointer">
					Se déconnecter
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default ProfileButton;
