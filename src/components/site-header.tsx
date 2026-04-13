import Link from "next/link";

import { auth } from "@/auth";
import { signOutFromApp } from "@/lib/auth/sign-out";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function greetingLabel(user: { name?: string | null; email?: string | null }): string {
	const fromName = user.name?.trim();
	if (fromName) {
		return fromName;
	}
	const local = user.email?.split("@")[0]?.trim();
	if (local) {
		return local;
	}
	return "there";
}

export async function SiteHeader() {
	const session = await auth();

	return (
		<header className="sticky top-0 z-20 border-b border-violet-100/80 bg-white/80 backdrop-blur-md">
			<div className="mx-auto flex h-12 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
				<Link
					href="/"
					className="text-sm font-semibold tracking-tight text-slate-800 hover:text-violet-700"
				>
					Game Platform
				</Link>
				<nav className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3">
					{session?.user ? (
						<>
							<span
								className="mr-1 max-w-[10rem] truncate text-sm text-slate-600 sm:max-w-[14rem]"
								title={session.user.email ?? undefined}
							>
								Hi,{" "}
								<span className="font-medium text-slate-800">
									{greetingLabel(session.user)}
								</span>
							</span>
							<Link
								href="/account"
								className="shrink-0 text-sm text-slate-600 underline-offset-4 hover:text-violet-700 hover:underline"
							>
								Account
							</Link>
							<form action={signOutFromApp}>
								<Button type="submit" variant="outline" size="sm">
									Sign out
								</Button>
							</form>
						</>
					) : (
						<>
							<Link
								href="/login"
								className="text-sm text-slate-600 underline-offset-4 hover:text-violet-700 hover:underline"
							>
								Sign in
							</Link>
							<Link
								href="/register"
								className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
							>
								Register
							</Link>
						</>
					)}
				</nav>
			</div>
		</header>
	);
}
