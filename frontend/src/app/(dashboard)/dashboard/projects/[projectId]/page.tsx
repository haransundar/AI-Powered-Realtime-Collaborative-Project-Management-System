"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useStore } from "@/store"
import { api } from "@/lib/api"
import { KanbanBoard } from "@/components/task/KanbanBoard"
import { TaskModal } from "@/components/task/TaskModal"
import { CreateTaskModal } from "@/components/task/CreateTaskModal"
import { AIInsightsPanel } from "@/components/ai/AIInsightsPanel"
import { TaskBreakdownModal } from "@/components/ai/TaskBreakdownModal"
import type { Task, TaskStatus } from "@/types"
import { Users, Brain, Sparkles, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProjectPage() {
  const params = useParams()
  const projectId = params.projectId as string
  const { 
    currentProject, setCurrentProject, currentOrg,
    loadTasks, addTask, updateTask, removeTask,
    joinProject, leaveProject, connectedUsers
  } = useStore()
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [createModalStatus, setCreateModalStatus] = useState<TaskStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [showBreakdownModal, setShowBreakdownModal] = useState(false)

  useEffect(() => {
    loadProject()
    return () => {
      if (projectId) {
        leaveProject(projectId)
      }
    }
  }, [projectId])

  const loadProject = async () => {
    setLoading(true)
    try {
      const { project } = await api.getProject(projectId)
      setCurrentProject(project)
      await loadTasks(projectId)
      joinProject(projectId)
    } catch (error) {
      console.error("Failed to load project:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
  }

  const handleAddTask = (status: TaskStatus) => {
    setCreateModalStatus(status)
  }

  const handleTaskCreated = (task: Task) => {
    addTask(task)
  }

  const handleTaskUpdated = (task: Task) => {
    updateTask(task._id, task)
    setSelectedTask(null)
  }

  const handleTaskDeleted = (taskId: string) => {
    removeTask(taskId)
    setSelectedTask(null)
  }

  const handleBreakdownComplete = () => {
    loadTasks(projectId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    )
  }

  return (
    <div className="h-full flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{currentProject?.name}</h1>
            {currentProject?.description && (
              <p className="text-slate-600 dark:text-slate-400">{currentProject.description}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* AI Actions */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowBreakdownModal(true)}
              className="text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              AI Breakdown
            </Button>
            
            <Button
              variant={showAIPanel ? "default" : "outline"}
              size="sm"
              onClick={() => setShowAIPanel(!showAIPanel)}
              className={showAIPanel ? "bg-purple-600 hover:bg-purple-700" : ""}
            >
              <Brain className="h-4 w-4 mr-1" />
              AI Insights
              {showAIPanel ? <ChevronRight className="h-4 w-4 ml-1" /> : <ChevronLeft className="h-4 w-4 ml-1" />}
            </Button>

            {/* Connected Users */}
            {connectedUsers.length > 0 && (
              <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-slate-700 pl-3">
                <Users className="h-4 w-4" />
                {connectedUsers.length} online
              </div>
            )}
            <div className="flex -space-x-2">
              {connectedUsers.slice(0, 5).map((user) => (
                <div
                  key={user._id}
                  className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm border-2 border-white dark:border-slate-900"
                  title={user.name}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <KanbanBoard onTaskClick={handleTaskClick} onAddTask={handleAddTask} />
        </div>
      </div>

      {/* AI Insights Sidebar */}
      {showAIPanel && currentOrg && (
        <div className="w-80 ml-4 flex-shrink-0">
          <AIInsightsPanel projectId={projectId} orgId={currentOrg._id} />
        </div>
      )}

      {/* Modals */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          projectId={projectId}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdated}
          onDelete={handleTaskDeleted}
        />
      )}

      {createModalStatus && (
        <CreateTaskModal
          projectId={projectId}
          initialStatus={createModalStatus}
          onClose={() => setCreateModalStatus(null)}
          onCreate={handleTaskCreated}
        />
      )}

      {showBreakdownModal && (
        <TaskBreakdownModal
          projectId={projectId}
          onClose={() => setShowBreakdownModal(false)}
          onCreateTasks={handleBreakdownComplete}
        />
      )}
    </div>
  )
}
