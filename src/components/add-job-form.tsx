"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { EyeIcon, EyeOffIcon, CopyIcon } from "lucide-react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Application } from "@/lib/types";
import { toast } from "sonner";
import LoadingScreen from "./loading-screen";

interface AddJobFormProps {
	onSubmit: (job: Application) => void;
	onCancel: () => void;
	initialData?: Application;
	submitLabel?: string;
}

export function AddJobForm({
	onSubmit,
	onCancel,
	initialData,
	submitLabel = "Add Application",
}: AddJobFormProps) {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState<Application>({
		id: 0,
		user_id: "",
		company: "",
		position: "",
		date: new Date().toISOString().split("T")[0],
		notes: "",
		status: "no-response",
		application_email: "",
		application_link: "",
		application_password: "",
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const ref = useRef<HTMLFormElement>(null);

	// If initialData is provided, use it to populate the form
	useEffect(() => {
		if (initialData) {
			setFormData({
				id: initialData.id,
				company: initialData.company,
				position: initialData.position,
				date: initialData.date,
				notes: initialData.notes,
				status: initialData.status,
				application_email: initialData.application_email,
				application_link: initialData.application_link,
				application_password: initialData.application_password,
				user_id: initialData.user_id,
			});
		}
	}, [initialData]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectChange = (value: string) => {
		setFormData((prev) => ({ ...prev, status: value }));
	};

	const handleCopyPassword = async () => {
		if (formData.application_password) {
			try {
				await navigator.clipboard.writeText(formData.application_password);
				toast("Copied", {
					description: "Password has been copied to clipboard",
				});
			} catch (err) {
				toast("Error", {
					description: "Could not copy password to clipboard",
				});
				console.error("Failed to copy password:", err);
			}
		}
	};

	return (
		<form
			action={async () => {
				setIsLoading(true);
				onSubmit(formData);
				// ref.current?.reset();
			}}
			ref={ref}
		>
			<CardContent className="space-y-4">
				{isLoading && <LoadingScreen />}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="company">Company</Label>
						<Input
							id="company"
							name="company"
							value={formData.company}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="position">Position</Label>
						<Input
							id="position"
							name="position"
							value={formData.position}
							onChange={handleChange}
							required
						/>
					</div>
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="date">Application Date</Label>
						<Input
							id="date"
							name="date"
							type="date"
							value={formData.date as string}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="status">Status</Label>
						<Select
							onValueChange={handleSelectChange}
							defaultValue={initialData?.status}
							required
						>
							<SelectTrigger id="status">
								<SelectValue placeholder="Select status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="no-response">No Response</SelectItem>
								<SelectItem value="denied">Denied</SelectItem>
								<SelectItem value="interview">Interview</SelectItem>
								<SelectItem value="offered">Offered</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className="space-y-2">
					<Label htmlFor="application_email">Application Email</Label>
					<Input
						id="application_email"
						name="application_email"
						type="email"
						value={formData.application_email}
						onChange={handleChange}
						placeholder="Email used for this application"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="application_password">Application Password</Label>
					<div className="relative">
						<Input
							id="application_password"
							name="application_password"
							type={showPassword ? "text" : "password"}
							value={formData.application_password}
							onChange={handleChange}
							placeholder="Password for application portal"
							className="pr-20"
						/>
						<div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="h-8 w-8"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? (
									<EyeOffIcon className="h-4 w-4" />
								) : (
									<EyeIcon className="h-4 w-4" />
								)}
							</Button>
							{formData.application_password && (
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="h-8 w-8"
									onClick={handleCopyPassword}
								>
									<CopyIcon className="h-4 w-4" />
								</Button>
							)}
						</div>
					</div>
				</div>
				<div className="space-y-2">
					<Label htmlFor="application_link">Application Link</Label>
					<Input
						id="application_link"
						name="application_link"
						type="url"
						value={formData.application_link}
						onChange={handleChange}
						placeholder="https://company.com/careers/job-id"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="notes">Notes</Label>
					<Textarea
						id="notes"
						name="notes"
						value={formData.notes as string}
						onChange={handleChange}
						rows={3}
					/>
				</div>
			</CardContent>
			<CardFooter className="flex justify-end gap-2 pt-4">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancel
				</Button>
				<Button
					type="submit"
					onClick={() => setIsLoading(true)}
					className="cursor-pointer"
				>
					{submitLabel}
				</Button>
			</CardFooter>
		</form>
	);
}
