"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { X, Sparkles, Plus, Clock, User } from "lucide-react"

interface Subtask {
  title: string
  description: string
  estimated_hours: number
  priority: string
  suggested_assignee: string | null
  order: number
}

interface BreakdownResult {
  subtasks: Subtask[]
  total_estimated_hours: number
  dependencies_note: string
}

interface TaskBreakdownModalProps {
  projectId: string
  onClose: () => void
  onCreateTasks: (tasks: Subtask[]) => void
}

export function TaskBreakdownModal({ projectId, onClose, onCreateTasks }: TaskBreakdownModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [breakdown, setBreakdown] = useState<BreakdownResult | null>(null)
  const [selectedSubtasks, setSelectedSubtasks] = useState<Set<number>>(new Set())
  const [creating, setCreating] = useState(false)

  const handleBreakdown = async () => {
    if (!title.trim()) return
    setLoading(true)
    try {
      const { breakdown: result } = await api.breakdownTask(title, description, projectId)
      setBreakdown(result)
      setSelectedSubtasks(new Set(result.subtasks.map((_: Subtask, i: number) => i)))
    } catch (error) {
      console.error("Failed to breakdown task:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSubtask = (index: number) => {
    const newSelected = new Set(selectedSubtasks)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedSubtasks(newSelected)
  }

  const handleCreateSelected = async () => {
    if (!breakdown || selectedSubtasks.size === 0) return
    setCreating(true)
    
    const tasksToCreate = breakdown.subtasks.filter((_, i) => selectedSubtasks.has(i))
    
    try {
      for (const subtask of tasksToCreate) {
        await api.createTask(projectId, {
          title: subtask.title,
          description: subtask.description,
          priority: subtask.priority,
          time_estimate_hours: subtask.estimated_hours,
          status: 'backlog'
        })
      }
      onCreateTasks(tasksToCreate)
      onClose()
    } catch (error) {
      console.error("Failed to create tasks:", error)
    } finally {
      setCreating(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
      case 'high': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
      case 'medium': return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300'
      case 'low': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">AI Task Breakdown</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {!breakdown ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Enter a high-level task and let AI break it down into smaller, actionable subtasks.
              </p>
              
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Task Title *</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Implement user authentication system"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description (optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add more details about what needs to be done..."
                  className="mt-1 w-full h-24 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <Button 
                onClick={handleBreakdown} 
                disabled={loading || !title.trim()} 
                className="w-full"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {loading ? "Analyzing..." : "Break Down with AI"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white">{title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {breakdown.subtasks.length} subtasks • {breakdown.total_estimated_hours}h total
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setBreakdown(null)}>
                  Start Over
                </Button>
              </div>

              {breakdown.dependencies_note && (
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-sm text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  <strong>Note:</strong> {breakdown.dependencies_note}
                </div>
              )}

              <div className="space-y-2">
                {breakdown.subtasks.map((subtask, index) => (
                  <div 
                    key={index}
                    onClick={() => toggleSubtask(index)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedSubtasks.has(index) 
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                        selectedSubtasks.has(index) 
                          ? 'border-purple-500 bg-purple-500' 
                          : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {selectedSubtasks.has(index) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-slate-400 dark:text-slate-500">#{subtask.order}</span>
                          <span className="font-medium text-sm text-slate-900 dark:text-white">{subtask.title}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{subtask.description}</p>
                        <div className="flex items-center gap-3 text-xs">
                          <span className={`px-2 py-0.5 rounded ${getPriorityColor(subtask.priority)}`}>
                            {subtask.priority}
                          </span>
                          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                            <Clock className="h-3 w-3" />
                            {subtask.estimated_hours}h
                          </span>
                          {subtask.suggested_assignee && (
                            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                              <User className="h-3 w-3" />
                              {subtask.suggested_assignee}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {breakdown && (
          <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {selectedSubtasks.size} of {breakdown.subtasks.length} selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateSelected} 
                disabled={creating || selectedSubtasks.size === 0}
              >
                <Plus className="h-4 w-4 mr-1" />
                {creating ? "Creating..." : `Create ${selectedSubtasks.size} Tasks`}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
