import { useDroppable } from "@dnd-kit/core";
import type { ReactNode } from "react";
import { PlusCircle } from "lucide-react";

interface JobColumnProps {
	id: string;
	title: string;
	count: number;
	children: ReactNode;
}

export function JobColumn({ id, title, count, children }: JobColumnProps) {
	const { setNodeRef, isOver } = useDroppable({
		id,
	});

	return (
		<div
			ref={setNodeRef}
			className={`flex h-full min-h-[500px] flex-col rounded-lg border bg-card p-4 transition-colors ${
				isOver ? "ring-2 ring-primary bg-primary/10" : ""
			}`}
		>
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-xl font-semibold">{title}</h2>
				<span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary/10 px-2 text-sm font-medium text-primary">
					{count}
				</span>
			</div>
			<div className="flex flex-1 flex-col gap-3 overflow-y-auto">
				{children}
				{isOver && (
					<div className="bg-background/0 flex-col flex flex-1 mx-auto justify-center align-middle">
						<div className="bg-background/0 rounded-full p-2 shadow-lg">
							<PlusCircle className="h-12 w-12 text-primary animate-pulse" />
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
