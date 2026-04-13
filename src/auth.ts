import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
	trustHost: true,
	session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
	pages: {
		signIn: "/login",
	},
	providers: [
		Credentials({
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			authorize: async (credentials) => {
				const emailRaw = credentials?.email;
				const passwordRaw = credentials?.password;
				const email = typeof emailRaw === "string" ? emailRaw.trim().toLowerCase() : "";
				const password = typeof passwordRaw === "string" ? passwordRaw : "";
				if (!email || !password) {
					return null;
				}

				const user = await prisma.user.findUnique({ where: { email } });
				if (!user) {
					return null;
				}

				const valid = await bcrypt.compare(password, user.passwordHash);
				if (!valid) {
					return null;
				}

				return {
					id: user.id,
					email: user.email,
					name: user.name,
				};
			},
		}),
	],
	callbacks: {
		jwt({ token, user }) {
			if (user) {
				token.sub = user.id;
				token.name = user.name;
			}
			return token;
		},
		session({ session, token }) {
			if (session.user) {
				session.user.id = token.sub ?? "";
				if (token.name !== undefined) {
					session.user.name =
						typeof token.name === "string" || token.name === null
							? token.name
							: session.user.name;
				}
			}
			return session;
		},
	},
});
