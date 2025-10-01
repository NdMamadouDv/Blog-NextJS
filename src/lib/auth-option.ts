import prisma from "@/lib/connect"; // PrismaClient singleton
import { Role } from "@prisma/client";
import { getServerSession, type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	session: { strategy: "jwt" },

	providers: [
		Credentials({
			name: "Email et mot de passe",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Mot de passe", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Email et mot de passe requis");
				}

				const user = await prisma.user.findUnique({ where: { email: credentials.email } });
				if (!user || !user.password) {
					throw new Error("Identifiants invalides");
				}

				const isValid = await compare(credentials.password, user.password);
				if (!isValid) {
					throw new Error("Identifiants invalides");
				}

				return {
					id: user.id,
					email: user.email,
					name: user.name,
					role: user.role,
				};
			},
		}),
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
			if (user && "role" in user) {
				token.role = (user as { role?: Role }).role ?? "USER";
			}

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