"use server";
import { Button } from "@/components/ui/button";
import UserNav from "@/components/user-nav";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<div className="container mx-auto p-4">
			<UserNav signedIn={!!user}></UserNav>
			<div className="flex flex-col items-center text-center justify-center h-screen">
				<h1 className="text-4xl font-bold mb-4">Welcome to Hawkr</h1>
				<p className="text-lg text-gray-600 mb-8">
					Your one-stop solution for all your application tracking needs.
					<br />
					Stay organized and never miss an opportunity again!
					<br />
				</p>
			</div>
		</div>
	);
}
