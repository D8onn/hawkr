"use client";
import { ThemeToggle } from "./theme-toggle";
import Link from "next/link";
import { Button } from "./ui/button";

export default function UserNav({
	children,
	signedIn = false,
	dashboard = false,
}: {
	children?: React.ReactNode;
	signedIn?: boolean;
	dashboard?: boolean;
}) {
	return (
		<div className="mb-8 flex items-center justify-between flex-wrap gap-4">
			<div className="flex items-center gap-4">
				<Link
					href="/"
					className="text-3xl font-bold text-center py-2 cursor-pointer"
				>
					Hawkr
				</Link>
				<ThemeToggle />
			</div>

			<div className="flex items-center gap-4 flex-wrap">
				{children}
				{signedIn && !dashboard && (
					<div className="flex">
						<Button asChild size="default" variant={"outline"}>
							<Link href="/dashboard">Dashboard</Link>
						</Button>
					</div>
				)}

				{!signedIn && (
					<div className="flex gap-4">
						<Button asChild size="sm" variant={"outline"}>
							<Link href="/login">Sign in</Link>
						</Button>
						<Button asChild size="sm" variant={"default"}>
							<Link href="/sign-up">Sign up</Link>
						</Button>
					</div>
				)}
				{signedIn && (
					<div className="flex">
						<Button asChild size="default" variant={"outline"}>
							<Link href="/signout">Sign Out</Link>
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
