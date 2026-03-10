"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { Brain, TrendingUp, AlertTriangle, CheckCircle, RefreshCw, Users, Clock } from "lucide-react"

interface AIInsightsPanelProps {
  projectId: string
  orgId: string
}

interface WorkloadItem {
  user: {
    _id: string
    name: string
    avatar_url?: string
  }
  task_count: number
  estimated_hours: number
  high_priority_count: number
  in_progress_count: number
  overdue_count: number
  status: 'available' | 'balanced' | 'overloaded'
}

interface ProjectInsights {
  stats: {
    total_tasks: number
    completed: number
    in_progress: number
    blocked: number
    overdue: number
    high_priority_pending: number
    completion_rate: number
  }
  health_score: number
  health_status: 'excellent' | 'good' | 'at_risk' | 'critical'
  insights: string[]
  recommendations: string[]
  bottlenecks?: string[]
}

export function AIInsightsPanel({ projectId, orgId }: AIInsightsPanelProps) {
  const [insights, setInsights] = useState<ProjectInsights | null>(null)
  const [workload, setWorkload] = useState<WorkloadItem[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'insights' | 'workload'>('insights')

  const loadData = async () => {
    setLoading(true)
    try {
      const [insightsRes, workloadRes] = await Promise.all([
        api.getProjectInsights(projectId),
        api.getWorkloadAnalysis(orgId)
      ])
      setInsights(insightsRes.insights)
      setWorkload(workloadRes.workload)
    } catch (error) {
      console.error("Failed to load AI insights:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [projectId, orgId])

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30'
      case 'good': return 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30'
      case 'at_risk': return 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30'
      case 'critical': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
      default: return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800'
    }
  }

  const getWorkloadColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'
      case 'balanced': return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300'
      case 'overloaded': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300'
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h3 className="font-semibold text-slate-900 dark:text-white">AI Insights</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={loadData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'insights' 
              ? 'border-b-2 border-purple-600 text-purple-600 dark:text-purple-400' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <TrendingUp className="h-4 w-4 inline mr-1" />
          Project Health
        </button>
        <button
          onClick={() => setActiveTab('workload')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'workload' 
              ? 'border-b-2 border-purple-600 text-purple-600 dark:text-purple-400' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Users className="h-4 w-4 inline mr-1" />
          Team Workload
        </button>
      </div>

      <div className="p-4 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-slate-400 dark:text-slate-500" />
          </div>
        ) : activeTab === 'insights' && insights ? (
          <div className="space-y-4">
            {/* Health Score */}
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(insights.health_status)}`}>
                {insights.health_score}/100
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">{insights.health_status.replace('_', ' ')}</span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded">
                <div className="text-lg font-semibold text-slate-900 dark:text-white">{insights.stats.completed}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Completed</div>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded">
                <div className="text-lg font-semibold text-slate-900 dark:text-white">{insights.stats.in_progress}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">In Progress</div>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded">
                <div className="text-lg font-semibold text-red-600 dark:text-red-400">{insights.stats.overdue}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Overdue</div>
              </div>
            </div>

            {/* Insights */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1 text-slate-900 dark:text-white">
                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Key Insights
              </h4>
              <ul className="space-y-1">
                {insights.insights.map((insight, i) => (
                  <li key={i} className="text-sm text-slate-600 dark:text-slate-400 pl-5 relative before:content-['•'] before:absolute before:left-1">
                    {insight}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1 text-slate-900 dark:text-white">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                Recommendations
              </h4>
              <ul className="space-y-1">
                {insights.recommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-slate-600 dark:text-slate-400 pl-5 relative before:content-['→'] before:absolute before:left-0">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : activeTab === 'workload' ? (
          <div className="space-y-3">
            {workload.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No team workload data available</p>
            ) : (
              workload.map((item) => (
                <div key={item.user._id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-slate-900 dark:text-white">{item.user.name}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getWorkloadColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {item.task_count} tasks
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.estimated_hours}h estimated
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-amber-500 dark:text-amber-400" />
                      {item.high_priority_count} high priority
                    </div>
                    {item.overdue_count > 0 && (
                      <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                        <AlertTriangle className="h-3 w-3" />
                        {item.overdue_count} overdue
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No data available</p>
        )}
      </div>
    </div>
  )
}
