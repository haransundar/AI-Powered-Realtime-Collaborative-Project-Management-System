"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import type { TaskStatus, TaskPriority } from "@/types"
import { X, Sparkles, Wand2, Check } from "lucide-react"

interface ProjectMember {
  user_id: string
  user: {
    _id: string
    name: string
    email: string
    avatar_url?: string
  }
  role: string
}

interface CreateTaskModalProps {
  projectId: string
  initialStatus: TaskStatus
  onClose: () => void
  onCreate: (task: any) => void
}

const priorities: TaskPriority[] = ["low", "medium", "high", "critical"]

export function CreateTaskModal({ projectId, initialStatus, onClose, onCreate }: CreateTaskModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<TaskPriority>("medium")
  const [dueDate, setDueDate] = useState("")
  const [timeEstimate, setTimeEstimate] = useState("")
  const [naturalInput, setNaturalInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [useNaturalLanguage, setUseNaturalLanguage] = useState(false)
  const [members, setMembers] = useState<ProjectMember[]>([])
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([])
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false)

  useEffect(() => {
    loadProjectMembers()
  }, [projectId])

  const loadProjectMembers = async () => {
    try {
      const { members } = await api.getProjectMembers(projectId)
      setMembers(members)
    } catch (error) {
      console.error("Failed to load project members:", error)
    }
  }

  const toggleAssignee = (userId: string) => {
    setSelectedAssignees(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleCreate = async () => {
    if (!title.trim()) return
    setLoading(true)
    try {
      const { task } = await api.createTask(projectId, {
        title,
        description,
        priority,
        status: initialStatus,
        due_date: dueDate || undefined,
        time_estimate_hours: timeEstimate ? Number(timeEstimate) : undefined,
        assignees: selectedAssignees,
      })
      onCreate(task)
      onClose()
    } catch (error) {
      console.error("Failed to create task:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleParseNaturalLanguage = async () => {
    if (!naturalInput.trim()) return
    setLoading(true)
    try {
      const { parsed } = await api.parseNaturalLanguage(naturalInput, projectId)
      setTitle(parsed.title || naturalInput)
      setDescription(parsed.description || "")
      setPriority(parsed.priority || "medium")
      if (parsed.due_date) {
        setDueDate(parsed.due_date.split("T")[0])
      }
      if (parsed.assignees && parsed.assignees.length > 0) {
        const matchedIds = members
          .filter(m => parsed.assignees.some((name: string) => 
            m.user.name.toLowerCase().includes(name.toLowerCase()) ||
            m.user.email.toLowerCase().includes(name.toLowerCase())
          ))
          .map(m => m.user._id)
        setSelectedAssignees(matchedIds)
      }
      setUseNaturalLanguage(false)
    } catch (error) {
      console.error("Failed to parse:", error)
      setTitle(naturalInput)
      setUseNaturalLanguage(false)
    } finally {
      setLoading(false)
    }
  }

  const getSelectedAssigneeNames = () => {
    return members
      .filter(m => selectedAssignees.includes(m.user._id))
      .map(m => m.user.name)
      .join(", ")
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-lg w-full max-w-md p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Create Task</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button
              variant={useNaturalLanguage ? "default" : "outline"}
              size="sm"
              onClick={() => setUseNaturalLanguage(true)}
            >
              <Wand2 className="h-4 w-4 mr-1" /> Natural Language
            </Button>
            <Button
              variant={!useNaturalLanguage ? "default" : "outline"}
              size="sm"
              onClick={() => setUseNaturalLanguage(false)}
            >
              Manual Entry
            </Button>
          </div>

          {useNaturalLanguage ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Describe your task naturally. For example: &quot;Create login page for @john by next Friday, high priority&quot;
              </p>
              <textarea
                value={naturalInput}
                onChange={(e) => setNaturalInput(e.target.value)}
                placeholder="Describe your task..."
                className="w-full h-32 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Button onClick={handleParseNaturalLanguage} disabled={loading} className="w-full">
                <Sparkles className="h-4 w-4 mr-1" />
                {loading ? "Parsing..." : "Parse with AI"}
              </Button>
            </div>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title *</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task title"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Task description"
                  className="mt-1 w-full h-20 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Assign To</label>
                <div className="relative mt-1">
                  <button
                    type="button"
                    onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                    className="w-full h-9 px-3 border border-slate-300 dark:border-slate-700 rounded-md text-sm text-left bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-between text-slate-900 dark:text-slate-100"
                  >
                    <span className={selectedAssignees.length === 0 ? "text-slate-400 dark:text-slate-500" : ""}>
                      {selectedAssignees.length === 0 
                        ? "Select assignees..." 
                        : getSelectedAssigneeNames()}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500">▼</span>
                  </button>
                  
                  {showAssigneeDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {members.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">No team members found</div>
                      ) : (
                        members.map((member) => (
                          <button
                            key={member.user._id}
                            type="button"
                            onClick={() => toggleAssignee(member.user._id)}
                            className="w-full px-3 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between"
                          >
                            <div>
                              <div className="font-medium text-slate-900 dark:text-slate-100">{member.user.name}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">{member.role}</div>
                            </div>
                            {selectedAssignees.includes(member.user._id) && (
                              <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
                {selectedAssignees.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {members
                      .filter(m => selectedAssignees.includes(m.user._id))
                      .map(m => (
                        <span 
                          key={m.user._id}
                          className="inline-flex items-center px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs rounded-full"
                        >
                          {m.user.name}
                          <button
                            type="button"
                            onClick={() => toggleAssignee(m.user._id)}
                            className="ml-1 hover:text-indigo-600 dark:hover:text-indigo-200"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="mt-1 w-full h-9 px-3 border border-slate-300 dark:border-slate-700 rounded-md text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {priorities.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Due Date</label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Time Estimate (hours)</label>
                <Input
                  type="number"
                  value={timeEstimate}
                  onChange={(e) => setTimeEstimate(e.target.value)}
                  placeholder="e.g., 4"
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={loading || !title.trim()} className="flex-1">
                  {loading ? "Creating..." : "Create Task"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
