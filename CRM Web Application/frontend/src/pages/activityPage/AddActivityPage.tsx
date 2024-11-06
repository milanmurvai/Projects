"use client"

import {useEffect, useState} from "react"
import {ActivityResponse, Project, User} from "@/utils/types"
import {UserService} from "@/apis/profile/UserService"
import {ProjectService} from "@/apis/project/ProjectService"
import {ActivityService} from "@/apis/activity/activityService"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {ChevronDown, ChevronUp, Clock} from "lucide-react"
import NavbarEmployee from "@/components/NavbarEmployee.tsx"

export default function AddActivityPage() {
    const [activities, setActivities] = useState<ActivityResponse[]>([])
    const [currentUser, setCurrentUser] = useState<User>()
    const [projects, setProjects] = useState<Project[]>([])
    const [selectedProject, setSelectedProject] = useState<number | null>(null)
    const [isTimerRunning, setIsTimerRunning] = useState(false)
    const [startTime, setStartTime] = useState<Date | null>(null)
    const [showActivities, setShowActivities] = useState(false)

    useEffect(() => {
        const timerStart = localStorage.getItem("timerStart");
        const timerRunning = localStorage.getItem("timerRunning") === "true";
        const savedProjectId = localStorage.getItem("selectedProject")
        if (timerStart && timerRunning) {
            setIsTimerRunning(true);
            setStartTime(new Date(timerStart));
        }
        if (savedProjectId) {
            setSelectedProject(Number(savedProjectId))
        }
        loadUserInfo()
    }, [])

    const loadUserInfo = async () => {
        const user = await UserService.getCurrentUser()
        setCurrentUser(user)
    }

    const loadProjects = async () => {
        if (currentUser?.id) {
            const projectsData = await ProjectService.getProjectsByUser(Number(currentUser.id))
            setProjects(projectsData)
        }
    }

    const loadActivities = async () => {
        if (currentUser?.id) {
            const activitiesData = await ActivityService.getActivitiesByUser(Number(currentUser.id))
            setActivities(activitiesData)
        }
    }

    useEffect(() => {
        if (currentUser?.id) {
            loadProjects()
            loadActivities()
        }
    }, [currentUser])

    const handleProjectChange = (value: string) => {
        setSelectedProject(Number(value))
    }

    const handleStart = () => {
        const startTime = new Date()
        if (startTime.getHours() < 7 || startTime.getHours() > 15 || (startTime.getHours() === 15 && startTime.getMinutes() > 30) || (startTime.getHours() === 7 && startTime.getMinutes() < 30)) {
            alert("Nu poți începe munca înainte de ora 7:30 sau după ora 15:30")
        } else {
            setIsTimerRunning(true)
            setStartTime(startTime)
            localStorage.setItem("timerStart", startTime.toISOString()); // Save start time
            localStorage.setItem("timerRunning", "true"); // Save timer state
            if (selectedProject) {
                localStorage.setItem("selectedProject", selectedProject.toString()) // Save selected project
            }
        }
    }

    const handleStop = async () => {
        if (!startTime) return

        const endTime = new Date()
        if (endTime.getHours() < 7 || endTime.getHours() > 15 || (endTime.getHours() === 15 && endTime.getMinutes() > 30) || (endTime.getHours() === 7 && endTime.getMinutes() < 30)) {
            alert("Nu poți termina munca înainte de ora 7:30 sau după ora 15:30")
        } else {
            // Define daily working hours
            const startLimit = new Date(startTime)
            startLimit.setHours(7, 30, 0, 0)
            const endLimit = new Date(startTime)
            endLimit.setHours(15, 30, 0, 0)
            let totalHoursWorked = 0
            let currentStart = new Date(startTime)
            while (currentStart < endTime) {
                // Set the effective start and end times for each day
                const dayStart = new Date(currentStart)
                dayStart.setHours(7, 30, 0, 0)
                const dayEnd = new Date(currentStart)
                dayEnd.setHours(15, 30, 0, 0)
                // Calculate the actual start and end for the current day
                const effectiveStart = currentStart < dayStart ? dayStart : currentStart
                const effectiveEnd = endTime < dayEnd ? endTime : dayEnd
                if (effectiveStart <= effectiveEnd) {
                    const hoursForDay = (effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60)
                    totalHoursWorked += hoursForDay
                }
                // Move to the next day
                currentStart.setDate(currentStart.getDate() + 1)
                currentStart.setHours(7, 30, 0, 0)
            }
            setIsTimerRunning(false)
            setStartTime(null)
            localStorage.removeItem("timerStart"); // Clear timer data on stop
            localStorage.setItem("timerRunning", "false");

            if (currentUser?.id && selectedProject) {
                await ActivityService.addActivity({
                    userId: Number(currentUser.id),
                    projectId: selectedProject,
                    startDate: startTime.toISOString(),
                    endDate: endTime.toISOString(),
                    hours: totalHoursWorked,
                    details: ""
                })
                alert("Pontajul a fost salvat cu succes!")
                loadActivities()
            }
        }
    }

    const getProjectName = (projectId: number) => {
        const project = projects.find((project) => Number(project.id) === projectId)
        return project ? project.name : "Proiect necunoscut"
    }

    const formatHoursAndMinutes = (decimalHours: number) => {
        const hours = Math.floor(decimalHours)
        const minutes = Math.round((decimalHours - hours) * 60)
        if (hours === 1) {
            return `${hours} oră și ${minutes} minute`
        } else {
            return `${hours} ore și ${minutes} minute`
        }
    }

    return (
        <div className="bg-white min-h-screen">
            <NavbarEmployee/>
            <main className="container mx-auto mt-4 px-4 pb-16">
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-[#0C1911] text-xl">Selectează proiectul pentru pontaj</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col space-y-4">
                            <Select onValueChange={handleProjectChange}
                                    value={selectedProject ? selectedProject.toString() : undefined}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selectează un proiect"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {projects.map((project) => (
                                        <SelectItem key={project.id} value={project.id.toString()}>
                                            {project.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                onClick={isTimerRunning ? handleStop : handleStart}
                                className={`w-full py-3 ${isTimerRunning ? "bg-[#C51321]" : "bg-[#3C4741]"} text-[#FFFFFF] hover:opacity-90 text-lg`}
                            >
                                {isTimerRunning ? "Stop" : "Start"}
                            </Button>
                            {isTimerRunning && (
                                <div className="bg-[#858C88] text-[#FFFFFF] p-4 rounded-md flex items-center">
                                    <Clock className="h-5 w-5 mr-2"/>
                                    <div>
                                        <h3 className="font-semibold">Timer activ</h3>
                                        <p className="text-sm">Pontajul este în curs de înregistrare.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between cursor-pointer"
                                onClick={() => setShowActivities(!showActivities)}>
                        <CardTitle className="text-[#0C1911] text-xl">Pontajele tale</CardTitle>
                        {showActivities ? <ChevronUp className="h-6 w-6"/> : <ChevronDown className="h-6 w-6"/>}
                    </CardHeader>
                    {showActivities && (
                        <CardContent>
                            <div className="space-y-4">
                                {activities.map((activity) => (
                                    <div key={activity.id} className="bg-gray-100 p-4 rounded-md">
                                        <h3 className="font-semibold">{getProjectName(activity.projectId)}</h3>
                                        <p className="text-sm text-gray-600">
                                            {new Date(activity.startDate).toLocaleDateString("ro-RO")} - {new Date(activity.endDate).toLocaleDateString("ro-RO")}
                                        </p>
                                        <p className="text-sm font-medium mt-1">{formatHoursAndMinutes(activity.hours)}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    )}
                </Card>
            </main>
        </div>
    )
}