"use server";

import { createClient } from "@/utils/supabase/server";

export async function getUser() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// check if the user is authenticated and has an id
	if (!user) {
		throw new Error("User is not authenticated");
	}
	return user;
}
