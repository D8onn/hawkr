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
import type { Application } from "@/lib/types";

interface AddJobModalProps {
	onAddJob: (job: Application) => void;
}

export function AddJobModal({ onAddJob }: AddJobModalProps) {
	const [open, setOpen] = useState(false);

	const handleSubmit = (job: Application) => {
		onAddJob(job);
		setOpen(false);
	};

	const handleCancel = () => {
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="flex items-center gap-2 cursor-pointer">
					<PlusIcon className="h-4 w-4" />
					Add Application
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Add New Application</DialogTitle>
				</DialogHeader>
				<AddJobForm onSubmit={handleSubmit} onCancel={handleCancel} />
			</DialogContent>
		</Dialog>
	);
}
