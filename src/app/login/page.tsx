"use client";
import PageContainer from "@/components/page-container";
import PageTitle from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Github, Mail } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
	const { status } = useSession();
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

	useEffect(() => {
		if (status === "authenticated") {
			router.replace(callbackUrl);
		}
	}, [callbackUrl, router, status]);

	if (status === "loading" || status === "authenticated") return null;

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setErrorMessage(null);

		const form = new FormData(e.currentTarget);
		const email = String(form.get("email") ?? "").trim();
		const password = String(form.get("password") ?? "");

		if (!email || !password) {
			setErrorMessage("Merci de renseigner votre email et votre mot de passe.");
			setLoading(false);
			return;
		}

		const result = await signIn("credentials", {
			redirect: false,
			email,
			password,
			callbackUrl,
		});

		if (result?.error) {
			setErrorMessage(result.error || "Connexion impossible");
			setLoading(false);
			return;
		}

		if (result?.url) {
			router.replace(result.url);
		}
	};

	return (
		<PageContainer>
			<div className="p-8 flex flex-col items-center gap-4 border mt-12 rounded-2xl max-w-lg mx-auto">
				<PageTitle title="Connexion" />
				<form onSubmit={handleSubmit} className="w-full space-y-3">
					<input
						name="email"
						type="email"
						placeholder="Email"
						className="input border border-gray-200 p-2 rounded-md w-full"
						required
					/>
					<input
						name="password"
						type="password"
						placeholder="Mot de passe"
						className="input border border-gray-200 p-2 rounded-md w-full"
						required
					/>
					{errorMessage && (
						<p className="text-sm text-red-500">{errorMessage}</p>
					)}
					<Button disabled={loading} className="bg-gray-400 w-full">
						{loading ? "Connexion..." : "Se connecter"}
					</Button>
				</form>
				<div className="flex flex-col sm:flex-row justify-center items-center gap-3 w-full">
					<Button
						onClick={() => signIn("github", { callbackUrl })}
						className="">
						<Github />
						Se connecter avec GitHub
					</Button>
					<Button
						onClick={() => signIn("google", { callbackUrl })}
						className="bg-white text-black border">
						<Image src="/img/google.png" width={20} height={20} alt="google" />
						Se connecter avec Google
					</Button>
				</div>
			</div>
		</PageContainer>
	);
}
