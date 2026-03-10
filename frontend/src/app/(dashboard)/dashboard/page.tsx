"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/store"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { api } from "@/lib/api"
import { FolderKanban, CheckCircle, Clock, Users, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { y: -4, transition: { duration: 0.2 } }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
}

export default function DashboardPage() {
  const { currentOrg, projects, token } = useStore()
  const [workload, setWorkload] = useState<any[]>([])

  useEffect(() => {
    if (currentOrg && token) { loadWorkload() }
  }, [currentOrg, token])

  const loadWorkload = async () => {
    if (!currentOrg || !token) return
    try {
      const { workload } = await api.getWorkloadAnalysis(currentOrg._id)
      setWorkload(workload || [])
    } catch { setWorkload([]) }
  }

  const totalProjects = projects.length
  const activeProjects = projects.filter((p) => p.status === "active").length
  const totalTasks = workload.reduce((sum, w) => sum + w.task_count, 0)

  const stats = [
    { label: "Total Projects", value: totalProjects, icon: FolderKanban, gradient: "from-indigo-500 to-violet-600", bgGradient: "from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20" },
    { label: "Active Projects", value: activeProjects, icon: CheckCircle, gradient: "from-emerald-500 to-teal-600", bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20" },
    { label: "Team Members", value: workload.length, icon: Users, gradient: "from-violet-500 to-purple-600", bgGradient: "from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20" },
    { label: "Total Tasks", value: totalTasks, icon: Clock, gradient: "from-amber-500 to-orange-600", bgGradient: "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20" },
  ]

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome to {currentOrg?.name || "your workspace"}</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.label} variants={cardVariants} whileHover="hover" transition={{ duration: 0.3, delay: index * 0.1 }}>
              <Card className={`border-0 shadow-lg bg-gradient-to-br ${stat.bgGradient} overflow-hidden`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + index * 0.1 }} className="text-3xl font-bold text-slate-900 dark:text-white">
                        {stat.value}
                      </motion.p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Projects Card */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />Projects
              </CardTitle>
              <Link href="/dashboard/projects/new" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent>
              {projects.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FolderKanban className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">No projects yet. Create your first project!</p>
                  <Link href="/dashboard/projects/new" className="inline-flex items-center gap-2 mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-sm">
                    Create Project <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {projects.slice(0, 5).map((project, index) => (
                    <motion.div key={project._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + index * 0.05 }}>
                      <Link href={`/dashboard/projects/${project._id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <FolderKanban className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{project.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{project.member_count || 0} members</p>
                          </div>
                        </div>
                        <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${project.status === "active" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
                          {project.status}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Team Workload Card */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-violet-600 dark:text-violet-400" />Team Workload
              </CardTitle>
            </CardHeader>
            <CardContent>
              {workload.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">No workload data available.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {workload.map((member, index) => (
                    <motion.div key={member.user._id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + index * 0.05 }} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center text-sm font-semibold shadow-lg shadow-indigo-500/20">
                        {member.user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{member.user.name}</p>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${member.status === "overloaded" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" : member.status === "balanced" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"}`}>
                            {member.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-xs text-slate-500 dark:text-slate-400">{member.task_count} tasks</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{member.estimated_hours}h estimated</p>
                        </div>
                        <div className="mt-2 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((member.estimated_hours / 40) * 100, 100)}%` }} transition={{ duration: 0.5, delay: 0.6 + index * 0.05 }} className={`h-full rounded-full ${member.status === "overloaded" ? "bg-gradient-to-r from-red-500 to-rose-600" : member.status === "balanced" ? "bg-gradient-to-r from-emerald-500 to-teal-600" : "bg-gradient-to-r from-indigo-500 to-violet-600"}`} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
