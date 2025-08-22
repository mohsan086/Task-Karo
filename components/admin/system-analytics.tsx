"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Users, ClipboardList, CheckCircle, AlertTriangle } from "lucide-react"
import type { SystemStats } from "@/lib/actions/admin"

interface SystemAnalyticsProps {
  stats: SystemStats
}

const PRIORITY_COLORS = {
  urgent: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#3b82f6",
}

const STATUS_COLORS = {
  todo: "#6b7280",
  in_progress: "#3b82f6",
  completed: "#10b981",
}

export function SystemAnalytics({ stats }: SystemAnalyticsProps) {
  const priorityData = Object.entries(stats.tasksByPriority).map(([priority, count]) => ({
    name: priority.charAt(0).toUpperCase() + priority.slice(1),
    value: count,
    color: PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS],
  }))

  const statusData = Object.entries(stats.tasksByStatus).map(([status, count]) => ({
    name: status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    value: count,
    color: STATUS_COLORS[status as keyof typeof STATUS_COLORS],
  }))

  const completionRate = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              User Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}% of total users
            </p>
            <Progress
              value={stats.totalUsers > 0 ? (stats.activeUsers / stats.totalUsers) * 100 : 0}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(completionRate)}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedTasks} of {stats.totalTasks} tasks
            </p>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Task Velocity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tasksByStatus.in_progress}</div>
            <p className="text-xs text-muted-foreground">Tasks in progress</p>
            <div className="flex gap-1 mt-2">
              <Badge variant="outline" className="text-xs">
                {stats.tasksByStatus.todo} pending
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Attention Needed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.overdueeTasks}</div>
            <p className="text-xs text-muted-foreground">Overdue tasks</p>
            <div className="flex gap-1 mt-2">
              <Badge variant="outline" className="text-xs">
                {stats.tasksByPriority.urgent} urgent
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Tasks by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Tasks by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(stats.tasksByPriority).map(([priority, count]) => (
              <div key={priority} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] }}
                  />
                  <span className="capitalize">{priority}</span>
                </div>
                <Badge variant="outline">{count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(stats.tasksByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: STATUS_COLORS[status as keyof typeof STATUS_COLORS] }}
                  />
                  <span className="capitalize">{status.replace("_", " ")}</span>
                </div>
                <Badge variant="outline">{count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">System Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Active Users</span>
              <Badge variant={stats.activeUsers > 0 ? "default" : "secondary"}>
                {stats.activeUsers > 0 ? "Healthy" : "Low"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Task Completion</span>
              <Badge variant={completionRate > 50 ? "default" : "secondary"}>
                {completionRate > 50 ? "Good" : "Needs Attention"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Overdue Tasks</span>
              <Badge variant={stats.overdueeTasks === 0 ? "default" : "destructive"}>
                {stats.overdueeTasks === 0 ? "None" : `${stats.overdueeTasks} Overdue`}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
