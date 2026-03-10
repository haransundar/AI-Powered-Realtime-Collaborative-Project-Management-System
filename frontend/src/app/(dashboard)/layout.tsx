"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useStore } from "@/store"
import { Button } from "@/components/ui/button"
import { Building2, FolderKanban, Bell, LogOut, Plus, ChevronDown, Users, Settings, BarChart3, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeDropdown } from "@/components/theme-toggle"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isAuthenticated, loadUser, logout, organizations, currentOrg, loadOrganizations, setCurrentOrg, projects, loadProjects, notifications, unreadCount, loadNotifications } = useStore()
  const [showOrgDropdown, setShowOrgDropdown] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => { loadUser() }, [loadUser])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else {
      loadOrganizations()
      loadNotifications()
    }
  }, [isAuthenticated, router, loadOrganizations, loadNotifications])

  useEffect(() => {
    if (currentOrg) { loadProjects(currentOrg._id) }
  }, [currentOrg, loadProjects])

  useEffect(() => {
    if (organizations && organizations.length > 0 && !currentOrg) { setCurrentOrg(organizations[0]) }
  }, [organizations, currentOrg, setCurrentOrg])

  const handleLogout = () => { logout(); router.push("/") }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <motion.aside initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.3 }} className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">AI PM</span>
          </Link>
        </div>

        {/* Organization Selector */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative">
            <motion.button whileHover={{ scale: 1.01 }} onClick={() => setShowOrgDropdown(!showOrgDropdown)} className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{currentOrg?.name || "Select Organization"}</span>
              </div>
              <motion.div animate={{ rotate: showOrgDropdown ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              </motion.div>
            </motion.button>
            <AnimatePresence>
              {showOrgDropdown && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-10 overflow-hidden">
                  {organizations && organizations.map((org, index) => (
                    <motion.button key={org._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} onClick={() => { setCurrentOrg(org); setShowOrgDropdown(false) }} className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 ${currentOrg?._id === org._id ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300"}`}>
                      <div className={`w-2 h-2 rounded-full ${currentOrg?._id === org._id ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-600"}`} />
                      {org.name}
                    </motion.button>
                  ))}
                  <Link href="/dashboard/organizations/new" className="flex items-center gap-2 px-4 py-3 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border-t border-slate-200 dark:border-slate-700 font-medium" onClick={() => setShowOrgDropdown(false)}>
                    <Plus className="h-4 w-4" /> New Organization
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <NavLink href="/dashboard" icon={BarChart3} label="Dashboard" />
          {currentOrg && (
            <>
              <NavLink href={`/dashboard/organizations/${currentOrg._id}/members`} icon={Users} label="Members" />
              <NavLink href={`/dashboard/organizations/${currentOrg._id}/settings`} icon={Settings} label="Settings" />
            </>
          )}
          <div className="pt-6">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Projects</span>
              <Link href="/dashboard/projects/new">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Plus className="h-4 w-4 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" />
                </motion.div>
              </Link>
            </div>
            <AnimatePresence>
              {projects.map((project, index) => (
                <motion.div key={project._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                  <Link href={`/dashboard/projects/${project._id}`} className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                    <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <FolderKanban className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="truncate text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100">{project.name}</span>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
            {projects.length === 0 && <p className="px-3 py-2 text-xs text-slate-400 dark:text-slate-500">No projects yet</p>}
          </div>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center text-sm font-semibold shadow-lg shadow-indigo-500/20">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                <LogOut className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <motion.header initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3, delay: 0.1 }} className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-end px-6 gap-4 sticky top-0 z-40">
          <ThemeDropdown />
          
          <div className="relative">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" onClick={() => setShowNotifications(!showNotifications)} className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-rose-600 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-lg">
                    {unreadCount}
                  </motion.span>
                )}
              </Button>
            </motion.div>
            <AnimatePresence>
              {showNotifications && (
                <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2 }} className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 && <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-full">{unreadCount} new</span>}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-6 text-sm text-slate-400 dark:text-slate-500 text-center">No notifications yet</p>
                    ) : (
                      notifications.slice(0, 10).map((n, index) => (
                        <motion.div key={n._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className={`p-4 border-b border-slate-100 dark:border-slate-700 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${!n.is_read ? "bg-indigo-50/50 dark:bg-indigo-900/20" : ""}`}>
                          <p className="font-medium text-slate-900 dark:text-slate-100">{n.title}</p>
                          <p className="text-slate-500 dark:text-slate-400 mt-1">{n.message}</p>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-slate-50 dark:bg-slate-950">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

function NavLink({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors group">
      <Icon className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
      <span>{label}</span>
    </Link>
  )
}
