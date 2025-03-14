"use client"

import { useState } from "react"
import { DndContext, type DragEndEvent, closestCenter, DragOverlay, type DragStartEvent } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { JobColumn } from "@/components/job-column"
import { JobCard } from "@/components/job-card"
import { AddJobModal } from "@/components/add-job-modal"
import type { Job, Column } from "@/lib/types"
import { ThemeToggle } from "@/components/theme-toggle"

export default function JobTracker() {
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
  ])

  const [activeId, setActiveId] = useState<string | null>(null)
  const [isChange, setIsChange] = useState<boolean | null>(false)

  const columns: Column[] = [
    { id: "no-response", title: "No Response" },
    { id: "denied", title: "Denied" },
    { id: "interview", title: "Interview" },
    { id: "offered", title: "Offered" },
  ]

  function handleDragStart(event: DragStartEvent) {
    setIsChange(true)
    setActiveId(event.active.id as string)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over) {
      setIsChange(false)
      setActiveId(null)
      return
    }

    const overId = over.id as string

    // If dropping on a column
    const targetColumn = columns.find((col) => col.id === overId)
    if (targetColumn) {
      setJobs(jobs.map((job) => (job.id === activeId ? { ...job, status: targetColumn.id } : job)))
    }
    setIsChange(false)
    setActiveId(null)
  }

  function handleDragCancel() {
    setIsChange(false)
    setActiveId(null)
  }

  const addJob = (newJob: Omit<Job, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setJobs([...jobs, { ...newJob, id }])
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Job Application Tracker</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AddJobModal onAddJob={addJob} />
        </div>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {columns.map((column) => {
            const columnJobs = jobs.filter((job) => job.status === column.id)

            return (
              <SortableContext
                key={column.id}
                items={columnJobs.map((job) => job.id)}
                strategy={verticalListSortingStrategy}
              >
                <JobColumn id={column.id} title={column.title} count={columnJobs.length}>
                  {!isChange &&
                    columnJobs.map((job) => (
                      <JobCard key={job.id} job={job} onDelete={(id) => setJobs(jobs.filter((job) => job.id !== id))} />
                    ))}
                </JobColumn>
              </SortableContext>
            )
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
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

