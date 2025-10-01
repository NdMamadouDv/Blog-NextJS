"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/page-container";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/page-title";

export default function RegisterPage() {
	const [loading, setLoading] = useState(false);
	const r = useRouter();

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		const form = new FormData(e.currentTarget);
		const res = await fetch("/api/register", {
			method: "POST",
			body: JSON.stringify({
				name: form.get("name"),
				email: form.get("email"),
				password: form.get("password"),
			}),
			headers: { "Content-Type": "application/json" },
		});
		setLoading(false);
		if (res.ok) r.push("/login"); // ou auto signIn('credentials', ...)
	}

	return (
		<PageContainer>
			<form
				onSubmit={onSubmit}
				className="space-y-3 max-w-sm mx-auto border p-8 rounded-2xl mt-10 grid grid-cols-2 gap-4">
				<div className="col-span-2">
					<PageTitle title="S'inscrire" />
					<p>Votre nom, votre email et un mot de passe</p>
				</div>

				<label htmlFor="">Votre nom</label>
				<input name="name" placeholder="Nom" className="input" />
				<label htmlFor=""> Votre email</label>
				<input
					name="email"
					type="email"
					placeholder="Email"
					className="input"
				/>
				<label htmlFor=""> Votre mot de passe</label>
				<input
					name="password"
					type="password"
					placeholder="Mot de passe"
					className="input"
				/>
				<Button
					disabled={loading}
					className="bg-gray-200 col-span-2 text-black mt-1">
					{loading ? "Connexion..." : "Se connecter"}
				</Button>
			</form>
		</PageContainer>
	);
}
