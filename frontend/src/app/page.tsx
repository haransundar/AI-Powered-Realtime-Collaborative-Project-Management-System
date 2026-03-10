"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/store"
import { Button } from "@/components/ui/button"
import { Layers, Users, Zap, Shield, ArrowRight, Sparkles, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
}

const featureCardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  hover: { y: -8, transition: { duration: 0.3 } }
}

export default function Home() {
  const { isAuthenticated, loadUser } = useStore()
  const router = useRouter()

  useEffect(() => { loadUser() }, [loadUser])
  useEffect(() => { if (isAuthenticated) router.push("/dashboard") }, [isAuthenticated, router])

  const features = [
    { icon: Layers, title: "Multi-Tenant Architecture", description: "Isolated workspaces for each organization with enterprise-grade row-level security", gradient: "from-slate-500 to-slate-700", bgGradient: "from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900" },
    { icon: Users, title: "Real-Time Collaboration", description: "See changes instantly with WebSocket-powered live updates and presence indicators", gradient: "from-emerald-500 to-teal-600", bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20" },
    { icon: Zap, title: "AI-Powered Intelligence", description: "Natural language task creation and smart scheduling powered by advanced AI", gradient: "from-violet-500 to-purple-600", bgGradient: "from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20" },
    { icon: Shield, title: "Fine-Grained Permissions", description: "Organization, project, and task-level access control for complete security", gradient: "from-amber-500 to-orange-600", bgGradient: "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20" }
  ]

  const benefits = ["Unlimited projects and tasks", "Real-time collaboration", "AI-powered suggestions", "Advanced analytics", "Priority support", "Custom integrations"]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.02 }}>
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">AI Project Manager</h1>
          </motion.div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" onClick={() => router.push("/login")}>Sign In</Button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={() => router.push("/register")} className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25">Get Started Free</Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200 dark:bg-indigo-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-200 dark:bg-violet-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />Powered by Advanced AI
              </span>
            </motion.div>
            
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-4xl md:text-6xl font-bold mb-6 text-slate-900 dark:text-white leading-tight">
              Project Management<br />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">Reimagined with AI</span>
            </motion.h2>
            
            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Collaborate in real-time with your team. Create tasks using natural language. Get AI-powered suggestions for scheduling and prioritization.
            </motion.p>
            
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" onClick={() => router.push("/register")} className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-xl shadow-indigo-500/30 px-8 h-12 text-base">
                  Start Free Trial<ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" variant="outline" onClick={() => router.push("/login")} className="px-8 h-12 text-base">Watch Demo</Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-slate-900/50">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Everything you need to succeed</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Powerful features designed to help your team collaborate effectively and deliver projects on time.</p>
            </motion.div>
            
            <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div key={feature.title} variants={featureCardVariants} whileHover="hover" transition={{ duration: 0.4, delay: index * 0.1 }} className={`p-6 rounded-2xl bg-gradient-to-br ${feature.bgGradient} border border-slate-200 dark:border-slate-800 cursor-pointer group`}>
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h4 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">{feature.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
          </div>
          
          <div className="container mx-auto px-4 text-center relative">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to transform your workflow?</h3>
              <p className="text-indigo-100 mb-8 text-lg max-w-xl mx-auto">Join thousands of teams already using AI Project Manager to deliver better results.</p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {benefits.map((benefit, index) => (
                  <motion.div key={benefit} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: index * 0.05 }} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-300" />{benefit}
                  </motion.div>
                ))}
              </div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" onClick={() => router.push("/register")} className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-xl px-8 h-12 text-base font-semibold">
                  Create Free Account<ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">AI Project Manager</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">© 2024 AI Project Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
