import { users, applications } from "@/db/schema";
import { eq } from "drizzle-orm";
import { User } from "@supabase/auth-js";
import { Application } from "@/lib/types";
import { getDB } from "@/utils/utils";

// Function to get all applications for a user from the database
// This function is used to fetch all the applications for a user from the database
export async function getAllApplications(user: User | null): Promise<Application[]> {
	// check if the connection string is set
	if (!process.env.DATABASE_URL) {
		throw new Error("DATABASE_URL environment variable is not set");
	}
	const connectionString = process.env.DATABASE_URL;

	const db = getDB(connectionString);
	// check if the user is authenticated and has an id
	if (!user) {
		throw new Error("User is not authenticated");
	}
	// get all the applications for the user
	const allApplications = await db
		.select()
		.from(applications)
		.where(eq(applications.user_id, user.id));

	return allApplications;
}
