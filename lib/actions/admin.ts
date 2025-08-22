"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export type UserProfile = {
  id: string
  email: string
  full_name: string | null
  role: "user" | "admin"
  created_at: string
  updated_at: string
}

export type SystemStats = {
  totalUsers: number
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  overdueeTasks: number
  activeUsers: number
  tasksByPriority: {
    low: number
    medium: number
    high: number
    urgent: number
  }
  tasksByStatus: {
    todo: number
    in_progress: number
    completed: number
  }
}

export async function checkAdminAccess() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  return user
}

export async function getAllUsers(): Promise<UserProfile[]> {
  await checkAdminAccess()
  const supabase = await createClient()

  const { data: users, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return users as UserProfile[]
}

export async function updateUserRole(userId: string, role: "user" | "admin") {
  await checkAdminAccess()
  const supabase = await createClient()

  const { error } = await supabase.from("profiles").update({ role }).eq("id", userId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/admin")
}

export async function getAllTasks() {
  await checkAdminAccess()
  const supabase = await createClient()

  const { data: tasks, error } = await supabase
    .from("tasks")
    .select(
      `
      *,
      profiles:created_by (
        full_name,
        email
      ),
      assigned_profiles:assigned_to (
        full_name,
        email
      )
    `,
    )
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return tasks
}

export async function getSystemStats(): Promise<SystemStats> {
  await checkAdminAccess()
  const supabase = await createClient()

  // Get user count
  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  // Get task statistics
  const { data: tasks } = await supabase.from("tasks").select("status, priority, due_date, created_at")

  const totalTasks = tasks?.length || 0
  const completedTasks = tasks?.filter((task) => task.status === "completed").length || 0
  const pendingTasks = totalTasks - completedTasks

  // Calculate overdue tasks
  const now = new Date()
  const overdueeTasks =
    tasks?.filter((task) => task.due_date && new Date(task.due_date) < now && task.status !== "completed").length || 0

  // Calculate active users (users who created tasks in the last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const recentTasks = tasks?.filter((task) => new Date(task.created_at) > thirtyDaysAgo) || []
  const activeUserIds = new Set(recentTasks.map((task) => task.created_by))
  const activeUsers = activeUserIds.size

  // Task counts by priority
  const tasksByPriority = {
    low: tasks?.filter((task) => task.priority === "low").length || 0,
    medium: tasks?.filter((task) => task.priority === "medium").length || 0,
    high: tasks?.filter((task) => task.priority === "high").length || 0,
    urgent: tasks?.filter((task) => task.priority === "urgent").length || 0,
  }

  // Task counts by status
  const tasksByStatus = {
    todo: tasks?.filter((task) => task.status === "todo").length || 0,
    in_progress: tasks?.filter((task) => task.status === "in_progress").length || 0,
    completed: tasks?.filter((task) => task.status === "completed").length || 0,
  }

  return {
    totalUsers: totalUsers || 0,
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueeTasks,
    activeUsers,
    tasksByPriority,
    tasksByStatus,
  }
}

export async function deleteUser(userId: string) {
  await checkAdminAccess()
  const supabase = await createClient()

  // First delete the user's tasks
  await supabase.from("tasks").delete().eq("created_by", userId)

  // Then delete the profile (this will cascade to auth.users)
  const { error } = await supabase.from("profiles").delete().eq("id", userId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/admin")
}
