"use client"

import { useState, useCallback } from "react"
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
  pointerWithin,
  rectIntersection,
  type CollisionDetection,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { KanbanColumn } from "./KanbanColumn"
import { TaskCard } from "./TaskCard"
import { useStore } from "@/store"
import type { Task, TaskStatus } from "@/types"

interface KanbanBoardProps {
  onTaskClick: (task: Task) => void
  onAddTask: (status: TaskStatus) => void
}

const statuses: TaskStatus[] = ["backlog", "todo", "in_progress", "review", "done"]

// Custom collision detection that prioritizes columns
const customCollisionDetection: CollisionDetection = (args) => {
  // First check for pointer within droppable areas
  const pointerCollisions = pointerWithin(args)
  
  if (pointerCollisions.length > 0) {
    // Prioritize column droppables (status names)
    const columnCollision = pointerCollisions.find(c => 
      statuses.includes(c.id as TaskStatus)
    )
    if (columnCollision) {
      return [columnCollision]
    }
    return pointerCollisions
  }
  
  // Fallback to rect intersection
  return rectIntersection(args)
}

export function KanbanBoard({ onTaskClick, onAddTask }: KanbanBoardProps) {
  const { tasksByStatus, moveTask, socket, lockedTasks } = useStore()
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [activeOverColumn, setActiveOverColumn] = useState<TaskStatus | null>(null)
  const [recentlyMovedTasks, setRecentlyMovedTasks] = useState<Set<string>>(new Set())

  const sensors = useSensors(
    useSensor(PointerSensor, { 
      activationConstraint: { 
        distance: 5,
      } 
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const taskId = event.active.id as string
    const task = Object.values(tasksByStatus).flat().find((t) => t._id === taskId)
    if (task) {
      setActiveTask(task)
      socket?.emit("start_drag", { task_id: taskId })
    }
  }, [tasksByStatus, socket])

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event
    if (over && statuses.includes(over.id as TaskStatus)) {
      setActiveOverColumn(over.id as TaskStatus)
    } else {
      setActiveOverColumn(null)
    }
  }, [])

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)
    setActiveOverColumn(null)

    if (!over) {
      socket?.emit("cancel_drag", { task_id: active.id })
      return
    }

    const taskId = active.id as string
    let newStatus = over.id as TaskStatus

    // If dropped on a task, find which column that task is in
    if (!statuses.includes(newStatus)) {
      const targetTask = Object.values(tasksByStatus).flat().find((t) => t._id === over.id)
      if (targetTask) {
        newStatus = targetTask.status
      } else {
        socket?.emit("cancel_drag", { task_id: active.id })
        return
      }
    }

    const task = Object.values(tasksByStatus).flat().find((t) => t._id === taskId)
    if (task && task.status !== newStatus) {
      try {
        // Mark task as recently moved for animation
        setRecentlyMovedTasks(prev => new Set(prev).add(taskId))
        
        await moveTask(taskId, newStatus)
        
        // Remove from recently moved after animation completes
        setTimeout(() => {
          setRecentlyMovedTasks(prev => {
            const next = new Set(prev)
            next.delete(taskId)
            return next
          })
        }, 600)
      } catch (error) {
        console.error("Failed to move task:", error)
      }
    }

    socket?.emit("end_drag", { task_id: taskId })
  }, [tasksByStatus, moveTask, socket])

  const handleDragCancel = useCallback(() => {
    if (activeTask) {
      socket?.emit("cancel_drag", { task_id: activeTask._id })
    }
    setActiveTask(null)
    setActiveOverColumn(null)
  }, [activeTask, socket])

  const lockedTasksMap = Object.entries(lockedTasks).reduce((acc, [taskId, user]) => {
    acc[taskId] = { name: user.name }
    return acc
  }, {} as Record<string, { name: string }>)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 h-full">
        {statuses.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasksByStatus[status] || []}
            onTaskClick={onTaskClick}
            onAddTask={() => onAddTask(status)}
            lockedTasks={lockedTasksMap}
            isOver={activeOverColumn === status}
            isDragging={!!activeTask}
            recentlyMovedTasks={recentlyMovedTasks}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{
        duration: 250,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
      }}>
        {activeTask && (
          <TaskCard 
            task={activeTask} 
            isDragOverlay 
            targetStatus={activeOverColumn}
          />
        )}
      </DragOverlay>
    </DndContext>
  )
}
