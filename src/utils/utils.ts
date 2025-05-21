import { Application } from "@/lib/types";
import { drizzle } from "drizzle-orm/postgres-js";
import { redirect } from "next/navigation";
import postgres from "postgres";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
	type: "error" | "success",
	path: string,
	message: string
) {
	return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

/**
 * Creates a database connection using the provided connection string.
 * @param {string} connectionString - The connection string for the database.
 * @returns {object} The database connection object.
 * @throws Will throw an error if the connection string is not provided.
 */
export function getDB(connectionString: string) {
	const client = postgres(connectionString, { prepare: false });
	return drizzle(client);
}

/**
 *
 * @param app - The application object to validate.
 * @returns {boolean} - Returns true if the application is valid.
 * @throws Will throw an error if any of the required fields are missing.
 */
export function validateApplication(app: Application) {
	if (!app.company) {
		throw new Error("Company name is required");
	}
	if (!app.position) {
		throw new Error("Position name is required");
	}
	if (!app.status) {
		throw new Error("Status is required");
	}
	return true;
}
