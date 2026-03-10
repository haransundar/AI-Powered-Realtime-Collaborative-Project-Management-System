"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Trash2 } from "lucide-react"
import type { OrgMembership } from "@/types"

export default function MembersPage() {
  const params = useParams()
  const orgId = params.orgId as string
  const [members, setMembers] = useState<OrgMembership[]>([])
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("member")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadMembers()
  }, [orgId])

  const loadMembers = async () => {
    try {
      const { organization } = await api.getOrganization(orgId)
      setMembers(organization.members || [])
    } catch (error) {
      console.error("Failed to load members:", error)
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.inviteMember(orgId, inviteEmail, inviteRole)
      setInviteEmail("")
      setShowInvite(false)
      loadMembers()
    } catch (error: any) {
      alert(error.message || "Failed to invite member")
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return
    try {
      await api.removeMember(orgId, userId)
      loadMembers()
    } catch (error: any) {
      alert(error.message || "Failed to remove member")
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.updateMemberRole(orgId, userId, newRole)
      loadMembers()
    } catch (error: any) {
      alert(error.message || "Failed to update role")
    }
  }

  const roleColors: Record<string, string> = {
    owner: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
    admin: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
    member: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    guest: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Team Members</h1>
        <Button onClick={() => setShowInvite(true)}>
          <UserPlus className="h-4 w-4 mr-2" /> Invite Member
        </Button>
      </div>

      {showInvite && (
        <Card>
          <CardHeader>
            <CardTitle>Invite New Member</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="flex gap-3">
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="flex-1"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="h-9 px-3 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="admin">Admin</option>
                <option value="member">Member</option>
                <option value="guest">Guest</option>
              </select>
              <Button type="submit" disabled={loading}>
                {loading ? "Inviting..." : "Send Invite"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowInvite(false)}>
                Cancel
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-medium">
                    {member.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{member.user?.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{member.user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {member.role === "owner" ? (
                    <Badge className={roleColors[member.role]}>Owner</Badge>
                  ) : (
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.user_id, e.target.value)}
                      className="h-8 px-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    >
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                      <option value="guest">Guest</option>
                    </select>
                  )}
                  {member.role !== "owner" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      onClick={() => handleRemove(member.user_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
