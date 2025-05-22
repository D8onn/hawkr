"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import JobTracker from "./content";
import { getAllApplications } from "@/db/queries";

// the Dashboard Server Page
export default async function Dashboard() {
	const supabase = await createClient();

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		redirect("/login");
	}
	// get all the users Applications from the database
	const allApplications = await getAllApplications(user);

	return (
		<JobTracker applications={allApplications}>
			<h1 className="text-xl font-bold break-words max-w-[95lvw] pr-4">
				Hello, {user.email}!
			</h1>
		</JobTracker>
	);
}
