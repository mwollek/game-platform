import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

import { ProfileForm } from "./profile-form";

export default async function AccountPage() {
	const session = await auth();
	if (!session?.user?.id) {
		redirect("/login?callbackUrl=/account");
	}

	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: { email: true, name: true, updatedAt: true },
	});

	if (!user) {
		return (
			<main className="mx-auto max-w-lg px-4 py-10">
				<p className="text-sm text-slate-600">
					We could not load your profile. Try signing in again.
				</p>
			</main>
		);
	}

	return (
		<main className="mx-auto max-w-lg px-4 py-10">
			<Card className="border-violet-100 bg-white/90 shadow-[0_20px_40px_rgba(15,23,42,0.12)] backdrop-blur-md">
				<CardHeader className="space-y-2">
					<CardTitle className="text-xl text-slate-900">Your account</CardTitle>
					<CardDescription className="text-slate-600">
						Signed in as{" "}
						<span className="font-medium text-slate-800">{user.email}</span>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ProfileForm key={user.updatedAt.toISOString()} initialName={user.name ?? ""} />
				</CardContent>
			</Card>
		</main>
	);
}
