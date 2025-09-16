"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  CalendarIcon,
  Clock,
  Star,
  Send as Sync,
  Database,
  X,
} from "lucide-react"
import { Calendar } from "lucide-react"
import { format, isSameDay } from "date-fns"
import { ja } from "date-fns/locale"

const staffMembers = [
  { id: "1", name: "田中太郎", color: "#3b82f6" },
  { id: "2", name: "佐藤花子", color: "#22c55e" },
  { id: "3", name: "鈴木一郎", color: "#f97316" },
  { id: "4", name: "高橋美咲", color: "#8b5cf6" },
  { id: "5", name: "山田健太", color: "#ef4444" },
]

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedStaff, setSelectedStaff] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [viewMode, setViewMode] = useState<"month" | "day">("month")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [newProject, setNewProject] = useState<any>({})
  const [draggedProject, setDraggedProject] = useState<any>(null)
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null)
  const currentYear = currentDate.getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i)
  const [selectedProjects, setSelectedProjects] = useState<any[]>([])

  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null)
  const [quickEditData, setQuickEditData] = useState<any>(null)

  const handleEditProject = (project: any) => {
    console.log("[v0] Opening edit dialog for project:", project.id)
    setEditingProject({ ...project })
    setIsEditDialogOpen(true)
  }

  const startInlineEdit = (project: any) => {
    console.log("[v0] Starting inline edit for project:", project.id)
    setInlineEditingId(project.id)
    setQuickEditData({ ...project })
  }

  const saveInlineEdit = async () => {
    if (!quickEditData || !inlineEditingId) return

    console.log("[v0] Saving inline edit:", quickEditData)
    const updatedProjects = projects.map((p) => (p.id === inlineEditingId ? { ...p, ...quickEditData } : p))
    setProjects(updatedProjects)
    localStorage.setItem("projects", JSON.stringify(updatedProjects))

    await syncWithFileMaker()
    setInlineEditingId(null)
    setQuickEditData(null)
  }

  const cancelInlineEdit = () => {
    setInlineEditingId(null)
    setQuickEditData(null)
  }

  useEffect(() => {
    const savedProjects = localStorage.getItem("projects")
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects))
      } catch (error) {
        console.error("Failed to load projects:", error)
      }
    }
  }, [])

  const getTodayStartingProjects = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return filteredProjects.filter((project) => {
      if (project.workPeriodStart) {
        const startDate = new Date(project.workPeriodStart)
        startDate.setHours(0, 0, 0, 0)
        return startDate.getTime() === today.getTime()
      }
      return false
    })
  }

  const isProjectStartDate = (date: Date | null, project: any) => {
    if (!date || !project.workPeriodStart) return false

    const startDate = new Date(project.workPeriodStart)
    const checkDate = new Date(date)

    startDate.setHours(0, 0, 0, 0)
    checkDate.setHours(0, 0, 0, 0)

    return startDate.getTime() === checkDate.getTime()
  }

  const syncWithFileMaker = async () => {
    setIsSyncing(true)
    try {
      // Simulate API call to FileMaker
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Here you would implement actual FileMaker API calls
      console.log("[v0] Syncing with FileMaker...")

      // Update projects with FileMaker data
      // const response = await fetch('/api/filemaker/sync', { method: 'POST' })
      // const updatedProjects = await response.json()
      // setProjects(updatedProjects)
    } catch (error) {
      console.error("FileMaker sync failed:", error)
    } finally {
      setIsSyncing(false)
    }
  }

  const saveProjectChanges = async (updatedProject: any) => {
    const updatedProjects = projects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    setProjects(updatedProjects)
    localStorage.setItem("projects", JSON.stringify(updatedProjects))

    // Sync with FileMaker
    await syncWithFileMaker()
    setIsEditDialogOpen(false)
    setEditingProject(null)
  }

  const handleCreateNewProject = () => {
    if (!selectedDate) return

    const newProjectData = {
      id: Date.now().toString(),
      siteName: newProject.siteName || "",
      workContent: newProject.workContent || "",
      contractor: newProject.contractor || "",
      estimateNumber: newProject.estimateNumber || "",
      workPeriodStart: selectedDate.toISOString().split("T")[0],
      workPeriodEnd: newProject.workPeriodEnd || selectedDate.toISOString().split("T")[0],
      workStartTime: newProject.workStartTime || "",
      workEndTime: newProject.workEndTime || "",
      selectedStaff: newProject.selectedStaff || [],
      remarks: newProject.remarks || "",
      showInGlobalCalendar: newProject.showInGlobalCalendar !== false,
      constructionPeriodStart: newProject.constructionPeriodStart || "",
      constructionPeriodEnd: newProject.constructionPeriodEnd || "",
    }

    const updatedProjects = [...projects, newProjectData]
    setProjects(updatedProjects)
    localStorage.setItem("projects", JSON.stringify(updatedProjects))

    // Reset form and close dialog
    setNewProject({})
    setIsCreatingNew(false)
    setIsDialogOpen(false)

    // Sync with FileMaker
    syncWithFileMaker()
  }

  const handleDragStart = (e: React.DragEvent, project: any) => {
    setDraggedProject(project)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", project.id)
  }

  const handleDragOver = (e: React.DragEvent, target: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverTarget(target)
  }

  const handleDragLeave = () => {
    setDragOverTarget(null)
  }

  const handleDrop = (e: React.DragEvent, dropTarget: { type: "date" | "time"; date?: Date; hour?: number }) => {
    e.preventDefault()
    setDragOverTarget(null)

    if (!draggedProject) return

    const updatedProject = { ...draggedProject }

    if (dropTarget.type === "date" && dropTarget.date) {
      // 月表示での日付変更
      const originalStart = new Date(draggedProject.workPeriodStart)
      const originalEnd = new Date(draggedProject.workPeriodEnd)
      const daysDiff = Math.ceil((originalEnd.getTime() - originalStart.getTime()) / (1000 * 60 * 60 * 24))

      updatedProject.workPeriodStart = dropTarget.date.toISOString().split("T")[0]
      const newEndDate = new Date(dropTarget.date)
      newEndDate.setDate(newEndDate.getDate() + daysDiff)
      updatedProject.workPeriodEnd = newEndDate.toISOString().split("T")[0]
    } else if (dropTarget.type === "time" && dropTarget.hour !== undefined) {
      // 日表示での時間変更
      const startHour = dropTarget.hour
      const originalDuration =
        draggedProject.workEndTime && draggedProject.workStartTime
          ? Number.parseInt(draggedProject.workEndTime.split(":")[0]) -
            Number.parseInt(draggedProject.workStartTime.split(":")[0])
          : 1

      updatedProject.workStartTime = `${startHour.toString().padStart(2, "0")}:00`
      updatedProject.workEndTime = `${(startHour + originalDuration).toString().padStart(2, "0")}:00`
    }

    // プロジェクトを更新
    const updatedProjects = projects.map((p) => (p.id === draggedProject.id ? updatedProject : p))
    setProjects(updatedProjects)
    localStorage.setItem("projects", JSON.stringify(updatedProjects))

    // FileMakerと同期
    syncWithFileMaker()
    setDraggedProject(null)
  }

  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }, [currentDate])

  const filteredProjects = useMemo(() => {
    let filtered = projects

    if (selectedStaff !== "all") {
      filtered = filtered.filter((project) => project.selectedStaff && project.selectedStaff.includes(selectedStaff))
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.siteName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.workContent?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.contractor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.estimateNumber?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return filtered
  }, [selectedStaff, searchQuery, projects])

  const getProjectsForDate = (date: Date | null) => {
    if (!date) return []

    return filteredProjects.filter((project) => {
      if (project.workPeriodStart && project.workPeriodEnd) {
        const startDate = new Date(project.workPeriodStart)
        const endDate = new Date(project.workPeriodEnd)
        const checkDate = new Date(date)

        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(0, 0, 0, 0)
        checkDate.setHours(0, 0, 0, 0)

        return checkDate >= startDate && checkDate <= endDate
      }
      return false
    })
  }

  const getProjectPeriodInfo = (date: Date, project: any) => {
    if (!project.workPeriodStart || !project.workPeriodEnd) return null

    const startDate = new Date(project.workPeriodStart)
    const endDate = new Date(project.workPeriodEnd)
    const checkDate = new Date(date)

    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(0, 0, 0, 0)
    checkDate.setHours(0, 0, 0, 0)

    if (checkDate.getTime() === startDate.getTime() && checkDate.getTime() === endDate.getTime()) {
      return "single"
    } else if (checkDate.getTime() === startDate.getTime()) {
      return "start"
    } else if (checkDate.getTime() === endDate.getTime()) {
      return "end"
    } else if (checkDate >= startDate && checkDate <= endDate) {
      return "middle"
    }

    return null
  }

  const changeMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const changeYear = (year: string) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setFullYear(Number.parseInt(year))
      return newDate
    })
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setIsDialogOpen(true)
    setEditingProject(null)
    setIsCreatingNew(false)
    setNewProject({})
  }

  const startNewProjectCreation = () => {
    setIsCreatingNew(true)
    setNewProject({
      workPeriodStart: selectedDate?.toISOString().split("T")[0] || "",
      workPeriodEnd: selectedDate?.toISOString().split("T")[0] || "",
      selectedStaff: [],
      showInGlobalCalendar: true,
    })
  }

  const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"]

  const DayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const dayProjects = getProjectsForDate(currentDate)

    return (
      <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-secondary/10">
        <CardHeader className="bg-primary text-primary-foreground p-3 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
            {currentDate.toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
            })}{" "}
            - 時間別表示
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-4">
          <div className="space-y-1">
            {hours.map((hour) => {
              const timeSlotProjects = dayProjects.filter((project) => {
                if (project.workStartTime && project.workEndTime) {
                  const startHour = Number.parseInt(project.workStartTime.split(":")[0])
                  const endHour = Number.parseInt(project.workEndTime.split(":")[0])
                  return hour >= startHour && hour <= endHour
                }
                return false
              })

              return (
                <div
                  key={hour}
                  className={`flex border-b border-border/50 transition-colors ${
                    dragOverTarget === `time-${hour}` ? "bg-primary/20 border-primary" : ""
                  }`}
                  onDragOver={(e) => handleDragOver(e, `time-${hour}`)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, { type: "time", hour })}
                >
                  <div className="w-16 sm:w-20 p-2 text-xs sm:text-sm font-medium text-muted-foreground border-r border-border/50">
                    {hour.toString().padStart(2, "0")}:00
                  </div>
                  <div className="flex-1 p-2 min-h-[40px] sm:min-h-[50px]">
                    {timeSlotProjects.map((project) => {
                      const assignedStaff = project.selectedStaff || []

                      return (
                        <div
                          key={project.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, project)}
                          className="mb-1 p-2 rounded-lg border-l-4 bg-secondary/50 hover:bg-secondary/70 cursor-move transition-all duration-200"
                          style={{
                            borderLeftColor:
                              assignedStaff.length > 0
                                ? staffMembers.find((s) => assignedStaff.includes(s.id))?.color || "#164e63"
                                : "#164e63",
                          }}
                          onClick={() => handleEditProject(project)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-xs sm:text-sm text-foreground">{project.siteName}</div>
                              <div className="text-xs text-muted-foreground">
                                {project.workStartTime} - {project.workEndTime}
                              </div>
                              <div className="text-xs text-muted-foreground">{project.workContent}</div>
                            </div>
                            <div className="flex gap-1 ml-2">
                              {assignedStaff.map((staffId) => {
                                const staff = staffMembers.find((s) => s.id === staffId)
                                return staff ? (
                                  <div
                                    key={staffId}
                                    className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-white"
                                    style={{ backgroundColor: staff.color }}
                                    title={staff.name}
                                  />
                                ) : null
                              })}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("この案件を削除してもよろしいですか？")) {
      return
    }

    try {
      // Remove from local storage
      const existingProjects = JSON.parse(localStorage.getItem("projects") || "[]")
      const updatedProjects = existingProjects.filter((p: any) => p.id !== projectId)
      localStorage.setItem("projects", JSON.stringify(updatedProjects))

      // Update state
      setProjects(updatedProjects)

      // Sync with FileMaker
      await syncWithFileMaker()

      // Close dialog
      setSelectedDate(null)
      setSelectedProjects([])
    } catch (error) {
      console.error("削除エラー:", error)
      alert("削除に失敗しました。")
    }
  }

  const filteredStaffMembers = useMemo(() => {
    if (selectedStaff === "all") {
      return staffMembers
    }
    return staffMembers.filter(staff => staff.id === selectedStaff)
  }, [selectedStaff])

  const filteredTodayProjects = useMemo(() => {
    const todayStr = format(selectedDate, "yyyy-MM-dd")
    let todayProjects = filteredProjects.filter((project) => {
      const startDate = format(new Date(project.workPeriodStart), "yyyy-MM-dd")
      return startDate === todayStr
    })
    
    if (selectedStaff !== "all") {
      todayProjects = todayProjects.filter(project => 
        project.selectedStaff && project.selectedStaff.includes(selectedStaff)
      )
    }
    
    return todayProjects
  }, [filteredProjects, selectedDate, selectedStaff])

  const handleProjectClick = (project: any) => {
    setEditingProject(project)
    setIsEditDialogOpen(true)
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="outline" size="sm" onClick={() => changeMonth("prev")} className="h-8 w-8 sm:h-10 sm:w-10">
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>

            <div className="flex items-center gap-1 sm:gap-2">
              <Select value={currentYear.toString()} onValueChange={changeYear}>
                <SelectTrigger className="w-16 sm:w-20 h-8 sm:h-10 text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}年
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <h2 className="text-lg sm:text-xl font-bold text-primary min-w-[50px] sm:min-w-[60px] text-center">
                {monthNames[currentDate.getMonth()]}
              </h2>
            </div>

            <Button variant="outline" size="sm" onClick={() => changeMonth("next")} className="h-8 w-8 sm:h-10 sm:w-10">
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>

          <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-2 sm:gap-3 w-full xl:w-auto">
            <div className="flex gap-1 bg-muted p-1 rounded-lg">
              <Button
                variant={viewMode === "month" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("month")}
                className="h-8 px-3 text-xs hover:bg-primary/10 transition-colors"
              >
                <CalendarIcon className="h-3 w-3 mr-1" />
                月表示
              </Button>
              <Button
                variant={viewMode === "day" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("day")}
                className="h-8 px-3 text-xs hover:bg-primary/10 transition-colors"
              >
                <Clock className="h-3 w-3 mr-1" />
                日表示
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={syncWithFileMaker}
              disabled={isSyncing}
              className="h-8 px-3 text-xs bg-transparent hover:bg-primary/10 transition-colors"
            >
              <Sync className={`h-3 w-3 mr-1 ${isSyncing ? "animate-spin" : ""}`} />
              {isSyncing ? "同期中..." : "FileMaker同期"}
            </Button>

            <div className="relative flex-1 xl:w-64 2xl:w-80">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="現場名、作業内容で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 sm:pl-10 h-8 sm:h-10 text-xs sm:text-sm border-2 focus:border-primary transition-colors"
              />
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <Filter className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger className="w-full sm:w-40 xl:w-48 2xl:w-56 h-8 sm:h-10 text-xs sm:text-sm">
                  <SelectValue placeholder="担当者を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全担当者</SelectItem>
                  {staffMembers.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full" style={{ backgroundColor: staff.color }} />
                        <span className="text-xs sm:text-sm">{staff.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Updated header to show individual staff name when filtered */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-800" />
          <h2 className="text-lg sm:text-xl xl:text-2xl font-bold text-cyan-800">
            {selectedStaff === "all" ? "案件・スケジュール管理" : 
             `${staffMembers.find(s => s.id === selectedStaff)?.name || ""}のスケジュール`}
          </h2>
        </div>

      {viewMode === "month" ? (
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 bg-slate-100 rounded-lg p-1 sm:p-2">
          {["日", "月", "火", "水", "木", "金", "土"].map((day, index) => (
            <div key={day} className={`text-center py-1 sm:py-2 text-xs sm:text-sm font-medium ${
              index === 0 ? "text-red-600" : index === 6 ? "text-blue-600" : "text-slate-700"
            }`}>
              {day}
            </div>
          ))}
          {monthDays.map((day, index) => {
            const dayProjects = getProjectsForDate(day)
            const isToday = day && isSameDay(day, new Date())
            const isSelected = day && isSameDay(day, selectedDate)
            
            return (
              <div
                key={index}
                className={`min-h-[60px] sm:min-h-[80px] md:min-h-[100px] p-1 sm:p-2 border border-slate-200 cursor-pointer transition-all hover:bg-slate-50 ${
                  !day ? "bg-slate-50" : isToday ? "bg-cyan-50 border-cyan-300" : isSelected ? "bg-cyan-100 border-cyan-400" : "bg-white"
                }`}
                onClick={() => day && handleDateClick(day)}
              >
                {day && (
                  <>
                    <div className={`text-xs sm:text-sm font-medium mb-1 ${
                      isToday ? "text-cyan-800 font-bold" : "text-slate-700"
                    }`}>
                      {format(day, "d")}
                    </div>
                    
                    <div className="space-y-0.5 sm:space-y-1">
                      {dayProjects.slice(0, 3).map((project) => {
                        const projectStaff = project.selectedStaff
                          ?.map((id) => staffMembers.find((s) => s.id === id))
                          .filter(Boolean) || []
                        
                        const displayStaff = selectedStaff === "all" 
                          ? projectStaff 
                          : projectStaff.filter(staff => staff?.id === selectedStaff)
                        
                        return displayStaff.map((staff) => (
                          <div
                            key={`${project.id}-${staff?.id}`}
                            className="text-[10px] sm:text-xs p-1 rounded truncate shadow-sm border-l-2 bg-white/90"
                            style={{ 
                              borderLeftColor: staff?.color,
                              backgroundColor: `${staff?.color}15`
                            }}
                            title={`${project.siteName} - ${staff?.name}${project.workStartTime ? ` (${project.workStartTime}-)` : ''}`}
                          >
                            <div className="font-medium truncate">{project.siteName}</div>
                            {project.workStartTime && (
                              <div className="text-[9px] sm:text-[10px] text-slate-600 mt-0.5">
                                {project.workStartTime}〜
                              </div>
                            )}
                          </div>
                        ))
                      })}
                      
                      {dayProjects.length > 3 && (
                        <div className="text-[9px] sm:text-[10px] text-slate-500 text-center py-0.5">
                          +{dayProjects.length - 3}件
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white p-3 sm:p-4">
            <h3 className="text-lg sm:text-xl font-bold">
              {format(selectedDate, "yyyy年M月d日(E)", { locale: ja })}
              {selectedStaff !== "all" && (
                <span className="ml-2 text-sm opacity-90">
                  - {staffMembers.find(s => s.id === selectedStaff)?.name}
                </span>
              )}
            </h3>
          </div>
          
          <div className="flex">
            <div className="w-12 sm:w-16 bg-slate-50 border-r border-slate-200">
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="h-12 sm:h-16 border-b border-slate-200 flex items-start justify-center pt-1">
                  <span className="text-[10px] sm:text-xs text-slate-600 font-medium">
                    {i.toString().padStart(2, '0')}:00
                  </span>
                </div>
              ))}
            </div>
            
            <div className="flex-1 relative">
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="h-12 sm:h-16 border-b border-slate-200 relative">
                  {/* Hour line */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-slate-200" />
                </div>
              ))}
              
              {getProjectsForDate(selectedDate).map((project) => {
                const projectStaff = project.selectedStaff
                  ?.map((id) => staffMembers.find((s) => s.id === id))
                  .filter(Boolean) || []
                
                const displayStaff = selectedStaff === "all" 
                  ? projectStaff 
                  : projectStaff.filter(staff => staff?.id === selectedStaff)
                
                return displayStaff.map((staff, staffIndex) => {
                  let topPosition = 0
                  let height = 48 // Default height for all-day events
                  
                  if (project.workStartTime) {
                    const [startHour, startMinute] = project.workStartTime.split(':').map(Number)
                    topPosition = (startHour * 48) + (startMinute * 48 / 60) // 48px per hour on mobile, 64px on desktop
                    
                    if (project.workEndTime) {
                      const [endHour, endMinute] = project.workEndTime.split(':').map(Number)
                      const endPosition = (endHour * 48) + (endMinute * 48 / 60)
                      height = Math.max(24, endPosition - topPosition) // Minimum 24px height
                    } else {
                      height = 48 // Default 1 hour if no end time
                    }
                  }
                  
                  return (
                    <div
                      key={`${project.id}-${staff?.id}`}
                      className="absolute left-1 right-1 sm:left-2 sm:right-2 rounded-md shadow-sm cursor-pointer hover:shadow-md transition-all border-l-4 bg-white/95 backdrop-blur-sm"
                      style={{
                        top: `${topPosition}px`,
                        height: `${height}px`,
                        borderLeftColor: staff?.color,
                        backgroundColor: `${staff?.color}20`,
                        marginLeft: `${staffIndex * 4}px`, // Slight offset for multiple staff
                        zIndex: 10 + staffIndex
                      }}
                      onClick={() => handleProjectClick(project)}
                    >
                      <div className="p-1 sm:p-2 h-full flex flex-col justify-center">
                        <div className="font-semibold text-xs sm:text-sm text-slate-800 truncate">
                          {project.siteName}
                        </div>
                        <div className="text-[10px] sm:text-xs text-slate-600 truncate">
                          {staff?.name}
                        </div>
                        {project.workStartTime && (
                          <div className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5">
                            {project.workStartTime}
                            {project.workEndTime && `〜${project.workEndTime}`}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              })}
            </div>
          </div>
        </div>
      )}

      {/* Updated today's projects section to show filtered results */}
      {filteredTodayProjects.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <h3 className="text-sm sm:text-base font-semibold text-cyan-800 mb-2 sm:mb-3 flex items-center gap-2">
            <Star className="w-4 h-4" />
            {selectedStaff === "all" ? "本日開始予定の現場" : 
             `${staffMembers.find(s => s.id === selectedStaff)?.name || ""}の本日開始予定`}
          </h3>
          <div className="grid gap-2 sm:gap-3">
            {filteredTodayProjects.map((project) => {
              const projectStaff = project.selectedStaff
                ?.map((id) => staffMembers.find((s) => s.id === id))
                .filter(Boolean) || []
              
              const displayStaff = selectedStaff === "all" 
                ? projectStaff 
                : projectStaff.filter(staff => staff?.id === selectedStaff)
              
              return (
                <div
                  key={project.id}
                  className="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-cyan-800 text-sm sm:text-base truncate">
                        {project.siteName}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2">
                        {project.workContent}
                      </p>
                      
                      {project.workStartTime && (
                        <div className="text-xs sm:text-sm text-cyan-700 font-medium mt-1">
                          {project.workStartTime}
                          {project.workEndTime && `〜${project.workEndTime}`}
                        </div>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {displayStaff.map((staff) => (
                          <div key={staff?.id} className="flex items-center gap-1">
                            <div
                              className="w-2 sm:w-3 h-2 sm:h-3 rounded-full"
                              style={{ backgroundColor: staff?.color }}
                            />
                            <span className="text-xs sm:text-sm text-slate-700">{staff?.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <CalendarIcon className="h-5 w-5 text-primary" />
              {selectedDate?.toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}{" "}
              {isCreatingNew ? "- 新規案件追加" : "の案件詳細"}
            </DialogTitle>
          </DialogHeader>

          {selectedDate && (
            <div className="space-y-4">
              {isCreatingNew ? (
                <div className="space-y-6">
                  {/* 必須項目セクション */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-destructive/20">
                      <div className="w-2 h-2 bg-destructive rounded-full"></div>
                      <h3 className="text-base sm:text-lg font-semibold text-destructive">必須項目</h3>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="newSiteName" className="text-sm sm:text-base font-semibold">
                        現場名 *
                      </Label>
                      <Input
                        id="newSiteName"
                        value={newProject.siteName || ""}
                        onChange={(e) => setNewProject({ ...newProject, siteName: e.target.value })}
                        placeholder="現場名を入力してください"
                        required
                        className="h-10 sm:h-12 text-sm sm:text-base border-2 focus:border-primary transition-colors"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm sm:text-base font-semibold">現場に入る期間 *</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs sm:text-sm text-muted-foreground">開始日</Label>
                          <Input
                            type="date"
                            value={newProject.workPeriodStart || ""}
                            onChange={(e) => setNewProject({ ...newProject, workPeriodStart: e.target.value })}
                            className="h-10 sm:h-12 border-2 focus:border-primary transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs sm:text-sm text-muted-foreground">終了日</Label>
                          <Input
                            type="date"
                            value={newProject.workPeriodEnd || ""}
                            onChange={(e) => setNewProject({ ...newProject, workPeriodEnd: e.target.value })}
                            className="h-10 sm:h-12 border-2 focus:border-primary transition-colors"
                          />
                        </div>
                      </div>

                      {/* 作業時間（任意）セクション */}
                      <div className="space-y-3 p-4 bg-secondary/20 rounded-lg border-2 border-dashed border-secondary">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <Label className="text-sm font-semibold text-primary">作業時間（任意）</Label>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">開始時間</Label>
                            <Input
                              type="time"
                              value={newProject.workStartTime || ""}
                              onChange={(e) => setNewProject({ ...newProject, workStartTime: e.target.value })}
                              className="h-10 border-2 focus:border-primary transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">終了時間</Label>
                            <Input
                              type="time"
                              value={newProject.workEndTime || ""}
                              onChange={(e) => setNewProject({ ...newProject, workEndTime: e.target.value })}
                              className="h-10 border-2 focus:border-primary transition-colors"
                            />
                          </div>
                        </div>
                        {newProject.workStartTime && newProject.workEndTime && (
                          <div className="text-xs text-primary font-medium">
                            作業時間: {newProject.workStartTime} 〜 {newProject.workEndTime}
                          </div>
                        )}
                      </div>

                      {newProject.workPeriodStart && newProject.workPeriodEnd && (
                        <div className="p-3 bg-primary/10 rounded-lg border-2 border-primary/20">
                          <div className="font-medium text-primary text-sm sm:text-base">
                            作業期間: {new Date(newProject.workPeriodStart).toLocaleDateString("ja-JP")} 〜{" "}
                            {new Date(newProject.workPeriodEnd).toLocaleDateString("ja-JP")}
                            <span className="text-xs sm:text-sm text-muted-foreground ml-2">
                              (
                              {Math.ceil(
                                (new Date(newProject.workPeriodEnd).getTime() -
                                  new Date(newProject.workPeriodStart).getTime()) /
                                  (1000 * 60 * 60 * 24),
                              ) + 1}
                              日間)
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="newWorkContent" className="text-sm sm:text-base font-semibold">
                        作業内容/概要 *
                      </Label>
                      <Textarea
                        id="newWorkContent"
                        value={newProject.workContent || ""}
                        onChange={(e) => setNewProject({ ...newProject, workContent: e.target.value })}
                        placeholder="作業内容や概要を入力してください"
                        rows={4}
                        required
                        className="text-sm sm:text-base border-2 focus:border-primary transition-colors resize-none"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm sm:text-base font-semibold">担当者 *</Label>

                      {(newProject.selectedStaff || []).length > 0 && (
                        <div className="flex flex-wrap gap-2 p-3 bg-secondary/50 rounded-lg border-2">
                          {(newProject.selectedStaff || []).map((staffId: string) => {
                            const staff = staffMembers.find((s) => s.id === staffId)
                            return staff ? (
                              <div
                                key={staffId}
                                className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-lg"
                                style={{
                                  backgroundColor: `${staff.color}20`,
                                  borderColor: staff.color,
                                  border: "1px solid",
                                }}
                              >
                                <div
                                  className="w-2 sm:w-3 h-2 sm:h-3 rounded-full"
                                  style={{ backgroundColor: staff.color }}
                                ></div>
                                <span className="truncate max-w-[100px] sm:max-w-none">{staff.name}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const currentStaff = newProject.selectedStaff || []
                                    setNewProject({
                                      ...newProject,
                                      selectedStaff: currentStaff.filter((id: string) => id !== staffId),
                                    })
                                  }}
                                  className="ml-1 hover:text-destructive transition-colors"
                                >
                                  <X className="h-2 sm:h-3 w-2 sm:w-3" />
                                </button>
                              </div>
                            ) : null
                          })}
                        </div>
                      )}

                      <Select
                        onValueChange={(staffId) => {
                          const currentStaff = newProject.selectedStaff || []
                          if (!currentStaff.includes(staffId)) {
                            setNewProject({ ...newProject, selectedStaff: [...currentStaff, staffId] })
                          }
                        }}
                      >
                        <SelectTrigger className="h-10 sm:h-12 text-sm sm:text-base border-2 focus:border-primary transition-colors">
                          <SelectValue placeholder="担当者を選択してください" />
                        </SelectTrigger>
                        <SelectContent>
                          {staffMembers
                            .filter((staff) => !(newProject.selectedStaff || []).includes(staff.id))
                            .map((staff) => (
                              <SelectItem key={staff.id} value={staff.id} className="py-2 sm:py-3">
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <div
                                    className="w-3 sm:w-4 h-3 sm:h-4 rounded-full"
                                    style={{ backgroundColor: staff.color }}
                                  ></div>
                                  <span className="text-sm sm:text-base">{staff.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>

                      {(newProject.selectedStaff || []).length === 0 && (
                        <p className="text-xs sm:text-sm text-destructive">少なくとも1人の担当者を選択してください</p>
                      )}
                    </div>
                  </div>

                  {/* 任意項目セクション */}
                  <div className="space-y-6 pt-6 border-t-2 border-dashed border-muted">
                    <div className="flex items-center gap-2 pb-2">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                      <h3 className="text-base sm:text-lg font-semibold text-muted-foreground">任意項目</h3>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base sm:text-lg font-semibold flex items-center gap-2">
                        <Database className="h-4 w-4 text-primary" />
                        元請け（請求先）
                      </Label>
                      <Input
                        placeholder="元請け会社名を入力..."
                        value={newProject.contractor || ""}
                        onChange={(e) => setNewProject({ ...newProject, contractor: e.target.value })}
                        className="h-12 text-base border-2 focus:border-primary transition-colors"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base sm:text-lg font-semibold flex items-center gap-2">
                        <Database className="h-4 w-4 text-primary" />
                        見積書番号
                      </Label>
                      <Input
                        placeholder="見積書番号を入力..."
                        value={newProject.estimateNumber || ""}
                        onChange={(e) => setNewProject({ ...newProject, estimateNumber: e.target.value })}
                        className="h-12 text-base border-2 focus:border-primary transition-colors"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm sm:text-base font-semibold flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        工期（全体期間）
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs sm:text-sm text-muted-foreground">開始日</Label>
                          <Input
                            type="date"
                            value={newProject.constructionPeriodStart || ""}
                            onChange={(e) => setNewProject({ ...newProject, constructionPeriodStart: e.target.value })}
                            className="h-10 sm:h-12 border-2 focus:border-primary transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs sm:text-sm text-muted-foreground">終了日</Label>
                          <Input
                            type="date"
                            value={newProject.constructionPeriodEnd || ""}
                            onChange={(e) => setNewProject({ ...newProject, constructionPeriodEnd: e.target.value })}
                            className="h-10 sm:h-12 border-2 focus:border-primary transition-colors"
                          />
                        </div>
                      </div>
                      {newProject.constructionPeriodStart && newProject.constructionPeriodEnd && (
                        <div className="p-3 bg-primary/10 rounded-lg border-2 border-primary/20">
                          <div className="font-medium text-primary text-sm sm:text-base">
                            工期: {new Date(newProject.constructionPeriodStart).toLocaleDateString("ja-JP")} 〜{" "}
                            {new Date(newProject.constructionPeriodEnd).toLocaleDateString("ja-JP")}
                            <span className="text-xs sm:text-sm text-muted-foreground ml-2">
                              (
                              {Math.ceil(
                                (new Date(newProject.constructionPeriodEnd).getTime() -
                                  new Date(newProject.constructionPeriodStart).getTime()) /
                                  (1000 * 60 * 60 * 24),
                              ) + 1}
                              日間)
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="newRemarks" className="text-sm sm:text-base font-semibold">
                        備考
                      </Label>
                      <Textarea
                        id="newRemarks"
                        value={newProject.remarks || ""}
                        onChange={(e) => setNewProject({ ...newProject, remarks: e.target.value })}
                        placeholder="その他の備考があれば入力してください"
                        rows={3}
                        className="text-sm sm:text-base border-2 focus:border-primary transition-colors resize-none"
                      />
                    </div>

                    <div className="space-y-3 p-4 bg-accent/10 rounded-lg border-2 border-accent/30">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-accent-foreground" />
                        <Label className="text-sm font-semibold text-accent-foreground">カレンダー表示設定</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="showInGlobalCalendar"
                          checked={newProject.showInGlobalCalendar !== false}
                          onChange={(e) => setNewProject({ ...newProject, showInGlobalCalendar: e.target.checked })}
                          className="rounded"
                        />
                        <Label htmlFor="showInGlobalCalendar" className="text-sm cursor-pointer">
                          全体カレンダーに表示する
                        </Label>
                      </div>
                      <p className="text-xs text-muted-foreground">チェックを外すと個人カレンダーのみに表示されます</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={() => setIsCreatingNew(false)}>
                      キャンセル
                    </Button>
                    <Button
                      onClick={handleCreateNewProject}
                      disabled={
                        !newProject.siteName || !newProject.workContent || !(newProject.selectedStaff || []).length
                      }
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      案件を追加
                    </Button>
                  </div>
                </div>
              ) : (
                // Existing project list view
                <>
                  {getProjectsForDate(selectedDate).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>この日の案件はありません</p>
                      <Button className="mt-4" onClick={startNewProjectCreation}>
                        <Plus className="h-4 w-4 mr-2" />
                        新しい案件を追加
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">登録済み案件</h3>
                        <Button variant="outline" size="sm" onClick={startNewProjectCreation}>
                          <Plus className="h-4 w-4 mr-2" />
                          新規追加
                        </Button>
                      </div>

                      {getProjectsForDate(selectedDate).map((project) => {
                        const assignedStaff = project.selectedStaff || []
                        const staffNames = assignedStaff
                          .map((staffId: string) => staffMembers.find((s) => s.id === staffId)?.name)
                          .filter(Boolean)
                          .join(", ")

                        return (
                          <Card key={project.id} className="border-2 hover:border-primary/50 transition-colors">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-primary">{project.siteName}</h3>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditProject(project)}
                                    className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground transition-colors"
                                    title="編集"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteProject(project.id)}
                                    className="h-8 w-8 p-0 hover:border-destructive hover:text-destructive hover:bg-destructive/10 bg-transparent transition-colors"
                                    title="削除"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <Label className="font-semibold text-muted-foreground">担当者</Label>
                                  <p className="font-medium">{staffNames || "未設定"}</p>
                                </div>
                                <div>
                                  <Label className="font-semibold text-muted-foreground">元請け</Label>
                                  <p className="font-medium">{project.contractor}</p>
                                </div>
                                <div>
                                  <Label className="font-semibold text-muted-foreground">見積書番号</Label>
                                  <p className="font-medium">{project.estimateNumber}</p>
                                </div>
                                <div>
                                  <Label className="font-semibold text-muted-foreground">作業内容</Label>
                                  <p className="font-medium">{project.workContent}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Enhanced edit dialog with complete functionality */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Edit className="h-5 w-5 text-primary" />
              案件情報の編集
            </DialogTitle>
          </DialogHeader>

          {editingProject && (
            <div className="space-y-6">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-3">必須項目</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">現場名 *</Label>
                    <Input
                      id="siteName"
                      value={editingProject.siteName || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, siteName: e.target.value })}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="workContent">作業内容 *</Label>
                    <Textarea
                      id="workContent"
                      value={editingProject.workContent || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, workContent: e.target.value })}
                      className="mt-1"
                      rows={2}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-3">担当者選択 *</h3>
                <div className="space-y-2">
                  {(editingProject.selectedStaff || []).map((staffId: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <select
                        value={staffId}
                        onChange={(e) => {
                          const newStaff = [...(editingProject.selectedStaff || [])]
                          newStaff[index] = e.target.value
                          setEditingProject({ ...editingProject, selectedStaff: newStaff })
                        }}
                        className="flex-1 p-2 border rounded"
                      >
                        <option value="">担当者を選択</option>
                        {staffMembers.map((staff) => (
                          <option key={staff.id} value={staff.id}>
                            {staff.name}
                          </option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newStaff = (editingProject.selectedStaff || []).filter(
                            (_: any, i: number) => i !== index,
                          )
                          setEditingProject({ ...editingProject, selectedStaff: newStaff })
                        }}
                      >
                        削除
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const newStaff = [...(editingProject.selectedStaff || []), ""]
                      setEditingProject({ ...editingProject, selectedStaff: newStaff })
                    }}
                    className="w-full"
                  >
                    + 担当者を追加
                  </Button>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-3">作業期間・時間 *</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="workPeriodStart">作業開始日</Label>
                    <Input
                      id="workPeriodStart"
                      type="date"
                      value={editingProject.workPeriodStart || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, workPeriodStart: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="workPeriodEnd">作業終了日</Label>
                    <Input
                      id="workPeriodEnd"
                      type="date"
                      value={editingProject.workPeriodEnd || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, workPeriodEnd: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="workStartTime">作業開始時間</Label>
                    <Input
                      id="workStartTime"
                      type="time"
                      value={editingProject.workStartTime || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, workStartTime: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="workEndTime">作業終了時間</Label>
                    <Input
                      id="workEndTime"
                      type="time"
                      value={editingProject.workEndTime || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, workEndTime: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">任意項目</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contractor">元請け</Label>
                    <Input
                      id="contractor"
                      value={editingProject.contractor || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, contractor: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="estimateNumber">見積書番号</Label>
                    <Input
                      id="estimateNumber"
                      value={editingProject.estimateNumber || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, estimateNumber: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="remarks">備考</Label>
                  <Textarea
                    id="remarks"
                    value={editingProject.remarks || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, remarks: e.target.value })}
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showInCalendar"
                  checked={editingProject.showInCalendar !== false}
                  onChange={(e) => setEditingProject({ ...editingProject, showInCalendar: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="showInCalendar">全体カレンダーに表示する</Label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button
                  onClick={() => saveProjectChanges(editingProject)}
                  disabled={isSyncing || !editingProject.siteName || !editingProject.workContent}
                >
                  {isSyncing ? "保存中..." : "保存してFileMaker同期"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Updated staff legend to show only relevant staff */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-sm sm:text-base font-semibold text-cyan-800 mb-2 sm:mb-3">
          {selectedStaff === "all" ? "担当者凡例" : "担当者"}
        </h3>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {filteredStaffMembers.map((staff) => (
            <div key={staff.id} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" style={{ backgroundColor: staff.color }} />
              <span className="text-slate-700">{staff.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { CalendarView as Calendar }\
export default CalendarView
