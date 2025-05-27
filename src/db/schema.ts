import { pgTable, serial, text, varchar, uuid, date } from "drizzle-orm/pg-core";
import { pgEnum } from "drizzle-orm/pg-core";

export const Status = pgEnum("Status", ["no-response", "interview", "denied", "offered"]);

export const users = pgTable("auth.users", {
	id: uuid("id").primaryKey(),
	email: varchar("email"),
});

export const applications = pgTable("Jobs", {
	id: serial("id").primaryKey(),
	user_id: uuid("user_id").notNull(),
	company: text("company").notNull(),
	position: text("position").notNull(),
	date: date("date"),
	notes: text("notes"),
	status: Status("status").default("no-response").notNull(),
	application_email: text("job_email").notNull(),
	application_password: text("job_password").notNull(),
	application_link: text("job_link").notNull(),
});
