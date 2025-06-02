"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function validateEmail(email: string): Promise<boolean> {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

export async function validatePassword(password: string): Promise<boolean> {
	// Password must be at least 8 characters long,
	// contain at least one uppercase letter,
	// one lowercase letter, one number, and one special character
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
	return passwordRegex.test(password);
}

export async function signup(formData: FormData) {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	if (!email || !password) {
		throw new Error("Email and password are required.");
	}
	if (!(await validateEmail(email))) {
		throw new Error("Invalid email format.");
	}
	if (!(await validatePassword(password))) {
		throw new Error(
			"Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
		);
	}

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (user) {
		console.error("User already signed in:", user);
		redirect("/error");
	}

	const { error, data } = await supabase.auth.signUp({ email, password });
	if (error) {
		redirect("/error");
	}

	console.log("User signed up:", data.user);

	revalidatePath("/auth/EmailCheck", "layout");
	redirect("/auth/EmailCheck");
}
