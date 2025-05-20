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
import type { Job, Column } from "@/lib/types";
import UserNav from "@/components/user-nav";

export default function JobTracker({ children }: { children?: React.ReactNode }) {
	const [jobs, setJobs] = useState<Job[]>([
		{
			id: "1",
			company: "Tech Solutions Inc.",
			position: "Frontend Developer",
			date: "2023-03-01",
			notes: "Applied via company website",
			status: "no-response",
		},
		{
			id: "2",
			company: "Digital Innovations",
			position: "UX Designer",
			date: "2023-03-05",
			notes: "Referred by John",
			status: "interview",
		},
		{
			id: "3",
			company: "Global Systems",
			position: "Full Stack Developer",
			date: "2023-02-20",
			notes: "Phone screen scheduled",
			status: "interview",
		},
		{
			id: "4",
			company: "Creative Labs",
			position: "Product Manager",
			date: "2023-02-15",
			notes: "Rejected after final round",
			status: "denied",
		},
		{
			id: "5",
			company: "Future Tech",
			position: "Software Engineer",
			date: "2023-03-10",
			notes: "Offer received, negotiating salary",
			status: "offered",
		},
	]);

	const [activeId, setActiveId] = useState<string | null>(null);
	const [isChange, setIsChange] = useState<boolean | null>(false);
	const [editingJob, setEditingJob] = useState<Job | null>(null);

	const columns: Column[] = [
		{ id: "no-response", title: "No Response" },
		{ id: "denied", title: "Denied" },
		{ id: "interview", title: "Interview" },
		{ id: "offered", title: "Offered" },
	];

	function handleDragStart(event: DragStartEvent) {
		setIsChange(true);
		setActiveId(event.active.id as string);
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
			setJobs(
				jobs.map((job) =>
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

	const addJob = (newJob: Omit<Job, "id">) => {
		const id = Math.random().toString(36).substring(2, 9);
		setJobs([...jobs, { ...newJob, id }]);
	};

	const updateJob = (updatedJob: Job) => {
		console.log(updatedJob);
		setJobs(jobs.map((job) => (job.id === updatedJob.id ? updatedJob : job)));
	};

	const handleEditJob = (job: Job) => {
		setEditingJob(job);
	};

	const closeEditModal = () => {
		setEditingJob(null);
	};

	const handleDeleteJob = (id: string) => {
		setJobs(jobs.filter((job) => job.id !== id));
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
						const columnJobs = jobs.filter((job) => job.status === column.id);

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
												job={job}
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
							job={
								jobs.find((job) => job.id === activeId) || {
									id: "",
									company: "",
									position: "",
									date: "",
									notes: "",
									status: "",
								}
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
