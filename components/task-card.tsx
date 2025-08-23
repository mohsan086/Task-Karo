"use client"

import { useState, useOptimistic, startTransition } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Calendar,
  Clock,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  Circle,
  PlayCircle,
  AlertTriangle,
} from "lucide-react"
import { updateTaskStatus, deleteTask } from "@/lib/actions/tasks"
import { TaskForm } from "./task-form"
import type { Task } from "@/lib/actions/tasks"

interface TaskCardProps {
  task: Task
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
  medium:
    "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
  high: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800",
  urgent: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
}

const statusIcons = {
  todo: Circle,
  in_progress: PlayCircle,
  completed: CheckCircle,
}

const statusColors = {
  todo: "text-muted-foreground hover:text-blue-600",
  in_progress: "text-blue-600 hover:text-green-600",
  completed: "text-green-600 hover:text-muted-foreground",
}

export function TaskCard({ task }: TaskCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const [optimisticTask, updateOptimisticTask] = useOptimistic(
    task,
    (currentTask, newStatus: "todo" | "in_progress" | "completed") => ({
      ...currentTask,
      status: newStatus,
    }),
  )

  const StatusIcon = statusIcons[optimisticTask.status]

  const handleStatusChange = async (status: "todo" | "in_progress" | "completed") => {
    setIsLoading(true)

    startTransition(() => {
      updateOptimisticTask(status)
    })

    try {
      await updateTaskStatus(task.id, status)
    } catch (error) {
      console.error("Error updating task status:", error)
      startTransition(() => {
        updateOptimisticTask(task.status)
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await deleteTask(task.id)
    } catch (error) {
      console.error("Error deleting task:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && optimisticTask.status !== "completed"
  const isDueSoon =
    task.due_date &&
    new Date(task.due_date) < new Date(Date.now() + 24 * 60 * 60 * 1000) &&
    optimisticTask.status !== "completed"

  return (
    <Card
      className={`group hover:shadow-md transition-all duration-200 ${isOverdue ? "border-destructive/50 bg-destructive/5" : ""}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              className={`p-0 h-6 w-6 transition-colors ${statusColors[optimisticTask.status]}`}
              onClick={() => {
                const nextStatus =
                  optimisticTask.status === "todo"
                    ? "in_progress"
                    : optimisticTask.status === "in_progress"
                      ? "completed"
                      : "todo"
                handleStatusChange(nextStatus)
              }}
              disabled={isLoading}
            >
              <StatusIcon className="w-5 h-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h3
                className={`font-medium leading-tight ${optimisticTask.status === "completed" ? "line-through text-muted-foreground" : ""}`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <TaskForm
                task={task}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                }
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Task</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{task.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={priorityColors[task.priority]}>
              {task.priority}
            </Badge>
            {task.due_date && (
              <div
                className={`flex items-center gap-1 text-xs ${
                  isOverdue
                    ? "text-destructive font-medium"
                    : isDueSoon
                      ? "text-orange-600 font-medium"
                      : "text-muted-foreground"
                }`}
              >
                {isOverdue && <AlertTriangle className="w-3 h-3" />}
                <Calendar className="w-3 h-3" />
                {formatDateTime(task.due_date)}
                {isOverdue && <span className="text-xs">(Overdue)</span>}
                {isDueSoon && !isOverdue && <span className="text-xs">(Due Soon)</span>}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {formatDate(task.created_at)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
