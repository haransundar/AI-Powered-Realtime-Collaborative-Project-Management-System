"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useStore } from "@/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Home, Sparkles, Mail, Lock, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useStore()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(email, password)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 dark:bg-indigo-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-violet-200 dark:bg-violet-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader className="text-center pb-2">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }} className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
              <Sparkles className="h-8 w-8 text-white" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription className="mt-1">Sign in to continue to your workspace</CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="pt-4">
            <motion.form onSubmit={handleSubmit} className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              {error && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm rounded-xl border border-red-200 dark:border-red-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />{error}
                </motion.div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />Email Address
                </label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="h-12 rounded-xl" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-slate-400" />Password
                </label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="h-12 rounded-xl" />
              </div>
              
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button type="submit" className="w-full h-12 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25 rounded-xl font-medium" disabled={loading}>
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>Sign In<ArrowRight className="ml-2 h-4 w-4" /></>
                  )}
                </Button>
              </motion.div>
            </motion.form>
            
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium hover:underline">Create one</Link>
              </p>
              
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <Link href="/">
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button variant="outline" className="w-full h-11 rounded-xl">
                      <Home className="h-4 w-4 mr-2" />Back to Home
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
