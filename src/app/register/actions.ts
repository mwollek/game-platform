"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { parseRegister } from "@/lib/auth/validation";

export type RegisterState = { error?: string } | undefined;

export async function registerUser(
	_prevState: RegisterState,
	formData: FormData
): Promise<RegisterState> {
	const parsed = parseRegister(formData);
	if ("error" in parsed) {
		return { error: parsed.error };
	}

	const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
	if (existing) {
		return { error: "An account with this email already exists." };
	}

	const passwordHash = await bcrypt.hash(parsed.password, 12);
	await prisma.user.create({
		data: {
			email: parsed.email,
			name: parsed.displayName,
			passwordHash,
		},
	});

	redirect("/login?registered=1");
}
