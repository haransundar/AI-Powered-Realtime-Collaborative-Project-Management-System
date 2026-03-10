"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  const toggleTheme = () => {
    // Toggle between light and dark
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
  }

  const isDark = theme === "dark" || (theme === "system" && resolvedTheme === "dark")

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ y: -20, opacity: 0, rotate: -90 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 20, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="h-4 w-4 text-indigo-400" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ y: -20, opacity: 0, rotate: 90 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 20, opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="h-4 w-4 text-amber-500" />
            </motion.div>
          )}
        </AnimatePresence>
        <span className="sr-only">Toggle theme</span>
      </Button>
    </motion.div>
  )
}

export function ThemeDropdown() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-slate-100 hover:bg-slate-200">
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  const themes = [
    { value: "light", label: "Light", icon: Sun, color: "text-amber-500" },
    { value: "dark", label: "Dark", icon: Moon, color: "text-indigo-400" },
    { value: "system", label: "System", icon: Monitor, color: "text-slate-500 dark:text-slate-400" },
  ]

  const getCurrentIcon = () => {
    if (theme === "system") return <Monitor className="h-4 w-4 text-slate-500 dark:text-slate-400" />
    if (theme === "dark") return <Moon className="h-4 w-4 text-indigo-400" />
    return <Sun className="h-4 w-4 text-amber-500" />
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    setOpen(false)
  }

  return (
    <div className="relative">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(!open)}
          className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          {getCurrentIcon()}
        </Button>
      </motion.div>
      
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
            >
              {themes.map((t) => {
                const Icon = t.icon
                const isSelected = theme === t.value
                return (
                  <button
                    key={t.value}
                    onClick={() => handleThemeChange(t.value)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      isSelected
                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${t.color}`} />
                    {t.label}
                    {isSelected && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    )}
                  </button>
                )
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
