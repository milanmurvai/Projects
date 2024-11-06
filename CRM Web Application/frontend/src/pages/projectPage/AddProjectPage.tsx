"use client"

import React, {useEffect, useState} from "react"
import {ClientService} from "@/apis/client/ClientService"
import {MaterialService} from "@/apis/material/MaterialService"
import {ProjectService} from "@/apis/project/ProjectService"
import {Client, Material, ProjectMaterialRequest, ProjectRequest, Status, Type, User} from "@/utils/types"
import {UserService} from "@/apis/profile/UserService"
import {useNavigate} from "react-router-dom"
import Navbar from "@/components/Navbar"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import Select, {SingleValue} from "react-select";
import {Select as Select2, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Label} from "@/components/ui/label"
import {PlusCircle, Trash2} from "lucide-react"

const AddProjectPage = () => {
    const [currentUser, setCurrentUser] = useState<User>()
    const [clients, setClients] = useState<Client[]>([])
    const [materials, setMaterials] = useState<Material[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [selectedClient, setSelectedClient] = useState<Client>()
    const [projectMaterials, setProjectMaterials] = useState<ProjectMaterialRequest[]>([
        {materialId: 0, quantity: 0}
    ])
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const [projectData, setProjectData] = useState<ProjectRequest>({
        name: "",
        description: "",
        clientId: 0,
        address: "",
        materials: [],
        price: 0,
        advance: 0,
        invoice: false,
        status: Status.POTENTIAL,
        startDate: "",
        limitDate: ""
    })
    const [totalMaterialCost, setTotalMaterialCost] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        loadUserInfo()
        loadClients()
        loadMaterials()
        loadUsers()
    }, [])

    useEffect(() => {
        calculateTotalMaterialCost()
    }, [projectMaterials, materials])

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

    const loadUsers = async () => {
        const usersData = await UserService.getUsersByType(Type.ANGAJAT)
        setUsers(usersData)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target
        setProjectData(prevState => ({...prevState, [name]: value}))
    }

    const addMaterial = () => {
        setProjectMaterials(prevMaterials => [
            ...prevMaterials,
            {materialId: 0, quantity: 0}
        ])
    }

    const removeMaterial = (index: number) => {
        setProjectMaterials(prevMaterials => prevMaterials.filter((_, i) => i !== index))
    }

    const handleMaterialChange = (index: number, field: string, value: number) => {
        const newMaterials = [...projectMaterials]
        newMaterials[index] = {...newMaterials[index], [field]: value}
        setProjectMaterials(newMaterials)
    }

    const calculateTotalMaterialCost = () => {
        const total = projectMaterials.reduce((sum, material) => {
            const materialData = materials.find(m => m.id === material.materialId)
            if (materialData) {
                return sum + material.quantity * materialData.coefficient
            }
            return sum
        }, 0)
        setTotalMaterialCost(total)
    }

    const addUsersToProject = async (projectId: number) => {
        for (const user of selectedUsers) {
            await ProjectService.addUserToProject(projectId, Number(user.id))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (selectedClient) {
            const projectToSubmit = {...projectData, clientId: selectedClient.id, materials: projectMaterials}
            const createdProjectResponse = await ProjectService.addProject(projectToSubmit)
            if (createdProjectResponse.status === 200 && createdProjectResponse.data) {
                const createdProject = createdProjectResponse.data
                await addUsersToProject(createdProject.id)
                alert("Proiect adăugat cu succes")
                navigate("/projects")
            } else {
                alert("Eroare la crearea proiectului")
            }
        } else {
            alert("Selectează un client")
        }
    }

    if (!currentUser || !currentUser.username || !currentUser.password || !currentUser.id) {
        return (
            <div className="bg-gray-100 min-h-screen">
                <Navbar/>
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-4">Încărcare...</h1>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white min-h-screen">
            <Navbar/>
            <div className="container mx-auto p-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Adaugă Proiect Nou</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Nume Proiect</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={projectData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Descriere</Label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={projectData.description}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full p-2 border rounded-md"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="client">Client:</label>
                                        <Select
                                            options={clients}
                                            getOptionLabel={(client) => client.name}
                                            getOptionValue={(client) => client.id.toString()}
                                            value={selectedClient}
                                            onChange={(newValue: SingleValue<Client>) => setSelectedClient(newValue ?? undefined)}
                                            placeholder="Caută și selectează un client..."
                                            isSearchable
                                            className="border border-gray-300 p-2 w-full"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="address">Adresă</Label>
                                        <Input
                                            id="address"
                                            name="address"
                                            value={projectData.address}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="price">Preț</Label>
                                        <Input
                                            type="number"
                                            id="price"
                                            name="price"
                                            value={projectData.price}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="advance">Avans</Label>
                                        <Input
                                            type="number"
                                            id="advance"
                                            name="advance"
                                            value={projectData.advance}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="invoice"
                                            checked={projectData.invoice}
                                            onChange={(e) => setProjectData(prevState => ({
                                                ...prevState,
                                                invoice: e.target.checked
                                            }))}
                                            className="h-4 w-4"
                                        />
                                        <Label htmlFor="invoice">Factură</Label>
                                    </div>

                                    <div>
                                        <Label htmlFor="status">Status</Label>
                                        <Select2
                                            onValueChange={(value) => setProjectData(prevState => ({
                                                ...prevState,
                                                status: value as Status
                                            }))}
                                            defaultValue={projectData.status}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selectează un status"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.values(Status).map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select2>
                                    </div>

                                    <div>
                                        <Label htmlFor="startDate">Data de început</Label>
                                        <Input
                                            type="date"
                                            id="startDate"
                                            name="startDate"
                                            value={projectData.startDate}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="limitDate">Data limită</Label>
                                        <Input
                                            type="date"
                                            id="limitDate"
                                            name="limitDate"
                                            value={projectData.limitDate}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label>Materiale</Label>
                                {projectMaterials.map((material, index) => (
                                    <div key={index} className="flex items-center space-x-2 mb-2">
                                        <Select2
                                            value={material.materialId.toString()}
                                            onValueChange={(value) => handleMaterialChange(index, "materialId", parseInt(value))}
                                        >
                                            <SelectTrigger className="w-[200px]">
                                                <SelectValue placeholder="Selectează un material"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {materials.map(mat => (
                                                    <SelectItem key={mat.id} value={mat.id.toString()}>
                                                        {mat.name} (Coef: {mat.coefficient})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select2>
                                        <Input
                                            type="number"
                                            placeholder="Cantitate"
                                            value={material.quantity}
                                            onChange={(e) => handleMaterialChange(index, "quantity", parseFloat(e.target.value))}
                                            className="w-[100px]"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeMaterial(index)}
                                        >
                                            <Trash2 className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={addMaterial} className="mt-2">
                                    <PlusCircle className="h-4 w-4 mr-2"/>
                                    Adaugă Material
                                </Button>
                            </div>

                            <div className="bg-gray-100 p-4 rounded-md">
                                <Label>Total Materiale</Label>
                                <div className="text-2xl font-bold">{totalMaterialCost.toFixed(2)} Kg</div>
                            </div>

                            <div>
                                <Label htmlFor="users">Angajați</Label>
                                <Select2
                                    onValueChange={(value) => {
                                        const selectedUser = users.find(u => u.id.toString() === value)
                                        if (selectedUser) {
                                            setSelectedUsers(prev => [...prev, selectedUser])
                                        }
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selectează angajații pentru proiect"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((user) => (
                                            <SelectItem key={user.id} value={user.id.toString()}>
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select2>
                                <div className="mt-2">
                                    {selectedUsers.map((user) => (
                                        <div key={user.id}
                                             className="flex items-center justify-between bg-gray-100 p-2 rounded mb-1">
                                            <span>{user.name}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedUsers(prev => prev.filter(u => u.id !== user.id))}
                                            >
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button type="submit" className="w-full">
                                Creează Proiect
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AddProjectPage