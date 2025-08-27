

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, ClipboardList, TrendingUp, AlertTriangle, CheckSquare, Shield } from "lucide-react"
import { UserManagement } from "@/components/admin/user-management"
import { AdminTaskList } from "@/components/admin/admin-task-list"
import { SystemAnalytics } from "@/components/admin/system-analytics"
import { getAllUsers, getAllTasks, getSystemStats } from "@/lib/actions/admin"

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }
  
  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (!profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  // Get admin data
  const [users, tasks, stats] = await Promise.all([getAllUsers(), getAllTasks(), getSystemStats()])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-primary rounded-xl">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-serif">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">System Management & Analytics</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              <Shield className="w-3 h-3 mr-1" />
              Administrator
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* System Overview */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold font-serif mb-6">System Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">{stats.activeUsers} active this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <ClipboardList className="w-4 h-4" />
                    Total Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalTasks}</div>
                  <p className="text-xs text-muted-foreground">{stats.pendingTasks} pending</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completedTasks}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}% completion
                    rate
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Overdue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{stats.overdueeTasks}</div>
                  <p className="text-xs text-muted-foreground">Need attention</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Admin Tabs */}
          <Tabs defaultValue="analytics" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                All Tasks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analytics">
              <SystemAnalytics stats={stats} />
            </TabsContent>

            <TabsContent value="users">
              <UserManagement users={users} />
            </TabsContent>

            <TabsContent value="tasks">
              <AdminTaskList tasks={tasks} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      {/* Footer (natural sticky at bottom) */}
      <footer className="border-t bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-center">
          <p className="text-sm text-muted-foreground text-center">
            Made with <span style={{ color: "red" }}>❤️</span> by Mohsan Nawab
          </p>
        </div>
      </footer>
    </div>
  )
}
