"use client";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LoadingScreen from "./loading-screen";
import { useState } from "react";

export default function UserNav({
	children,
	signedIn = false,
	dashboard = false,
}: {
	children?: React.ReactNode;
	signedIn?: boolean;
	dashboard?: boolean;
}) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	return (
		<div className="mb-8 flex items-center justify-between flex-wrap gap-4">
			{/* Loading Screen */}
			{isLoading && <LoadingScreen />}
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
						<Button
							asChild
							size="default"
							variant={"outline"}
							onClick={() => setIsLoading(true)}
						>
							<Link href="/Dashboard">Dashboard</Link>
						</Button>
					</div>
				)}

				{!signedIn && (
					<div className="flex gap-4">
						<Button asChild size="sm" variant={"outline"}>
							<Link href="/Login">Sign in</Link>
						</Button>
						<Button asChild size="sm" variant={"default"}>
							<Link href="/SignUp">Sign up</Link>
						</Button>
					</div>
				)}
				{signedIn && (
					<form className="flex" action="/auth/signout" method="post">
						<Button
							className="cursor-pointer"
							size="default"
							type="submit"
							onClick={() => setIsLoading(true)}
							variant={"outline"}
						>
							Sign Out
						</Button>
					</form>
				)}
			</div>
		</div>
	);
}
