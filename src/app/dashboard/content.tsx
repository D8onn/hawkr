"use client";

import { useState } from "react";
import {
	DndContext,
	type DragEndEvent,
	closestCenter,
	DragOverlay,
	type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { JobColumn } from "@/components/job-column";
import { JobCard } from "@/components/job-card";
import { AddJobModal } from "@/components/add-job-modal";
import { EditJobModal } from "@/components/edit-job-modal";
import type { Application, Column } from "@/lib/types";
import UserNav from "@/components/user-nav";
import { addJob, updateJob } from "./actions";

export default function JobTracker({
	children,
	applications,
}: {
	children?: React.ReactNode;
	applications: Application[] | null;
}) {
	// applications are passed from the server
	// and are used to populate the initial state
	const [apps, setApps] = useState<Application[]>(applications || []);
	const [activeId, setActiveId] = useState<number | null>(null);
	const [isChange, setIsChange] = useState<boolean | null>(false);
	const [editingJob, setEditingJob] = useState<Application | null>(null);

	// Define the columns for the application statuses and their titles
	const columns: Column[] = [
		{ id: "no-response", title: "No Response" },
		{ id: "denied", title: "Denied" },
		{ id: "interview", title: "Interview" },
		{ id: "offered", title: "Offered" },
	];

	function handleDragStart(event: DragStartEvent) {
		setIsChange(true);
		setActiveId(event.active.id as number);
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (!over) {
			setIsChange(false);
			setActiveId(null);
			return;
		}

		const overId = over.id as string;

		// If dropping on a column
		const targetColumn = columns.find((col) => col.id === overId);
		if (targetColumn) {
			// will need to use a server action to update the job in the database
			setApps(
				apps.map((job) =>
					job.id === activeId ? { ...job, status: targetColumn.id } : job
				)
			);
		}
		setIsChange(false);
		setActiveId(null);
	}

	function handleDragCancel() {
		setIsChange(false);
		setActiveId(null);
	}

	const handleEditJob = (job: Application) => {
		// opens up the edit modal
		// and sets the job to be edited
		setEditingJob(job);
	};

	const closeEditModal = () => {
		setEditingJob(null);
	};

	// function to delete a job
	const handleDeleteJob = (id: string) => {
		// I will need to use a server action to delete the job from the database
		setApps(apps.filter((job) => job.id !== parseInt(id)));
	};

	return (
		<div className="container mx-auto p-4">
			<UserNav signedIn>
				{children}
				<AddJobModal onAddJob={addJob} />
			</UserNav>

			<DndContext
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
				onDragStart={handleDragStart}
				onDragCancel={handleDragCancel}
			>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
					{columns.map((column) => {
						const columnJobs = apps.filter((job) => job.status === column.id);

						return (
							<SortableContext
								key={column.id}
								items={columnJobs}
								strategy={verticalListSortingStrategy}
							>
								<JobColumn
									id={column.id}
									title={column.title}
									count={columnJobs.length}
								>
									{!isChange &&
										columnJobs.map((job) => (
											<JobCard
												key={job.id}
												app={job}
												onDelete={handleDeleteJob}
												onEdit={handleEditJob}
											/>
										))}
								</JobColumn>
							</SortableContext>
						);
					})}
				</div>

				<DragOverlay>
					{activeId ? (
						<JobCard
							app={
								apps.find((job) => job.id === activeId) ||
								({
									id: "",
									company: "",
									position: "",
									date: "",
									notes: "",
									status: "",
								} as Application)
							}
							onDelete={() => {}}
							onEdit={() => {}}
							isDragging
						/>
					) : null}
				</DragOverlay>
			</DndContext>
			<EditJobModal
				job={editingJob}
				isOpen={!!editingJob}
				onClose={closeEditModal}
				onUpdate={updateJob}
			/>
		</div>
	);
}
