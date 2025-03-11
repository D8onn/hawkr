import { useDroppable } from "@dnd-kit/core"
import type { ReactNode } from "react"

interface JobColumnProps {
  id: string
  title: string
  count: number
  children: ReactNode
}

export function JobColumn({ id, title, count, children }: JobColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`flex h-full min-h-[500px] flex-col rounded-lg border bg-card p-4 ${
        isOver ? "ring-2 ring-primary" : ""
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary/10 px-2 text-sm font-medium text-primary">
          {count}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto">{children}</div>
    </div>
  )
}

