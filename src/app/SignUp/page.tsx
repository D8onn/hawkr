import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import Link from "next/link";
import { FormMessage, Message } from "@/components/form-message";
import UserNav from "@/components/user-nav";
import { signup } from "@/app/SignUp/actions";

export default async function SignUp(props: { searchParams: Promise<Message> }) {
	const searchParams = await props.searchParams;

	return (
		<div className="flex flex-col mx-auto gap-20 max-w-[95lvw] p-4">
			<UserNav signedIn={false} />
			<form className="flex-1 flex flex-col min-w-64 px-4">
				<h1 className="text-2xl font-medium">Sign Up</h1>
				<p className="text-sm text-foreground">
					{"Have an account? "}
					<Link className="text-foreground font-medium underline" href="/Login">
						Login
					</Link>
				</p>
				<div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
					<Label htmlFor="email">Email</Label>
					<Input name="email" placeholder="you@example.com" required />
					<Label htmlFor="password">Password</Label>
					<Input
						type="password"
						name="password"
						placeholder="Your password"
						required
					/>
					<SubmitButton pendingText="Signing Up..." formAction={signup}>
						Sign Up
					</SubmitButton>
					<FormMessage message={searchParams} />
				</div>
			</form>
		</div>
	);
}
