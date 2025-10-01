"use client";
import PageContainer from "@/components/page-container";
import PageTitle from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Github, Mail } from "lucide-react";
import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
export default function LoginPage() {
	const { data: session, status } = useSession();
	const [loading, setLoading] = useState(false);
	if (status === "loading") return null;
	if (!session)
		return (
			<PageContainer>
				<div className="p-8 flex flex-col items-center  gap-2 border mt-12 rounded-2xl max-w-lg mx-auto  ">
					<PageTitle title="Se connecter ou s'enregistrer" />
					<form
						onSubmit={async (e) => {
							e.preventDefault();
							setLoading(true);
						}}
						className="space-y-2">
						<div className="flex flex-col gap-4 ">
							<input
								name="email"
								type="email"
								placeholder="Email"
								className="input border border-gray-200 p-2 rounded-md"
							/>
							<input
								name="password"
								type="password"
								placeholder="Mot de passe"
								className="input border border-gray-200 p-2 rounded-md"
							/>
							<Button disabled={loading} className=" bg-gray-600">
								{loading ? "..." : "Se connecter"}
							</Button>
						</div>
					</form>
					<div className="flex justify-center items-center gap-4 mt-4">
						<Button onClick={() => signIn("github")} className="">
							<Github className=" " />
							Se connecter avec GitHub
						</Button>
						<Button onClick={() => signIn("google")}>
							<Mail className="" />
							Se connecter avec Gmail
						</Button>
					</div>
				</div>
			</PageContainer>
		);
	return (
		<div className="flex flex-col items-center gap-2 mt-16">
			<PageTitle
				title={` Connecté en tant que : ${session.user?.name as string}`}
			/>

			<Button onClick={() => signOut()} variant="destructive">
				Se deconnecter
			</Button>
		</div>
	);
}
