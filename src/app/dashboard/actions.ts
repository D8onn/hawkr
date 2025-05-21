"use server";
import { Application } from "@/lib/types";
import { getDB, validateApplication } from "@/utils/utils";
import { applications } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getUser } from "@/db/utils";

// will be the server actions for handling the insert/update/delete of the applications
async function insertApplication(app: Application) {
	try {
		validateApplication(app);
		// check if the connection string is set
		if (!process.env.DATABASE_URL) {
			throw new Error("DATABASE_URL environment variable is not set");
		}
		const connectionString = process.env.DATABASE_URL;

		const user = await getUser();

		const db = getDB(connectionString);

		const data = await db
			.insert(applications)
			.values({
				user_id: user.id,
				company: app.company,
				position: app.position,
				status: app.status as "no-response" | "interview" | "denied" | "offered",
				date: app.date,
				notes: app.notes,
			})
			.returning();
		return data;
	} catch (error) {
		console.error("Validation error:", error);
	}
}

export async function addJob(app: Application) {
	// I will need to use a server action to insert the job into the database
	await insertApplication(app);
	revalidatePath("/dashboard");
}

// will be the server actions for handling the insert/update/delete of the applications
async function updateApplication(app: Application) {
	try {
		validateApplication(app);
		// check if the connection string is set
		if (!process.env.DATABASE_URL) {
			throw new Error("DATABASE_URL environment variable is not set");
		}
		const connectionString = process.env.DATABASE_URL;

		const user = await getUser();

		const db = getDB(connectionString);

		const data = await db
			.update(applications)
			.set({
				company: app.company,
				position: app.position,
				status: app.status as "no-response" | "interview" | "denied" | "offered",
				date: app.date,
				notes: app.notes,
			})
			.where(
				and(
					eq(applications.id, app.id as number),
					eq(applications.user_id, user.id)
				)
			)
			.returning();

		return data;
	} catch (error) {
		console.error("Validation error:", error);
	}
}

export async function updateJob(app: Application) {
	// I will need to use a server action to update the job in the database
	await updateApplication(app);
	revalidatePath("/dashboard");
}
