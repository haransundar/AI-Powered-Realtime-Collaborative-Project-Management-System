"use client"

import { useDroppable } from "@dnd-kit/core"
import { TaskCard } from "./TaskCard"
import type { Task, TaskStatus } from "@/types"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface KanbanColumnProps {
  status: TaskStatus
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onAddTask: () => void
  lockedTasks: Record<string, { name: string }>
  isOver?: boolean
  isDragging?: boolean
  recentlyMovedTasks?: Set<string>
}

const statusConfig: Record<TaskStatus, { label: string; bg: string; dot: string; highlight: string; border: string }> = {
  backlog: { label: "Backlog", bg: "bg-slate-50 dark:bg-slate-900/50", dot: "bg-slate-500", highlight: "ring-slate-400 bg-slate-100 dark:bg-slate-800", border: "border-slate-300 dark:border-slate-600" },
  todo: { label: "To Do", bg: "bg-indigo-50 dark:bg-indigo-900/20", dot: "bg-indigo-500", highlight: "ring-indigo-400 bg-indigo-100 dark:bg-indigo-900/40", border: "border-indigo-300 dark:border-indigo-700" },
  in_progress: { label: "In Progress", bg: "bg-amber-50 dark:bg-amber-900/20", dot: "bg-amber-500", highlight: "ring-amber-400 bg-amber-100 dark:bg-amber-900/40", border: "border-amber-300 dark:border-amber-700" },
  review: { label: "Review", bg: "bg-violet-50 dark:bg-violet-900/20", dot: "bg-violet-500", highlight: "ring-violet-400 bg-violet-100 dark:bg-violet-900/40", border: "border-violet-300 dark:border-violet-700" },
  done: { label: "Done", bg: "bg-emerald-50 dark:bg-emerald-900/20", dot: "bg-emerald-500", highlight: "ring-emerald-400 bg-emerald-100 dark:bg-emerald-900/40", border: "border-emerald-300 dark:border-emerald-700" },
}

export function KanbanColumn({ status, tasks, onTaskClick, onAddTask, lockedTasks, isOver, isDragging, recentlyMovedTasks = new Set() }: KanbanColumnProps) {
  const { setNodeRef, isOver: isDroppableOver } = useDroppable({ id: status })
  const isHighlighted = isOver || isDroppableOver
  const config = statusConfig[status]

  return (
    <motion.div
      ref={setNodeRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col w-72 min-w-72 rounded-2xl p-3 transition-all duration-200",
        config.bg,
        isHighlighted && `ring-2 ${config.highlight} scale-[1.02]`,
        isDragging && !isHighlighted && "opacity-80"
      )}
    >
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <motion.div animate={{ scale: isHighlighted ? 1.2 : 1 }} transition={{ duration: 0.2 }} className={cn("w-3 h-3 rounded-full", config.dot)} />
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{config.label}</h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-full font-medium shadow-sm">{tasks.length}</span>
        </div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-white/80 dark:hover:bg-slate-700" onClick={onAddTask}>
            <Plus className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </Button>
        </motion.div>
      </div>

      <div className={cn("flex-1 overflow-y-auto min-h-[200px] rounded-xl p-1 transition-colors duration-200", isHighlighted && "bg-white/60 dark:bg-slate-800/60")}>
        <AnimatePresence>
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onClick={() => onTaskClick(task)}
              isLocked={!!lockedTasks[task._id]}
              lockedBy={lockedTasks[task._id]?.name}
              isRecentlyMoved={recentlyMovedTasks.has(task._id)}
            />
          ))}
        </AnimatePresence>
        
        {tasks.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn("flex items-center justify-center h-24 text-sm text-slate-400 dark:text-slate-500 border-2 border-dashed rounded-xl transition-all duration-200", isHighlighted ? `${config.border} bg-white/50 dark:bg-slate-800/50` : "border-slate-200 dark:border-slate-700")}>
            {isHighlighted ? (
              <motion.span initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="font-medium text-slate-600 dark:text-slate-300">
                Drop here
              </motion.span>
            ) : (
              "No tasks"
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
