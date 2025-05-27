"use client";

import type React from "react";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Application } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	CalendarIcon,
	GripVertical,
	Trash2Icon,
	MailIcon,
	LockIcon,
	ExternalLinkIcon,
	EyeIcon,
	EyeOffIcon,
	CopyIcon,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface JobCardProps {
	app: Application;
	onDelete: (id: string) => void;
	onEdit: (app: Application) => void;
	isDragging?: boolean;
}

export function JobCard({ app, onDelete, onEdit, isDragging = false }: JobCardProps) {
	const [showPassword, setShowPassword] = useState(false);
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id: app.id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const timezone = new Date().toString().match(/-([0-9]+)/) || ["0000"];
	var offset = timezone[1];
	offset = "T" + offset.slice(0, 2) + ":" + offset.slice(2, 4);

	const formattedDate = app.date
		? format(new Date(app.date + offset), "MMM d, yyyy")
		: "";

	const handleCardClick = (e: React.MouseEvent) => {
		// Prevent opening edit modal when clicking delete button or drag handle
		if ((e.target as HTMLElement).closest("button")) return;
		if ((e.target as HTMLElement).closest(".drag-handle")) return;

		onEdit(app);
	};

	const handleLinkClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (app.application_link) {
			window.open(app.application_link, "_blank", "noopener,noreferrer");
		}
	};

	const handleCopyPassword = async (e: React.MouseEvent) => {
		e.stopPropagation();
		if (app.application_password) {
			try {
				await navigator.clipboard.writeText(app.application_password);
				toast("Copied", {
					description: "Password has been copied to clipboard",
				});
			} catch (err) {
				toast("Copied", {
					description: "Could not copy password to clipboard",
				});
			}
		}
	};

	const handleCopyEmail = async (e: React.MouseEvent) => {
		e.stopPropagation();
		if (app.application_email) {
			try {
				await navigator.clipboard.writeText(app.application_email);
				toast("Copied", {
					description: "Email has been copied to clipboard",
				});
			} catch (err) {
				toast("Copied", {
					description: "Could not copy email to clipboard",
				});
			}
		}
	};

	const togglePasswordVisibility = (e: React.MouseEvent) => {
		e.stopPropagation();
		setShowPassword(!showPassword);
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
			<CardHeader className="pb-2 pl-8 pt-4">
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
			{(app.notes ||
				app.application_email ||
				app.application_link ||
				app.application_password) && (
				<CardContent className="pb-2 space-y-2 pl-8">
					{app.notes && <p className="text-sm">{app.notes}</p>}

					{/* Application Details */}
					<div className="space-y-1">
						{app.application_email && (
							<div className="flex items-center justify-between text-xs text-muted-foreground">
								<div className="flex items-center min-w-0 flex-1">
									<MailIcon className="mr-1 h-3 w-3 flex-shrink-0" />
									<span className="truncate">
										{app.application_email}
									</span>
								</div>
								<Button
									variant="ghost"
									size="icon"
									className="h-7 w-7 ml-1 flex-shrink-0"
									onClick={handleCopyEmail}
								>
									<CopyIcon className="h-4 w-4" />
								</Button>
							</div>
						)}
						{app.application_password && (
							<div className="flex items-center justify-between text-xs text-muted-foreground">
								<div className="flex items-center min-w-0 flex-1">
									<LockIcon className="mr-1 h-3 w-3 flex-shrink-0" />
									<span className="truncate font-mono">
										{showPassword
											? app.application_password
											: "••••••••"}
									</span>
								</div>
								<div className="flex gap-1 ml-1 flex-shrink-0">
									<Button
										variant="ghost"
										size="icon"
										className="h-7 w-7"
										onClick={togglePasswordVisibility}
									>
										{showPassword ? (
											<EyeOffIcon className="h-3 w-3" />
										) : (
											<EyeIcon className="h-3 w-3" />
										)}
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className="h-7 w-7"
										onClick={handleCopyPassword}
									>
										<CopyIcon className="h-3 w-3" />
									</Button>
								</div>
							</div>
						)}
						{app.application_link && (
							<div className="flex items-center text-xs text-muted-foreground">
								<Button
									variant="ghost"
									size="sm"
									className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
									onClick={handleLinkClick}
								>
									<ExternalLinkIcon className="mr-1 h-3 w-3" />
									View Application
								</Button>
							</div>
						)}
					</div>
				</CardContent>
			)}
			<CardFooter className="pt-0">
				<div className="flex items-center text-xs text-muted-foreground">
					<CalendarIcon className="mr-1 h-3 w-3" />
					{formattedDate}
				</div>
			</CardFooter>
		</Card>
	);
}
