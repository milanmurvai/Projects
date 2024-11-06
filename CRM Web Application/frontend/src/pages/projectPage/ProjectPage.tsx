"use client"

import {useEffect, useState} from "react"
import {Client, Material, ProjectResponse, User} from "@/utils/types"
import {ProjectService} from "@/apis/project/ProjectService"
import {ClientService} from "@/apis/client/ClientService"
import {UserService} from "@/apis/profile/UserService"
import {MaterialService} from "@/apis/material/MaterialService"
import {Link, useNavigate} from 'react-router-dom'
import {ChevronDown, ChevronUp, Minus, Pencil, Plus, Trash} from "lucide-react"
import NavbarEmployee from "@/components/NavbarEmployee"
import Navbar from "@/components/Navbar"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"

const ProjectsPage = () => {
    const [projects, setProjects] = useState<ProjectResponse[]>([])
    const [filteredProjects, setFilteredProjects] = useState<ProjectResponse[]>([])
    const [currentUser, setCurrentUser] = useState<User>()
    const [clients, setClients] = useState<Client[]>([])
    const [materials, setMaterials] = useState<Material[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)
    const projectsPerPage = 5
    const [expandedProject, setExpandedProject] = useState<number | null>(null)
    const [isSmallScreen, setIsSmallScreen] = useState(false)

    useEffect(() => {
        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth < 1024) // Adjust this breakpoint as needed
        }
        checkScreenSize()
        window.addEventListener('resize', checkScreenSize)
        return () => window.removeEventListener('resize', checkScreenSize)
    }, [])

    useEffect(() => {
        loadUserInfo()
        loadClients()
        loadMaterials()
    }, [])

    useEffect(() => {
        if (currentUser && currentUser.username && currentUser.password && currentUser.id) {
            loadProjects()
        }
    }, [currentUser])

    useEffect(() => {
        filterProjects()
    }, [searchTerm, projects])

    const loadUserInfo = async () => {
        const user = await UserService.getCurrentUser()
        setCurrentUser(user)
    }

    const loadClients = async () => {
        const clientsData = await ClientService.getClients()
        setClients(clientsData)
    }

    const loadMaterials = async () => {
        const materialsData = await MaterialService.getMaterials()
        setMaterials(materialsData)
    }

    const loadProjects = async () => {
        const projectsData = await ProjectService.getProjects()
        setProjects(projectsData)
    }

    const filterProjects = () => {
        const filtered = projects.filter((project) =>
            project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase()) || getClientName(project.clientId).toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredProjects(filtered)
    }

    const getClientName = (clientId: number) => {
        const client = clients.find((client) => client.id === clientId)
        return client ? client.name : "Unknown Client"
    }

    const getMaterialName = (materialId: number) => {
        const material = materials.find((material) => material.id === materialId)
        return material ? material.name : "Unknown Material"
    }

    const getMaterialCoefficient = (materialId: number) => {
        const material = materials.find((material) => material.id === materialId)
        return material ? material.coefficient : "Unknown"
    }

    const handleDelete = async (projectId: number) => {
        if (confirm("Sigur doriți să ștergeți acest proiect?")) {
            await ProjectService.deleteProject(projectId)
            setProjects(projects.filter((project) => project.id !== projectId))
        }
    }

    const handleUpdate = (projectId: number) => {
        navigate("/edit-project/" + projectId)
    }

    const handleAssign = async (projectId: number) => {
        await ProjectService.addUserToProject(projectId, Number(currentUser?.id))
        loadProjects()
    }

    const handleUnassign = async (projectId: number) => {
        await ProjectService.removeUserFromProject(projectId, Number(currentUser?.id))
        loadProjects()
    }
    const formatHoursAndMinutes = (decimalHours: number) => {
        const hours = Math.floor(decimalHours);
        const minutes = Math.round((decimalHours - hours) * 60);

        // If total hours are less than 1 but there are minutes, show "1 oră"
        if (hours === 0 && minutes > 0) {
            return "1 oră";
        }

        // If minutes are 30 or more, add an hour
        if (minutes >= 30) {
            return hours + 1 === 1 ? `1 oră` : `${hours + 1} ore`;
        } else {
            return hours === 1 ? `1 oră` : `${hours} ore`;
        }
    };


    const toggleProjectExpansion = (projectId: number) => {
        setExpandedProject(expandedProject === projectId ? null : projectId)
    }

    const isUserAssignedToProject = (project: ProjectResponse) => {
        return project.users.some(user => user.id === currentUser?.id)
    }

    const areUsersAssignedToProject = (project: ProjectResponse) => {
        return project.users.length > 0
    }
    const isLimitDateExpired = (project: ProjectResponse) => {
        return new Date(project.limitDate) < new Date()
    }
    const renderProjectCard = (project: ProjectResponse) => {
        const isExpanded = expandedProject === project.id
        const isAssigned = currentUser?.type === "ANGAJAT" && areUsersAssignedToProject(project)

        return (
            <Card
                key={project.id}
                className={`mb-4 ${isAssigned ? 'border-[#C51321] border-2' : ''}`}
            >
                <CardHeader
                    className={`flex flex-row items-center justify-between cursor-pointer ${currentUser?.type === "ANGAJAT" && isAssigned ? 'bg-[#C51321] text-white' : '' || currentUser?.type === "ADMIN" && isLimitDateExpired(project) ? 'bg-[#C51321] text-white' : ''}`}
                    onClick={() => toggleProjectExpansion(project.id)}
                >
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    {isExpanded ? <ChevronUp className="h-5 w-5"/> : <ChevronDown className="h-5 w-5"/>}
                </CardHeader>
                {isExpanded && (
                    <CardContent>
                        <div className="space-y-2">
                            <p><strong>Descriere:</strong> {project.description}</p>
                            <p><strong>Status:</strong> {project.status}</p>
                            <p><strong>Data de început:</strong> {project.startDate}</p>
                            <p><strong>Data limită:</strong> {project.limitDate}</p>
                            {currentUser?.type === "ADMIN" && (
                                <>
                                    <p><strong>Client:</strong> {getClientName(project.clientId)}</p>
                                    <p><strong>Adresă:</strong> {project.address}</p>
                                    <p><strong>Ore lucrate:</strong> {formatHoursAndMinutes(project.hours)}</p>
                                    <p><strong>Preț:</strong> {project.price}</p>
                                    <p><strong>Avans:</strong> {project.advance}</p>
                                    <p><strong>Factură:</strong> {project.invoice ? "Da" : "Nu"}</p>
                                    <p><strong>Cost total:</strong> {project.total}</p>
                                </>
                            )}
                            <div>
                                <strong>Materiale:</strong>
                                {project.materials.length > 0 ? (
                                    <ul className="list-disc list-inside">
                                        {project.materials.map((material, index) => (
                                            <li key={index}>
                                                {getMaterialName(material.materialId)}, {getMaterialCoefficient(material.materialId)}, {material.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>Niciun material</p>
                                )}
                            </div>
                            <div>
                                <strong>Angajați:</strong>
                                {project.users.length > 0 ? (
                                    <ul className="list-disc list-inside">
                                        {project.users.map((user, index) => (
                                            <li key={index}>{user.name}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>Niciun angajat</p>
                                )}
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                {currentUser?.type === "ADMIN" ? (
                                    <>
                                        <Button variant="outline" size="sm" onClick={() => handleUpdate(project.id)}>
                                            <Pencil className="h-4 w-4 mr-2"/>
                                            Editează
                                        </Button>
                                        <Button variant="destructive" size="sm"
                                                onClick={() => handleDelete(project.id)}>
                                            <Trash className="h-4 w-4 mr-2"/>
                                            Șterge
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleAssign(project.id)}
                                            disabled={isAssigned}
                                        >
                                            <Plus className="h-4 w-4 mr-2"/>
                                            Asignează-te
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleUnassign(project.id)}
                                            disabled={!isAssigned}
                                        >
                                            <Minus className="h-4 w-4 mr-2"/>
                                            Dezasignează-te
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </CardContent>
                )}
            </Card>
        )
    }

    const renderProjectTable = () => (
        <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
            <tr className="bg-gray-200">
                {currentUser?.type === "ADMIN" ? (<>
                        <th className="border border-gray-300 px-4 py-2">Nume</th>
                        <th className="border border-gray-300 px-4 py-2">Descriere</th>
                        <th className="border border-gray-300 px-4 py-2">Client</th>
                        <th className="border border-gray-300 px-4 py-2">Adresa</th>
                        <th className="border border-gray-300 px-4 py-2">Ore lucrate</th>
                        <th className="border border-gray-300 px-4 py-2">Pret</th>
                        <th className="border border-gray-300 px-4 py-2">Avans</th>
                        <th className="border border-gray-300 px-4 py-2">Factura</th>
                        <th className="border border-gray-300 px-4 py-2">Status</th>
                        <th className="border border-gray-300 px-4 py-2">Creat</th>
                        <th className="border border-gray-300 px-4 py-2">Termen limită</th>
                        <th className="border border-gray-300 px-4 py-2">Cost total</th>
                        <th className="border border-gray-300 px-4 py-2">Materiale</th>
                        <th className="border border-gray-300 px-4 py-2">Angajați</th>
                        <th className="border border-gray-300 px-4 py-2">Acțiuni</th>
                    </>) :
                    (<>
                        <th className="border border-gray-300 px-4 py-2">Nume</th>
                        <th className="border border-gray-300 px-4 py-2">Descriere</th>
                        <th className="border border-gray-300 px-4 py-2">Status</th>
                        <th className="border border-gray-300 px-4 py-2">Data început</th>
                        <th className="border border-gray-300 px-4 py-2">Data limită</th>
                        <th className="border border-gray-300 px-4 py-2">Materiale</th>
                        <th className="border border-gray-300 px-4 py-2">Angajați</th>
                        <th className="border border-gray-300 px-4 py-2">Acțiuni</th>
                    </>)
                }
            </tr>
            </thead>
            <tbody>
            {filteredProjects.slice((currentPage - 1) * projectsPerPage, currentPage * projectsPerPage).map((project) => (
                <tr key={project.id}
                    className={currentUser?.type === "ANGAJAT" && areUsersAssignedToProject(project) ? 'bg-[#C51321] text-white' : '' || currentUser?.type === "ADMIN" && isLimitDateExpired(project) ? 'bg-[#C51321] text-white' : ''}>
                    {currentUser?.type === "ADMIN" ? (<>
                            <td className="border border-gray-300 px-4 py-2">{project.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{project.description}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                <Link to={`/clients?editId=${project.clientId}`} className="hover:underline">
                                    {getClientName(project.clientId)}
                                </Link>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">{project.address}</td>
                            <td className="border border-gray-300 px-4 py-2">{formatHoursAndMinutes(project.hours)}</td>
                            <td className="border border-gray-300 px-4 py-2">{project.price}</td>
                            <td className="border border-gray-300 px-4 py-2">{project.advance}</td>
                            <td className="border border-gray-300 px-4 py-2">{project.invoice ? "Da" : "Nu"}</td>
                            <td className="border border-gray-300 px-4 py-2">{project.status}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                {new Date(project.startDate).toLocaleDateString("ro-RO")}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                {new Date(project.limitDate).toLocaleDateString("ro-RO")}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">{project.total}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                {project.materials.length > 0
                                    ? project.materials.map((material, index) => (
                                        <div key={index}>
                                            <div>
                                                {getMaterialName(material.materialId)} | {material.quantity},
                                            </div>
                                        </div>
                                    ))
                                    : "Niciun material"}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                {project.users.length > 0
                                    ? project.users.map((user, index) => (
                                        <div key={index}>
                                            <div>[{user.name}]</div>
                                        </div>
                                    ))
                                    : "Niciun angajat"}
                            </td>
                        </>) :
                        (<>
                            <td className="border border-gray-300 px-4 py-2">{project.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{project.description}</td>
                            <td className="border border-gray-300 px-4 py-2">{project.status}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                {new Date(project.startDate).toLocaleDateString("ro-RO")}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                {new Date(project.limitDate).toLocaleDateString("ro-RO")}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                {project.materials.length > 0
                                    ? project.materials.map((material, index) => (
                                        <div key={index}>
                                            <div>
                                                {getMaterialName(material.materialId)} | {material.quantity},
                                            </div>
                                        </div>
                                    ))
                                    : "Niciun material"}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                {project.users.length > 0
                                    ? project.users.map((user, index) => (
                                        <div key={index}>
                                            <div>[{user.name}]</div>
                                        </div>
                                    ))
                                    : "Niciun angajat"}
                            </td>
                        </>)
                    }

                    <td className="border border-gray-300 px-4 py-2 text-center">
                        {currentUser?.type === "ADMIN" ? (
                            <>
                                <Button variant="outline" size="sm" onClick={() => handleUpdate(project.id)}
                                        className="mr-2">
                                    <Pencil className="h-4 w-4"/>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}
                                        className="mr-2">
                                    <Trash className="h-4 w-4"/>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleAssign(project.id)}
                                    disabled={isUserAssignedToProject(project)}
                                    className="mr-2"
                                >
                                    <Plus className="h-4 w-4"/>
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleUnassign(project.id)}
                                    disabled={!isUserAssignedToProject(project)}
                                >
                                    <Minus className="h-4 w-4"/>
                                </Button>
                            </>
                        )}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )

    return (
        <div className="bg-white min-h-screen">
            {currentUser?.type === "ANGAJAT" ? <NavbarEmployee/> : <Navbar/>}
            <main className="w-full px-4 py-8 ml-0">
                <h1 className="text-2xl font-bold mb-6 text-center">Proiecte</h1>
                <Input
                    type="text"
                    placeholder="Caută proiect..."
                    className="w-full mb-6"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {isSmallScreen
                    ? filteredProjects.slice((currentPage - 1) * projectsPerPage, currentPage * projectsPerPage).map(renderProjectCard)
                    : renderProjectTable()
                }
                <div className="flex justify-center mt-6 space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        &lt;
                    </Button>
                    <span className="py-2">
                        Pagina {currentPage} din {Math.ceil(filteredProjects.length / projectsPerPage)}

                    </span>
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredProjects.length / projectsPerPage)))}
                        disabled={currentPage === Math.ceil(filteredProjects.length / projectsPerPage)}
                    >
                        &gt;
                    </Button>
                </div>
            </main>
        </div>
    )
}

export default ProjectsPage