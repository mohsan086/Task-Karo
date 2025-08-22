"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Search, Filter, X, CalendarIcon, SortAsc, SortDesc } from "lucide-react"
import { format } from "date-fns"

export interface TaskFilters {
  search: string
  status: string[]
  priority: string[]
  dueDateFrom: Date | null
  dueDateTo: Date | null
  sortBy: "created_at" | "due_date" | "priority" | "title"
  sortOrder: "asc" | "desc"
}

interface TaskFiltersProps {
  filters: TaskFilters
  onFiltersChange: (filters: TaskFilters) => void
  taskCounts: {
    total: number
    todo: number
    inProgress: number
    completed: number
  }
}

const statusOptions = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
]

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
]

const sortOptions = [
  { value: "created_at", label: "Created Date" },
  { value: "due_date", label: "Due Date" },
  { value: "priority", label: "Priority" },
  { value: "title", label: "Title" },
]

export function TaskFilters({ filters, onFiltersChange, taskCounts }: TaskFiltersProps) {
  const [dueDateFromOpen, setDueDateFromOpen] = useState(false)
  const [dueDateToOpen, setDueDateToOpen] = useState(false)

  const updateFilters = (updates: Partial<TaskFilters>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const toggleStatus = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status]
    updateFilters({ status: newStatus })
  }

  const togglePriority = (priority: string) => {
    const newPriority = filters.priority.includes(priority)
      ? filters.priority.filter((p) => p !== priority)
      : [...filters.priority, priority]
    updateFilters({ priority: newPriority })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      status: [],
      priority: [],
      dueDateFrom: null,
      dueDateTo: null,
      sortBy: "created_at",
      sortOrder: "desc",
    })
  }

  const hasActiveFilters =
    filters.search ||
    filters.status.length > 0 ||
    filters.priority.length > 0 ||
    filters.dueDateFrom ||
    filters.dueDateTo

  return (
    <div className="space-y-4">
      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="pl-10 h-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value as any })}>
            <SelectTrigger className="w-40 h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateFilters({ sortOrder: filters.sortOrder === "asc" ? "desc" : "asc" })}
            className="h-10 w-10 p-0"
          >
            {filters.sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Quick Status Filters */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-muted-foreground">Status:</span>
        {statusOptions.map((option) => (
          <Badge
            key={option.value}
            variant={filters.status.includes(option.value) ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/20"
            onClick={() => toggleStatus(option.value)}
          >
            {option.label}
            {option.value === "todo" && ` (${taskCounts.todo})`}
            {option.value === "in_progress" && ` (${taskCounts.inProgress})`}
            {option.value === "completed" && ` (${taskCounts.completed})`}
          </Badge>
        ))}
      </div>

      {/* Advanced Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Filters:</span>
        </div>

        {/* Priority Filter */}
        <div className="flex flex-wrap gap-1">
          <span className="text-xs text-muted-foreground">Priority:</span>
          {priorityOptions.map((option) => (
            <Badge
              key={option.value}
              variant={filters.priority.includes(option.value) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/20 text-xs"
              onClick={() => togglePriority(option.value)}
            >
              {option.label}
            </Badge>
          ))}
        </div>

        {/* Due Date Filters */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Due:</span>
          <Popover open={dueDateFromOpen} onOpenChange={setDueDateFromOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent">
                <CalendarIcon className="w-3 h-3 mr-1" />
                {filters.dueDateFrom ? format(filters.dueDateFrom, "MMM dd") : "From"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dueDateFrom || undefined}
                onSelect={(date) => {
                  updateFilters({ dueDateFrom: date || null })
                  setDueDateFromOpen(false)
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover open={dueDateToOpen} onOpenChange={setDueDateToOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent">
                <CalendarIcon className="w-3 h-3 mr-1" />
                {filters.dueDateTo ? format(filters.dueDateTo, "MMM dd") : "To"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dueDateTo || undefined}
                onSelect={(date) => {
                  updateFilters({ dueDateTo: date || null })
                  setDueDateToOpen(false)
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
            <X className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {filters.search && (
            <Badge variant="secondary" className="text-xs">
              Search: "{filters.search}"
              <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => updateFilters({ search: "" })} />
            </Badge>
          )}
          {filters.status.map((status) => (
            <Badge key={status} variant="secondary" className="text-xs">
              {statusOptions.find((s) => s.value === status)?.label}
              <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => toggleStatus(status)} />
            </Badge>
          ))}
          {filters.priority.map((priority) => (
            <Badge key={priority} variant="secondary" className="text-xs">
              {priorityOptions.find((p) => p.value === priority)?.label}
              <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => togglePriority(priority)} />
            </Badge>
          ))}
          {filters.dueDateFrom && (
            <Badge variant="secondary" className="text-xs">
              From: {format(filters.dueDateFrom, "MMM dd")}
              <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => updateFilters({ dueDateFrom: null })} />
            </Badge>
          )}
          {filters.dueDateTo && (
            <Badge variant="secondary" className="text-xs">
              To: {format(filters.dueDateTo, "MMM dd")}
              <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => updateFilters({ dueDateTo: null })} />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
