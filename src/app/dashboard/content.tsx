"use client";

import { useState } from "react";
import {
	DndContext,
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
import { insertApplication, updateApplication, deleteApplication } from "./actions";

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

	function handleDragCancel() {
		setIsChange(false);
		setActiveId(null);
	}

	const handleEditJob = (app: Application) => {
		// opens up the edit modal
		// and sets the app to be edited
		setEditingJob(app);
	};

	const closeEditModal = () => {
		setEditingJob(null);
	};

	// function to delete a app
	const handleDeleteJob = (id: string) => {
		// I will need to use a server action to delete the app from the database
		setApps(apps.filter((app) => app.id != parseInt(id)));
	};

	return (
		<div className="container mx-auto p-4">
			<UserNav signedIn dashboard>
				{children}
				<AddJobModal
					onAddJob={async (app) => {
						const newApp = await insertApplication(app);
						setApps((prev) => [...prev, newApp as Application]);
					}}
				/>
			</UserNav>

			<DndContext
				collisionDetection={closestCenter}
				// the async server action to update on drag
				onDragEnd={async (event) => {
					const over = event.over;

					if (!over) {
						setIsChange(false);
						setActiveId(null);
						return;
					}

					const overId = over.id as string;

					const currApps = apps.map((app) =>
						app.id === activeId ? { ...app, status: overId } : app
					);

					setApps(currApps);

					// async call to update the app in the database, but don't wait for it
					// so the UI updates immediately
					updateApplication(
						currApps.find((app) => app.id === activeId) as Application
					);

					setIsChange(false);
					setActiveId(null);
				}}
				onDragStart={handleDragStart}
				onDragCancel={handleDragCancel}
			>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
					{columns.map((column) => {
						const columnJobs = apps.filter((app) => app.status === column.id);

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
										columnJobs.map((app) => (
											<JobCard
												key={app.id}
												app={app}
												onDelete={async (id) => {
													// I will need to use a server action to delete the app in the database
													const currApp = apps.find(
														(app) => app.id == parseInt(id)
													);
													deleteApplication(
														currApp as Application
													);
													handleDeleteJob(id);
												}}
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
							app={apps.find((app) => app.id === activeId) as Application}
							onDelete={() => {}}
							onEdit={() => {}}
							isDragging
						/>
					) : null}
				</DragOverlay>
			</DndContext>
			<EditJobModal
				app={editingJob}
				isOpen={!!editingJob}
				onClose={closeEditModal}
				onUpdate={async (updatedJob) => {
					// I will need to use a server action to update the app in the database
					setApps((prev) =>
						prev.map((app) => (app.id === updatedJob.id ? updatedJob : app))
					);

					updateApplication(updatedJob);
				}}
			/>
		</div>
	);
}
