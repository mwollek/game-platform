"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type UpdateProfileState = { error?: string; ok?: boolean } | undefined;

export async function updateDisplayName(
	_prevState: UpdateProfileState,
	formData: FormData
): Promise<UpdateProfileState> {
	const session = await auth();
	if (!session?.user?.id) {
		return { error: "You must be signed in." };
	}

	const raw = String(formData.get("name") ?? "").trim();
	if (raw.length > 64) {
		return { error: "Display name must be at most 64 characters." };
	}

	await prisma.user.update({
		where: { id: session.user.id },
		data: { name: raw.length > 0 ? raw : null },
	});

	revalidatePath("/account");
	return { ok: true };
}
