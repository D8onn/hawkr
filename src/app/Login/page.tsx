import { login } from "@/app/Login/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import Link from "next/link";
import { FormMessage, Message } from "@/components/form-message";
import UserNav from "@/components/user-nav";

export default async function Login(props: { searchParams: Promise<Message> }) {
	const searchParams = await props.searchParams;
	return (
		<div className="flex flex-col mx-auto gap-20 max-w-[95lvw] p-4">
			<UserNav signedIn={false} />
			<form className="flex-1 flex flex-col min-w-64 px-4">
				<h1 className="text-2xl font-medium">Login</h1>
				<p className="text-sm text-foreground">
					{"Don't have an account? "}
					<Link
						className="text-foreground font-medium underline"
						href="/SignUp"
					>
						Sign up
					</Link>
				</p>
				<div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
					<Label htmlFor="email">Email</Label>
					<Input name="email" placeholder="you@example.com" required />
					<div className="flex justify-between items-center">
						<Label htmlFor="password">Password</Label>
						<Link
							className="text-xs text-foreground underline"
							href="/forgot-password"
						>
							Forgot Password?
						</Link>
					</div>
					<Input
						type="password"
						name="password"
						placeholder="Your password"
						required
					/>
					<SubmitButton
						className="cursor-pointer"
						pendingText="Signing In..."
						formAction={login}
					>
						Sign in
					</SubmitButton>
					<FormMessage message={searchParams} />
				</div>
			</form>
		</div>
	);
}
