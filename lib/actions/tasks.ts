"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export type Task = {
  id: string
  title: string
  description: string | null
  status: "todo" | "in_progress" | "completed"
  priority: "low" | "medium" | "high" | "urgent"
  due_date: string | null
  assigned_to: string | null
  created_by: string
  created_at: string
  updated_at: string
  completed_at: string | null
  profiles?: {
    full_name: string | null
    email: string
  }
}

export async function createTask(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const priority = formData.get("priority") as "low" | "medium" | "high" | "urgent"
  const due_date = formData.get("due_date") as string

  const { error } = await supabase.from("tasks").insert({
    title,
    description: description || null,
    priority,
    due_date: due_date || null,
    created_by: user.id,
    assigned_to: user.id, // Self-assign by default
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard")
}

export async function updateTask(taskId: string, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const status = formData.get("status") as "todo" | "in_progress" | "completed"
  const priority = formData.get("priority") as "low" | "medium" | "high" | "urgent"
  const due_date = formData.get("due_date") as string

  const { error } = await supabase
    .from("tasks")
    .update({
      title,
      description: description || null,
      status,
      priority,
      due_date: due_date || null,
    })
    .eq("id", taskId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard")
}

export async function updateTaskStatus(taskId: string, status: "todo" | "in_progress" | "completed") {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { error } = await supabase.from("tasks").update({ status }).eq("id", taskId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard")
}

export async function deleteTask(taskId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { error } = await supabase.from("tasks").delete().eq("id", taskId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard")
}

export async function getTasks() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: tasks, error } = await supabase
    .from("tasks")
    .select(
      `
      *,
      profiles:assigned_to (
        full_name,
        email
      )
    `,
    )
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return tasks as Task[]
}
