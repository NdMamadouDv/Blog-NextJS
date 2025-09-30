"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
		<form onSubmit={onSubmit} className="space-y-3 max-w-sm">
			<input name="name" placeholder="Nom" className="input" />
			<input name="email" type="email" placeholder="Email" className="input" />
			<input
				name="password"
				type="password"
				placeholder="Mot de passe"
				className="input"
			/>
			<button disabled={loading} className="btn">
				{loading ? "..." : "Créer mon compte"}
			</button>
		</form>
	);
}
