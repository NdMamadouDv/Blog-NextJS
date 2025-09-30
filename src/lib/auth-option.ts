import prisma from "@/lib/connect"; // PrismaClient singleton
import { Role } from "@prisma/client";
import { getServerSession, type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	session: { strategy: "jwt" },

	providers: [
		GitHub({
			clientId: process.env.GITHUB_ID!,
			clientSecret: process.env.GITHUB_SECRET!,
		}),
		Google({
			clientId: process.env.GOOGLE_ID!,
			clientSecret: process.env.GOOGLE_SECRET!,
		}),
	],
	pages: {
		signIn: "/login",
	},
	callbacks: {
		async jwt({ token, user }) {
			// Lors de la connexion initiale on récupère le rôle du user renvoyé par l'adapter.
			if (user && "role" in user) {
				token.role = (user as { role?: Role }).role ?? "USER";
			}

			// On relit systématiquement la BD pour refléter les promotions/démotions faites côté Supabase.
			if (typeof token.email === "string") {
				const dbUser = await prisma.user.findUnique({
					where: { email: token.email },
					select: { role: true },
				});
				token.role = dbUser?.role ?? (token.role as Role | undefined) ?? "USER";
			}

			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.role = (token.role as Role | undefined) ?? "USER";
			}
			return session;
		},
	},
};

export const getAuthSession = () => getServerSession(authOptions);
