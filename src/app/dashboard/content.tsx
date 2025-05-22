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
import { set } from "date-fns";

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
		console.log("drag start", event.active.id);
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
			<UserNav signedIn dashboard>
				{children}
				<AddJobModal
					onAddJob={async (job) => {
						const newJob = await addJob(job);
						setApps((prev) => [...prev, newJob as Application]);
					}}
				/>
			</UserNav>

			<DndContext
				collisionDetection={closestCenter}
				// the async server action to update on drag
				onDragEnd={async (event) => {
					const { active, over } = event;

					if (!over) {
						setIsChange(false);
						setActiveId(null);
						return;
					}

					const overId = over.id as string;

					const currApps = apps.map((job) =>
						job.id === activeId ? { ...job, status: overId } : job
					);

					setApps(currApps);

					// async call to update the app in the database, but don't wait for it
					// so the UI updates immediately
					updateJob(currApps.find((job) => job.id === activeId) as Application);

					setIsChange(false);
					setActiveId(null);
				}}
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
							app={apps.find((job) => job.id === activeId) as Application}
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
				onUpdate={async (updatedJob) => {
					// I will need to use a server action to update the job in the database
					setApps((prev) =>
						prev.map((job) => (job.id === updatedJob.id ? updatedJob : job))
					);

					updateJob(updatedJob);
				}}
			/>
		</div>
	);
}
