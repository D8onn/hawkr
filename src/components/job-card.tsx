"use client";

import type React from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Application } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, GripVertical, Trash2Icon } from "lucide-react";
import { format } from "date-fns";

interface JobCardProps {
	app: Application;
	onDelete: (id: string) => void;
	onEdit: (app: Application) => void;
	isDragging?: boolean;
}

export function JobCard({ app, onDelete, onEdit, isDragging = false }: JobCardProps) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id: app.id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const formattedDate = app.date ? format(new Date(app.date), "MMM d, yyyy") : "";

	const handleCardClick = (e: React.MouseEvent) => {
		// Prevent opening edit modal when clicking delete button or drag handle
		if ((e.target as HTMLElement).closest("button")) return;
		if ((e.target as HTMLElement).closest(".drag-handle")) return;

		onEdit(app);
	};

	return (
		<Card
			ref={setNodeRef}
			style={style}
			className={`relative ${
				isDragging
					? "shadow-lg ring-2 ring-primary bg-background/75"
					: "cursor-pointer"
			}`}
			onClick={handleCardClick}
		>
			<div
				{...attributes}
				{...listeners}
				className="absolute left-2 top-3 cursor-grab text-muted-foreground drag-handle"
			>
				<GripVertical className="h-5 w-5" />
			</div>
			<CardHeader className="pb-2 pl-9 pt-3">
				<div className="flex items-center justify-between">
					<h3 className="font-medium">{app.company}</h3>
					<Button
						variant="ghost"
						size="icon"
						className="h-7 w-7 text-muted-foreground hover:text-destructive"
						onClick={(e) => {
							e.stopPropagation();
							onDelete(app.id as string);
						}}
					>
						<Trash2Icon className="h-4 w-4" />
					</Button>
				</div>
				<p className="text-sm text-muted-foreground">{app.position}</p>
			</CardHeader>
			<CardContent className="pb-2">
				{app.notes && <p className="text-sm">{app.notes}</p>}
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
