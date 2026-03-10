"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useStore } from "@/store"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { User, Shield, Users, Eye, Mail, CheckCircle, ArrowLeft, Home, Lock, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"

type Step = "email" | "otp" | "details"

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("member")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { register } = useStore()
  const router = useRouter()

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await api.sendOtp(email)
      setStep("otp")
    } catch (err: any) {
      setError(err.message || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await api.verifyOtp(email, otp)
      setStep("details")
    } catch (err: any) {
      setError(err.message || "Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setError("")
    setLoading(true)
    try {
      await api.resendOtp(email)
      alert("OTP resent successfully!")
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    setLoading(true)
    try {
      await register(email, password, name)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const roles = [
    { id: "admin", label: "Admin", icon: Shield, description: "Full access to manage organization", gradient: "from-amber-500 to-orange-600" },
    { id: "member", label: "Member", icon: Users, description: "Can create and manage tasks", gradient: "from-indigo-500 to-violet-600" },
    { id: "guest", label: "Guest", icon: Eye, description: "Read-only access to shared resources", gradient: "from-slate-500 to-slate-600" },
  ]

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 dark:bg-indigo-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-violet-200 dark:bg-violet-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader className="text-center pb-2">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }} className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
              {step === "email" && <Mail className="h-8 w-8 text-white" />}
              {step === "otp" && <CheckCircle className="h-8 w-8 text-white" />}
              {step === "details" && <User className="h-8 w-8 text-white" />}
            </motion.div>
            <CardTitle className="text-2xl font-bold">
              {step === "email" && "Create Account"}
              {step === "otp" && "Verify Email"}
              {step === "details" && "Complete Profile"}
            </CardTitle>
            <CardDescription className="mt-1">
              {step === "email" && "Enter your email to get started"}
              {step === "otp" && `Enter the 6-digit code sent to ${email}`}
              {step === "details" && "Fill in your details to complete registration"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center justify-center gap-2 mb-6">
              {[1, 2, 3].map((num) => {
                const isActive = (num === 1 && step === "email") || (num === 2 && step === "otp") || (num === 3 && step === "details")
                const isComplete = (num === 1 && step !== "email") || (num === 2 && step === "details")
                return (
                  <div key={num} className="flex items-center">
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: isActive ? 1.1 : 1 }} className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${isComplete ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg" : isActive ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg" : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"}`}>
                      {isComplete ? "✓" : num}
                    </motion.div>
                    {num < 3 && <div className={`w-12 h-1 mx-1 rounded-full transition-all duration-300 ${(num === 1 && step !== "email") || (num === 2 && step === "details") ? "bg-gradient-to-r from-emerald-500 to-teal-600" : "bg-slate-200 dark:bg-slate-700"}`} />}
                  </div>
                )
              })}
            </div>

            {error && <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm rounded-xl border border-red-200 dark:border-red-800 flex items-center gap-2 mb-4"><div className="w-2 h-2 bg-red-500 rounded-full" />{error}</motion.div>}

            <AnimatePresence mode="wait">
              {step === "email" && (
                <motion.form key="email" variants={stepVariants} initial="initial" animate="animate" exit="exit" onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400" />Email Address</label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="h-12 rounded-xl" />
                  </div>
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button type="submit" className="w-full h-12 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg rounded-xl font-medium" disabled={loading}>
                      {loading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <>Send Verification Code<ArrowRight className="ml-2 h-4 w-4" /></>}
                    </Button>
                  </motion.div>
                </motion.form>
              )}

              {step === "otp" && (
                <motion.form key="otp" variants={stepVariants} initial="initial" animate="animate" exit="exit" onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Verification Code</label>
                    <Input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" required maxLength={6} className="h-14 text-center text-2xl tracking-[0.5em] font-mono rounded-xl" />
                  </div>
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button type="submit" className="w-full h-12 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg rounded-xl font-medium" disabled={loading || otp.length !== 6}>
                      {loading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <>Verify Code<ArrowRight className="ml-2 h-4 w-4" /></>}
                    </Button>
                  </motion.div>
                  <div className="flex items-center justify-between text-sm">
                    <button type="button" onClick={() => setStep("email")} className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Change email</button>
                    <button type="button" onClick={handleResendOtp} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium" disabled={loading}>Resend code</button>
                  </div>
                </motion.form>
              )}

              {step === "details" && (
                <motion.form key="details" variants={stepVariants} initial="initial" animate="animate" exit="exit" onSubmit={handleRegister} className="space-y-4">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-sm rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-2"><CheckCircle className="h-4 w-4" />Email verified: {email}</div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"><User className="h-4 w-4 text-slate-400" />Full Name</label>
                    <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"><Lock className="h-4 w-4 text-slate-400" />Password</label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"><Lock className="h-4 w-4 text-slate-400" />Confirm Password</label>
                    <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="h-12 rounded-xl" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">Select Your Role</label>
                    <div className="grid grid-cols-3 gap-2">
                      {roles.map((r) => {
                        const Icon = r.icon
                        return (
                          <motion.button key={r.id} type="button" onClick={() => setRole(r.id)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`p-4 rounded-xl border-2 transition-all ${role === r.id ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-lg" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"}`}>
                            <div className={`w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center ${role === r.id ? `bg-gradient-to-br ${r.gradient}` : "bg-slate-100 dark:bg-slate-700"}`}>
                              <Icon className={`h-5 w-5 ${role === r.id ? "text-white" : "text-slate-500 dark:text-slate-400"}`} />
                            </div>
                            <p className={`text-xs font-semibold ${role === r.id ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300"}`}>{r.label}</p>
                          </motion.button>
                        )
                      })}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center">{roles.find(r => r.id === role)?.description}</p>
                  </div>
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button type="submit" className="w-full h-12 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg rounded-xl font-medium" disabled={loading}>
                      {loading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <>Create Account<ArrowRight className="ml-2 h-4 w-4" /></>}
                    </Button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">Already have an account?{" "}<Link href="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium hover:underline">Sign in</Link></p>
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <Link href="/"><motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}><Button variant="outline" className="w-full h-11 rounded-xl"><Home className="h-4 w-4 mr-2" />Back to Home</Button></motion.div></Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
