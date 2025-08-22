"use client"

import { useState, useMemo } from "react"
import { TaskCard } from "./task-card"
import { TaskForm } from "./task-form"
import { TaskFilters } from "./task-filters"
import type { TaskFilters as TaskFiltersType } from "./task-filters"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search } from "lucide-react"
import type { Task } from "@/lib/actions/tasks"

interface TaskListProps {
  tasks: Task[]
}

export function TaskList({ tasks }: TaskListProps) {
  const [filters, setFilters] = useState<TaskFiltersType>({
    search: "",
    status: [],
    priority: [],
    dueDateFrom: null,
    dueDateTo: null,
    sortBy: "created_at",
    sortOrder: "desc",
  })

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) || task.description?.toLowerCase().includes(searchLower),
      )
    }

    // Status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter((task) => filters.status.includes(task.status))
    }

    // Priority filter
    if (filters.priority.length > 0) {
      filtered = filtered.filter((task) => filters.priority.includes(task.priority))
    }

    // Due date filters
    if (filters.dueDateFrom) {
      filtered = filtered.filter((task) => {
        if (!task.due_date) return false
        return new Date(task.due_date) >= filters.dueDateFrom!
      })
    }

    if (filters.dueDateTo) {
      filtered = filtered.filter((task) => {
        if (!task.due_date) return false
        return new Date(task.due_date) <= filters.dueDateTo!
      })
    }

    // Sort tasks
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (filters.sortBy) {
        case "title":
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case "due_date":
          aValue = a.due_date ? new Date(a.due_date).getTime() : 0
          bValue = b.due_date ? new Date(b.due_date).getTime() : 0
          break
        case "priority":
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
          aValue = priorityOrder[a.priority]
          bValue = priorityOrder[b.priority]
          break
        case "created_at":
        default:
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
          break
      }

      if (filters.sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [tasks, filters])

  // Calculate task counts for all tasks (not just filtered)
  const taskCounts = useMemo(
    () => ({
      total: tasks.length,
      todo: tasks.filter((task) => task.status === "todo").length,
      inProgress: tasks.filter((task) => task.status === "in_progress").length,
      completed: tasks.filter((task) => task.status === "completed").length,
    }),
    [tasks],
  )

  // Group filtered tasks by status
  const todoTasks = filteredAndSortedTasks.filter((task) => task.status === "todo")
  const inProgressTasks = filteredAndSortedTasks.filter((task) => task.status === "in_progress")
  const completedTasks = filteredAndSortedTasks.filter((task) => task.status === "completed")

  if (tasks.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardHeader>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-serif">No tasks yet</CardTitle>
          <CardDescription className="text-base max-w-md mx-auto">
            Create your first task to get started with organizing your task-karo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TaskForm />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <TaskFilters filters={filters} onFiltersChange={setFilters} taskCounts={taskCounts} />

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredAndSortedTasks.length} of {tasks.length} tasks
        </p>
        {filteredAndSortedTasks.length === 0 && tasks.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Search className="w-4 h-4" />
            No tasks match your filters
          </div>
        )}
      </div>

      {filteredAndSortedTasks.length === 0 && tasks.length > 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-xl font-serif">No matching tasks</CardTitle>
            <CardDescription className="text-base max-w-md mx-auto">
              Try adjusting your search terms or filters to find what you're looking for.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* To Do Section */}
          {todoTasks.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold font-serif">To Do ({todoTasks.length})</h3>
              </div>
              <div className="grid gap-4">
                {todoTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {/* In Progress Section */}
          {inProgressTasks.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold font-serif">In Progress ({inProgressTasks.length})</h3>
              </div>
              <div className="grid gap-4">
                {inProgressTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {/* Completed Section */}
          {completedTasks.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold font-serif">Completed ({completedTasks.length})</h3>
              </div>
              <div className="grid gap-4">
                {completedTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
