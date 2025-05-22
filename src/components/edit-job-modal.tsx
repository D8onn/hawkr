"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddJobForm } from "@/components/add-job-form";
import type { Application } from "@/lib/types";

interface EditJobModalProps {
	app: Application | null;
	isOpen: boolean;
	onClose: () => void;
	onUpdate: (updatedJob: Application) => void;
}

export function EditJobModal({ app, isOpen, onClose, onUpdate }: EditJobModalProps) {
	const handleSubmit = (updatedJob: Application) => {
		if (app) {
			onUpdate(updatedJob);
		}
		onClose();
	};

	if (!app) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[600px] top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] fixed">
				<DialogHeader>
					<DialogTitle>Edit Application</DialogTitle>
				</DialogHeader>
				<AddJobForm
					initialData={app}
					onSubmit={handleSubmit}
					onCancel={onClose}
					submitLabel="Update Application"
				/>
			</DialogContent>
		</Dialog>
	);
}
