"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import type { Task, TaskStatus, TaskPriority, Comment, FileAttachment } from "@/types"
import { X, Send, Paperclip, Trash2, Download, Sparkles, Check, UserPlus } from "lucide-react"
import { format } from "date-fns"

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

interface TaskModalProps {
  task: Task | null
  projectId: string
  onClose: () => void
  onUpdate: (task: Task) => void
  onDelete: (taskId: string) => void
}

const statuses: TaskStatus[] = ["backlog", "todo", "in_progress", "review", "done"]
const priorities: TaskPriority[] = ["low", "medium", "high", "critical"]

export function TaskModal({ task, projectId, onClose, onUpdate, onDelete }: TaskModalProps) {
  const [editedTask, setEditedTask] = useState<Partial<Task>>({})
  const [comments, setComments] = useState<Comment[]>([])
  const [attachments, setAttachments] = useState<FileAttachment[]>([])
  const [newComment, setNewComment] = useState("")
  const [suggestions, setSuggestions] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [members, setMembers] = useState<ProjectMember[]>([])
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([])
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false)

  useEffect(() => {
    if (task) {
      setEditedTask(task)
      setSelectedAssignees(task.assignees || [])
      loadComments()
      loadAttachments()
      loadProjectMembers()
    }
  }, [task])

  const loadProjectMembers = async () => {
    try {
      const { members } = await api.getProjectMembers(projectId)
      setMembers(members)
    } catch (error) {
      console.error("Failed to load project members:", error)
    }
  }

  const loadComments = async () => {
    if (!task) return
    try {
      const { comments } = await api.getComments(task._id)
      setComments(comments)
    } catch (error) {
      console.error("Failed to load comments:", error)
    }
  }

  const loadAttachments = async () => {
    if (!task) return
    try {
      const { attachments } = await api.getAttachments(task._id)
      setAttachments(attachments)
    } catch (error) {
      console.error("Failed to load attachments:", error)
    }
  }

  const toggleAssignee = (userId: string) => {
    setSelectedAssignees(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSave = async () => {
    if (!task) return
    setLoading(true)
    try {
      const { task: updated } = await api.updateTask(task._id, {
        title: editedTask.title,
        description: editedTask.description,
        status: editedTask.status,
        priority: editedTask.priority,
        due_date: editedTask.due_date,
        time_estimate_hours: editedTask.time_estimate_hours,
        version: task.version,
      })
      
      const currentAssignees = task.assignees || []
      const newAssignees = selectedAssignees.filter(id => !currentAssignees.includes(id))
      
      if (newAssignees.length > 0) {
        const { task: taskWithAssignees } = await api.addAssignees(task._id, newAssignees)
        onUpdate(taskWithAssignees)
      } else {
        onUpdate(updated)
      }
    } catch (error: any) {
      if (error.message.includes("conflict")) {
        alert("This task was modified by another user. Please refresh and try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!task || !newComment.trim()) return
    try {
      const { comment } = await api.createComment(task._id, newComment)
      setComments([...comments, comment])
      setNewComment("")
    } catch (error) {
      console.error("Failed to add comment:", error)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!task || !e.target.files?.length) return
    const file = e.target.files[0]
    try {
      const { attachment } = await api.uploadAttachment(task._id, file)
      setAttachments([...attachments, attachment])
    } catch (error) {
      console.error("Failed to upload file:", error)
    }
  }

  const handleDeleteAttachment = async (attachmentId: string) => {
    try {
      await api.deleteAttachment(attachmentId)
      setAttachments(attachments.filter((a) => a._id !== attachmentId))
    } catch (error) {
      console.error("Failed to delete attachment:", error)
    }
  }

  const handleGetSuggestions = async () => {
    if (!editedTask.title) return
    try {
      const { suggestions } = await api.getSuggestions(
        editedTask.title || "",
        editedTask.description || "",
        projectId
      )
      setSuggestions(suggestions)
    } catch (error) {
      console.error("Failed to get suggestions:", error)
    }
  }

  const handleDelete = async () => {
    if (!task || !confirm("Are you sure you want to delete this task?")) return
    try {
      await api.deleteTask(task._id)
      onDelete(task._id)
      onClose()
    } catch (error) {
      console.error("Failed to delete task:", error)
    }
  }

  const getAssigneeName = (userId: string) => {
    const member = members.find(m => m.user._id === userId)
    return member?.user.name || userId
  }

  if (!task) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Task Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
            <Input
              value={editedTask.title || ""}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
            <textarea
              value={editedTask.description || ""}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              className="mt-1 w-full h-24 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
              <select
                value={editedTask.status || "backlog"}
                onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value as TaskStatus })}
                className="mt-1 w-full h-9 px-3 border border-slate-300 dark:border-slate-700 rounded-md text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s.replace("_", " ")}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Priority</label>
              <select
                value={editedTask.priority || "medium"}
                onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as TaskPriority })}
                className="mt-1 w-full h-9 px-3 border border-slate-300 dark:border-slate-700 rounded-md text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <UserPlus className="h-4 w-4" /> Assignees
            </label>
            <div className="relative mt-1">
              <button
                type="button"
                onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                className="w-full h-9 px-3 border border-slate-300 dark:border-slate-700 rounded-md text-sm text-left bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-between text-slate-900 dark:text-slate-100"
              >
                <span className={selectedAssignees.length === 0 ? "text-slate-400 dark:text-slate-500" : ""}>
                  {selectedAssignees.length === 0 
                    ? "Select assignees..." 
                    : `${selectedAssignees.length} assignee(s) selected`}
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
                {selectedAssignees.map(userId => (
                  <span 
                    key={userId}
                    className="inline-flex items-center px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs rounded-full"
                  >
                    {getAssigneeName(userId)}
                    <button
                      type="button"
                      onClick={() => toggleAssignee(userId)}
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
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Due Date</label>
              <Input
                type="date"
                value={editedTask.due_date?.split("T")[0] || ""}
                onChange={(e) => setEditedTask({ ...editedTask, due_date: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Time Estimate (hours)</label>
              <Input
                type="number"
                value={editedTask.time_estimate_hours || ""}
                onChange={(e) => setEditedTask({ ...editedTask, time_estimate_hours: Number(e.target.value) })}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleGetSuggestions}>
              <Sparkles className="h-4 w-4 mr-1" /> AI Suggestions
            </Button>
          </div>

          {suggestions && (
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-sm space-y-2 border border-indigo-200 dark:border-indigo-800">
              <p className="text-slate-900 dark:text-slate-100"><strong>Suggested Priority:</strong> {suggestions.suggested_priority}</p>
              {suggestions.suggested_assignees?.length > 0 && (
                <p className="text-slate-900 dark:text-slate-100"><strong>Suggested Assignees:</strong> {suggestions.suggested_assignees.join(", ")}</p>
              )}
              {suggestions.next_steps?.length > 0 && (
                <div className="text-slate-900 dark:text-slate-100">
                  <strong>Next Steps:</strong>
                  <ul className="list-disc list-inside text-slate-700 dark:text-slate-300">
                    {suggestions.next_steps.map((step: string, i: number) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Attachments</label>
            <div className="mt-2 space-y-2">
              {attachments.map((att) => (
                <div key={att._id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                  <span className="text-sm text-slate-900 dark:text-slate-100">{att.original_name}</span>
                  <div className="flex gap-1">
                    <a 
                      href={`http://localhost:5000/api${att.download_url}`} 
                      target="_blank"
                      className="inline-flex items-center justify-center h-6 w-6 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400"
                    >
                      <Download className="h-3 w-3" />
                    </a>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteAttachment(att._id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              <label className="flex items-center gap-2 cursor-pointer text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
                <Paperclip className="h-4 w-4" />
                Add attachment
                <input type="file" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Comments</label>
            <div className="mt-2 space-y-3">
              {comments.map((comment) => (
                <div key={comment._id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-slate-900 dark:text-slate-100">{comment.author?.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {format(new Date(comment.created_at), "MMM d, h:mm a")}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{comment.content}</p>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                />
                <Button size="icon" onClick={handleAddComment}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-700">
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
