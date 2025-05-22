"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
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
	const [formData, setFormData] = useState<Application>({
		id: 0,
		user_id: "",
		company: "",
		position: "",
		date: new Date().toISOString().split("T")[0],
		notes: "",
		status: "no-response",
		job_email: "",
		job_link: "",
		job_password: "",
	});
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
				job_email: initialData.job_email,
				job_link: initialData.job_link,
				job_password: initialData.job_password,
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

	return (
		<form
			action={async () => {
				await onSubmit(formData);
				ref.current?.reset();
			}}
			ref={ref}
		>
			<CardContent className="space-y-4">
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
				<Button type="submit" className="cursor-pointer">
					{submitLabel}
				</Button>
			</CardFooter>
		</form>
	);
}
