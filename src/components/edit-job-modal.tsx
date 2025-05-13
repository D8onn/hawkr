"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddJobForm } from "@/components/add-job-form";
import type { Job } from "@/lib/types";

interface EditJobModalProps {
	job: Job | null;
	isOpen: boolean;
	onClose: () => void;
	onUpdate: (updatedJob: Job) => void;
}

export function EditJobModal({ job, isOpen, onClose, onUpdate }: EditJobModalProps) {
	const handleSubmit = (updatedJob: Omit<Job, "id">) => {
		if (job) {
			onUpdate({ ...updatedJob, id: job.id });
		}
		onClose();
	};

	if (!job) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[600px] top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] fixed">
				<DialogHeader>
					<DialogTitle>Edit Job Application</DialogTitle>
				</DialogHeader>
				<AddJobForm
					initialData={job}
					onSubmit={handleSubmit}
					onCancel={onClose}
					submitLabel="Update Job"
				/>
			</DialogContent>
		</Dialog>
	);
}
