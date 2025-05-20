import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import JobTracker from "./content";

export default async function Dashboard() {
	const supabase = await createClient();

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		redirect("/login");
	}

	return (
		<JobTracker>
			<h1 className="text-xl font-bold break-words max-w-[95lvw] pr-4">
				Hello, {user.email}!
			</h1>
		</JobTracker>
	);
}
