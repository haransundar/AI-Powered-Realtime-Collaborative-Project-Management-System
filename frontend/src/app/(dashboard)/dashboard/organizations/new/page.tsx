"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function NewOrganizationPage() {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { createOrganization, setCurrentOrg } = useStore()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const org = await createOrganization(name)
      setCurrentOrg(org)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Failed to create organization")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Organization</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-md border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Organization Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Company"
                required
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !name.trim()} className="flex-1">
                {loading ? "Creating..." : "Create Organization"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
