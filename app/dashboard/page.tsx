import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, User, LogOut, TrendingUp, Clock, CheckSquare, Settings } from "lucide-react"
import { TaskForm } from "@/components/task-form"
import { TaskList } from "@/components/task-list"
import { getTasks } from "@/lib/actions/tasks"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user profile and tasks
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  const tasks = await getTasks()

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/auth/login")
  }

  // Calculate stats
  const totalTasks = tasks.length
  const inProgressTasks = tasks.filter((task) => task.status === "in_progress").length
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-primary rounded-xl">
                <CheckCircle className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-serif">Task-Karo</h1>
                <p className="text-sm text-muted-foreground">Task Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4" />
                <span>{profile?.full_name || user.email}</span>
                {profile?.role === "admin" && (
                  <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">Admin</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {profile?.role === "admin" && (
                  <Button asChild variant="outline" size="sm">
                    <Link href="/admin">
                      <Settings className="w-4 h-4 mr-2" />
                      Admin
                    </Link>
                  </Button>
                )}
                <form action={handleSignOut}>
                  <Button variant="outline" size="sm" type="submit">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold font-serif mb-2">
                Welcome back, {profile?.full_name?.split(" ")[0] || "User"}!
              </h2>
              <p className="text-muted-foreground">
                {totalTasks === 0
                  ? "Ready to create your first task?"
                  : `You have ${inProgressTasks} tasks in progress and ${completedTasks} completed.`}
              </p>
            </div>
            <TaskForm />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  Total Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTasks}</div>
                <p className="text-xs text-muted-foreground">{totalTasks === 0 ? "Get started!" : "Keep it up!"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  In Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inProgressTasks}</div>
                <p className="text-xs text-muted-foreground">
                  {inProgressTasks === 0 ? "Ready to start" : "Stay focused"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedTasks}</div>
                <p className="text-xs text-muted-foreground">
                  {completedTasks === 0 ? "First one coming!" : "Great progress!"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  {completionRate === 0 ? "Just getting started" : completionRate === 100 ? "Perfect!" : "Keep going!"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Task List */}
          <TaskList tasks={tasks} />
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
