"use client"

import {useEffect, useState} from "react"
import {ActivityResponse, Project, Type, User} from "@/utils/types"
import {UserService} from "@/apis/profile/UserService"
import {ProjectService} from "@/apis/project/ProjectService"
import {ActivityService} from "@/apis/activity/activityService"
import Navbar from "@/components/Navbar"
import NavbarEmployee from "@/components/NavbarEmployee"
import {ChevronDown, ChevronUp, Search} from "lucide-react"

export default function ActivityPage() {
    const [activities, setActivities] = useState<ActivityResponse[]>([])
    const [filteredActivities, setFilteredActivities] = useState<ActivityResponse[]>([])
    const [currentUser, setCurrentUser] = useState<User>()
    const [users, setUsers] = useState<User[]>([])
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [expandedActivity, setExpandedActivity] = useState<number | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const user = await UserService.getCurrentUser()
                setCurrentUser(user)
                const usersData = await UserService.getUsersByType(Type.ANGAJAT)
                setUsers(usersData)
                const projectsData = await ProjectService.getProjects()
                setProjects(projectsData)
                if (user && user.username && user.password && user.id) {
                    const activitiesData = await ActivityService.getActivities()
                    setActivities(activitiesData)
                    setFilteredActivities(activitiesData)
                }
            } catch (err) {
                setError("An error occurred while fetching data. Please try again later.")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        const filtered = activities.filter(
            (activity) =>
                getUserName(activity.userId).toLowerCase().includes(searchTerm.toLowerCase()) ||
                getProjectName(activity.projectId).toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredActivities(filtered)
    }, [searchTerm, activities])

    const getUserName = (userId: number) => {
        const user = users.find((user) => Number(user.id) === userId)
        return user ? user.name : "Unknown User"
    }

    const getProjectName = (projectId: number) => {
        const project = projects.find((project) => Number(project.id) === projectId)
        return project ? project.name : "Unknown Project"
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

    const toggleActivityExpansion = (activityId: number) => {
        setExpandedActivity(expandedActivity === activityId ? null : activityId)
    }

    return (
        <div className="min-h-screen bg-white">
            {currentUser?.type === "ANGAJAT" ? <NavbarEmployee/> : <Navbar/>}
            <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg p-9">
                    <h1 className="text-2xl font-bold text-center mb-6">Pontaje</h1>
                    {loading ? (
                        <div className="space-y-4">
                            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                             role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> {error}</span>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4">
                                <div className="relative">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
                                    <input
                                        type="text"
                                        placeholder="Caută după angajat sau proiect"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border rounded-md"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                {filteredActivities.map((activity) => (
                                    <div key={activity.id} className="border rounded-lg overflow-hidden">
                                        <div
                                            className="bg-gray-50 px-4 py-3 cursor-pointer flex justify-between items-center"
                                            onClick={() => toggleActivityExpansion(activity.id)}
                                        >
                                            <h3 className="text-lg font-semibold">
                                                {getUserName(activity.userId)} - {getProjectName(activity.projectId)}
                                            </h3>
                                            {expandedActivity === activity.id ? (
                                                <ChevronUp className="h-5 w-5"/>
                                            ) : (
                                                <ChevronDown className="h-5 w-5"/>
                                            )}
                                        </div>
                                        {expandedActivity === activity.id && (
                                            <div className="px-4 py-3">
                                                <p>
                                                    <strong>Data: </strong>{new Date(activity.startDate).toLocaleDateString("ro-RO")} - {new Date(activity.endDate).toLocaleDateString("ro-RO")}
                                                </p>
                                                <p><strong>Durata:</strong> {formatHoursAndMinutes(activity.hours)}</p>
                                                <p><strong>Detalii:</strong> {activity.details}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}