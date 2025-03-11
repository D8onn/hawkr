"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Job } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, GripVertical, Trash2Icon } from "lucide-react";
import { format } from "date-fns";

interface JobCardProps {
	job: Job;
	onDelete: (id: string) => void;
	isDragging?: boolean;
}

export function JobCard({ job, onDelete, isDragging = false }: JobCardProps) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id: job.id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const formattedDate = job.date ? format(new Date(job.date), "MMM d, yyyy") : "";

	return (
		<Card
			ref={setNodeRef}
			style={style}
			className={`relative ${
				isDragging ? "shadow-lg ring-2 ring-primary bg-background/75" : ""
			}`}
		>
			<div
				{...attributes}
				{...listeners}
				className="absolute left-2 top-3 cursor-grab text-muted-foreground"
			>
				<GripVertical className="h-5 w-5" />
			</div>
			<CardHeader className="pb-2 pl-9 pt-3">
				<div className="flex items-center justify-between">
					<h3 className="font-medium">{job.company}</h3>
					<Button
						variant="ghost"
						size="icon"
						className="h-7 w-7 text-muted-foreground hover:text-destructive"
						onClick={() => onDelete(job.id)}
					>
						<Trash2Icon className="h-4 w-4" />
					</Button>
				</div>
				<p className="text-sm text-muted-foreground">{job.position}</p>
			</CardHeader>
			<CardContent className="pb-2">
				{job.notes && <p className="text-sm">{job.notes}</p>}
			</CardContent>
			<CardFooter className="pt-0">
				<div className="flex items-center text-xs text-muted-foreground">
					<CalendarIcon className="mr-1 h-3 w-3" />
					{formattedDate}
				</div>
			</CardFooter>
		</Card>
	);
}
