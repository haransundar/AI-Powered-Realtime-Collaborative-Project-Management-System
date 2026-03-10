"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { useStore } from "@/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export default function OrgSettingsPage() {
  const params = useParams()
  const router = useRouter()
  const orgId = params.orgId as string
  const { currentOrg, setCurrentOrg, loadOrganizations, removeOrganization, user } = useStore()
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saved, setSaved] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState("")

  const isOwner = currentOrg && user && String(currentOrg.owner_id) === String(user._id)

  useEffect(() => {
    if (currentOrg) {
      setName(currentOrg.name)
    }
  }, [currentOrg])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSaved(false)
    try {
      const { organization } = await api.getOrganization(orgId)
      setSaved(true)
      loadOrganizations()
    } catch (error: any) {
      alert(error.message || "Failed to save settings")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirmDelete !== currentOrg?.name) {
      alert("Please type the organization name to confirm deletion")
      return
    }

    if (!confirm(`Are you absolutely sure you want to delete "${currentOrg?.name}"? This will delete all projects and tasks. This action cannot be undone.`)) {
      return
    }

    setDeleting(true)
    try {
      await api.deleteOrganization(orgId)
      removeOrganization(orgId)
      router.push("/dashboard")
    } catch (error: any) {
      alert(error.message || "Failed to delete organization")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Organization Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Organization Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              {saved && <span className="text-sm text-emerald-600 dark:text-emerald-400">Settings saved!</span>}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Once you delete an organization, there is no going back. All projects, tasks, and data will be permanently deleted.
          </p>
          
          {!isOwner ? (
            <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md border border-amber-200 dark:border-amber-800">
              Only the organization owner can delete this organization.
            </p>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Type <span className="font-bold text-red-600 dark:text-red-400">{currentOrg?.name}</span> to confirm
                </label>
                <Input
                  value={confirmDelete}
                  onChange={(e) => setConfirmDelete(e.target.value)}
                  placeholder="Organization name"
                  className="mt-1"
                />
              </div>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={deleting || confirmDelete !== currentOrg?.name}
              >
                {deleting ? "Deleting..." : "Delete Organization"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
