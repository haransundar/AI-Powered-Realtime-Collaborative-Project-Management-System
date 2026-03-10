"use client"

import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { Task, TaskPriority, TaskStatus } from "@/types"
import { Calendar, Clock, AlertCircle, User, GripVertical } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface TaskCardProps {
  task: Task
  onClick?: () => void
  isLocked?: boolean
  lockedBy?: string
  isDragOverlay?: boolean
  targetStatus?: TaskStatus | null
  isRecentlyMoved?: boolean
}

const priorityConfig: Record<TaskPriority, { bg: string; text: string }> = {
  low: { bg: "bg-slate-100 dark:bg-slate-700", text: "text-slate-700 dark:text-slate-300" },
  medium: { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-700 dark:text-indigo-300" },
  high: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300" },
  critical: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300" },
}

const statusConfig: Record<TaskStatus, { border: string; bg: string }> = {
  backlog: { border: "border-l-slate-400", bg: "bg-slate-50 dark:bg-slate-800/50" },
  todo: { border: "border-l-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
  in_progress: { border: "border-l-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
  review: { border: "border-l-violet-400", bg: "bg-violet-50 dark:bg-violet-900/20" },
  done: { border: "border-l-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
}

export function TaskCard({ task, onClick, isLocked, lockedBy, isDragOverlay, targetStatus, isRecentlyMoved }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task._id, disabled: isLocked, data: { task } })

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined
  const isBlocked = task.blocked_by && task.blocked_by.length > 0
  const displayStatus = isDragOverlay && targetStatus ? targetStatus : task.status
  const config = statusConfig[displayStatus]
  const priorityStyle = priorityConfig[task.priority]

  const CardWrapper = isDragOverlay ? 'div' : motion.div

  return (
    <CardWrapper
      ref={!isDragOverlay ? setNodeRef : undefined}
      style={style}
      {...(!isDragOverlay && {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95 },
        whileHover: { y: -2 },
        transition: { duration: 0.2 }
      })}
    >
      <Card
        className={cn(
          "p-3 mb-2 transition-all duration-200 border-l-4 cursor-pointer",
          config.border,
          isDragOverlay && targetStatus && targetStatus !== task.status && config.bg,
          isRecentlyMoved && "ring-2 ring-offset-2 ring-indigo-400 dark:ring-offset-slate-900",
          isDragging && "opacity-40 shadow-sm",
          isDragOverlay && "shadow-2xl rotate-1 scale-105 cursor-grabbing",
          !isDragging && !isDragOverlay && "hover:shadow-lg hover:border-l-indigo-500",
          isLocked && "opacity-70 cursor-not-allowed",
          isBlocked && "border-l-red-500"
        )}
        onClick={!isDragging ? onClick : undefined}
      >
        <div className="space-y-2.5">
          <div className="flex items-start gap-2">
            <div {...attributes} {...listeners} className={cn("flex-shrink-0 cursor-grab active:cursor-grabbing p-1 -ml-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors", isLocked && "cursor-not-allowed opacity-50")} onClick={(e) => e.stopPropagation()}>
              <GripVertical className="h-4 w-4 text-slate-300 dark:text-slate-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium text-sm text-slate-900 dark:text-slate-100 line-clamp-2">{task.title}</h4>
                <Badge className={cn("shrink-0 text-xs font-medium", priorityStyle.bg, priorityStyle.text)}>
                  {task.priority}
                </Badge>
              </div>
            </div>
          </div>

          {task.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 ml-6">{task.description}</p>
          )}

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 ml-6 flex-wrap">
            {task.due_date && (
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">
                <Calendar className="h-3 w-3" />
                {format(new Date(task.due_date), "MMM d")}
              </div>
            )}
            {task.time_estimate_hours && (
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">
                <Clock className="h-3 w-3" />
                {task.time_estimate_hours}h
              </div>
            )}
            {isBlocked && (
              <div className="flex items-center gap-1 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md">
                <AlertCircle className="h-3 w-3" />
                Blocked
              </div>
            )}
          </div>

          {task.assignee_details && task.assignee_details.length > 0 && (
            <div className="flex items-center gap-1 ml-6">
              {task.assignee_details.slice(0, 3).map((user, index) => (
                <div key={user._id} className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-xs font-medium shadow-sm" style={{ marginLeft: index > 0 ? '-4px' : 0, zIndex: 3 - index }} title={user.name}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              ))}
              {task.assignee_details.length > 3 && (
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">+{task.assignee_details.length - 3}</span>
              )}
            </div>
          )}

          {isLocked && lockedBy && (
            <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 ml-6 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md w-fit">
              <User className="h-3 w-3" />
              Being edited by {lockedBy}
            </div>
          )}
        </div>
      </Card>
    </CardWrapper>
  )
}
