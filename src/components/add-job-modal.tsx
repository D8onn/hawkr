"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { AddJobForm } from "@/components/add-job-form";
import type { Job } from "@/lib/types";

interface AddJobModalProps {
	onAddJob: (job: Omit<Job, "id">) => void;
}

export function AddJobModal({ onAddJob }: AddJobModalProps) {
	const [open, setOpen] = useState(false);

	const handleSubmit = (job: Omit<Job, "id">) => {
		onAddJob(job);
		setOpen(false);
	};

	const handleCancel = () => {
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="flex items-center gap-2">
					<PlusIcon className="h-4 w-4" />
					Add Job
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Add New Job Application</DialogTitle>
				</DialogHeader>
				<AddJobForm onSubmit={handleSubmit} onCancel={handleCancel} />
			</DialogContent>
		</Dialog>
	);
}
