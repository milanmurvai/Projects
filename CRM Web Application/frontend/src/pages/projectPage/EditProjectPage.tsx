import React, {useEffect, useState} from "react";
import {ClientService} from "@/apis/client/ClientService";
import {MaterialService} from "@/apis/material/MaterialService";
import {ProjectService} from "@/apis/project/ProjectService";
import {
    Client,
    Material,
    ProjectMaterialRequest,
    ProjectRequest,
    Status,
    Type,
    User,
    UserResponse
} from "@/utils/types";
import {UserService} from "@/apis/profile/UserService.tsx";
import Select, {MultiValue, SingleValue} from "react-select";
import Navbar from "@/components/Navbar.tsx";
import {useNavigate, useParams} from "react-router-dom";

const EditProjectPage = () => {
    const {projectId} = useParams<{ projectId: string }>(); // Get projectId from URL
    const [currentUser, setCurrentUser] = useState<User>();
    const [clients, setClients] = useState<Client[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [users, setUsers] = useState<UserResponse[]>([]); // State to hold users
    const [selectedUsers, setSelectedUsers] = useState<UserResponse[]>([]); // Selected users for the project
    const [selectedClient, setSelectedClient] = useState<Client>();
    const [projectMaterials, setProjectMaterials] = useState<ProjectMaterialRequest[]>([]);
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
    });
    const navigate = useNavigate();

    useEffect(() => {
        loadUserInfo();
        loadClients();
        loadMaterials();
        loadUsers();
        loadProject();
    }, []);

    const loadUserInfo = async () => {
        await UserService.getCurrentUser()
            .then((user) => {
                setCurrentUser(user);
            });
    };

    const loadClients = async () => {
        const clientsData = await ClientService.getClients();
        setClients(clientsData);
    };

    const loadMaterials = async () => {
        const materialsData = await MaterialService.getMaterials();
        setMaterials(materialsData);
    };

    const loadUsers = async () => {
        const usersData = await UserService.getUsersByType(Type.ANGAJAT); // Load available users
        setUsers(usersData);
    };

    const loadProject = async () => {
        if (projectId) {
            const project = await ProjectService.getProject(Number(projectId));
            setProjectData({
                name: project.name,
                description: project.description,
                clientId: project.clientId,
                address: project.address,
                materials: project.materials,
                price: project.price,
                advance: project.advance,
                invoice: project.invoice,
                status: project.status,
                startDate: project.startDate,
                limitDate: project.limitDate
            });

            // Avoid multiple re-renders for client and users
            const client = await ClientService.getClientById(project.clientId);
            if (client.id !== selectedClient?.id) {
                setSelectedClient(client);
            }

            const projectUsers = await UserService.getUsersByProjectId(project.id);
            setSelectedUsers(projectUsers);
        }
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setProjectData(prevState => ({...prevState, [name]: value}));
    };

    const handleMaterialChange = (index: number, field: string, value: number) => {
        const newMaterials = [...projectMaterials];
        newMaterials[index] = {...newMaterials[index], [field]: value};
        setProjectMaterials(newMaterials);
    };

    const handleUserChange = (selectedOptions: MultiValue<UserResponse>) => {
        setSelectedUsers(selectedOptions as UserResponse[]); // Cast it to UserResponse[] if needed
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedClient != undefined) {
            const projectToSubmit = {...projectData, clientId: selectedClient.id, materials: projectMaterials};
            await ProjectService.updateProject(Number(projectId), projectToSubmit);

            // Fetch the current users assigned to the project
            const currentProjectUsers = await UserService.getUsersByProjectId(Number(projectId));

            // Find users to add (those in selectedUsers but not in currentProjectUsers)
            const usersToAdd = selectedUsers.filter(user =>
                !currentProjectUsers.some((projectUser: { id: number }) => projectUser.id === Number(user.id))
            );

            // Find users to remove (those in currentProjectUsers but not in selectedUsers)
            const usersToRemove = currentProjectUsers.filter((projectUser: UserResponse) =>
                !selectedUsers.some(user => user.id === projectUser.id)
            );

            // Add new users to the project
            await Promise.all(usersToAdd.map(user => ProjectService.addUserToProject(Number(projectId), Number(user.id))));

            // Remove users that are no longer selected
            await Promise.all(usersToRemove.map((user: User) =>
                ProjectService.removeUserFromProject(Number(projectId), Number(user.id))
            ));

            alert("Proiect actualizat cu succes");
            navigate("/projects");
        } else {
            alert("Selectează un client");
        }
    };


    const addMaterial = () => {
        setProjectMaterials(prevMaterials => [
            ...prevMaterials,
            {materialId: 0, quantity: 0}
        ]);
    };

    const getStatusOptions = () => {
        return Object.keys(Status).map((key) => ({
            value: Status[key as keyof typeof Status],
            label: Status[key as keyof typeof Status],
        }));
    };

    if (currentUser && currentUser.username && currentUser.password && currentUser.id) {
        return (
            <div className="bg-white min-h-screen">
                <Navbar/>
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-4">Editează Proiect</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name">Nume Proiect:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={projectData.name}
                                onChange={handleInputChange}
                                className="border border-gray-300 p-2 w-full"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description">Descriere:</label>
                            <textarea
                                id="description"
                                name="description"
                                value={projectData.description}
                                onChange={handleInputChange}
                                className="border border-gray-300 p-2 w-full"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="client">Client:</label>
                            <Select
                                options={clients}
                                getOptionLabel={(client) => client.name}
                                getOptionValue={(client) => client.id.toString()}
                                value={selectedClient}
                                onChange={(newValue: SingleValue<Client> | null) => {
                                    setSelectedClient(newValue ?? undefined);
                                }} placeholder="Caută și selectează un client..."
                                isSearchable
                                className="border border-gray-300 p-2 w-full"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="address">Adresă:</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={projectData.address}
                                onChange={handleInputChange}
                                className="border border-gray-300 p-2 w-full"
                                required
                            />
                        </div>

                        <div>
                            <label>Materiale:</label>
                            {projectMaterials.map((material, index) => (
                                <div key={index} className="flex space-x-2 mb-2">
                                    <select
                                        value={material.materialId}
                                        onChange={(e) => handleMaterialChange(index, "materialId", parseInt(e.target.value))}
                                        className="border border-gray-300 p-2"
                                        required
                                    >
                                        <option value="">Selectează un material</option>
                                        {materials.map(mat => (
                                            <option key={mat.id} value={mat.id}>
                                                {mat.name} (Coef: {mat.coefficient})
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        type="number"
                                        placeholder="Cantitate"
                                        value={material.quantity}
                                        onChange={(e) => handleMaterialChange(index, "quantity", parseFloat(e.target.value))}
                                        className="border border-gray-300 p-2 w-1/2"
                                        required
                                    />

                                    {index === projectMaterials.length - 1 && (
                                        <button type="button" onClick={addMaterial}
                                                className="bg-blue-500 text-black px-4 py-2 rounded">
                                            +
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div>
                            <label>Utilizatori:</label>
                            <Select
                                options={users}
                                getOptionLabel={(user) => user.name}
                                getOptionValue={(user) => user.id.toString()}
                                value={selectedUsers}
                                onChange={handleUserChange}
                                placeholder="Caută și selectează utilizatori..."
                                isSearchable
                                isMulti
                                className="border border-gray-300 p-2 w-full"
                            />
                        </div>

                        <div>
                            <label htmlFor="price">Preț:</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={projectData.price}
                                onChange={handleInputChange}
                                className="border border-gray-300 p-2 w-full"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="advance">Avans:</label>
                            <input
                                type="number"
                                id="advance"
                                name="advance"
                                value={projectData.advance}
                                onChange={handleInputChange}
                                className="border border-gray-300 p-2 w-full"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="invoice">Factură:</label>
                            <input
                                type="checkbox"
                                id="invoice"
                                name="invoice"
                                checked={projectData.invoice}
                                onChange={() => setProjectData(prevState => ({
                                    ...prevState,
                                    invoice: !prevState.invoice
                                }))}
                            />
                        </div>

                        <div>
                            <label htmlFor="status">Status:</label>
                            <Select
                                options={getStatusOptions()}
                                value={{value: projectData.status, label: projectData.status}}
                                onChange={(selectedOption) => {
                                    if (selectedOption) { // Check for null
                                        setProjectData((prevState) => ({
                                            ...prevState,
                                            status: selectedOption.value,
                                        }));
                                    }
                                }}
                                placeholder="Selectează un status..."
                                className="border border-gray-300 p-2 w-full"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="startDate">Data de inceput:</label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={projectData.startDate}
                                onChange={handleInputChange}
                                className="border border-gray-300 p-2 w-full"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="limitDate">Data limita:</label>
                            <input
                                type="date"
                                id="limitDate"
                                name="limitDate"
                                value={projectData.limitDate}
                                onChange={handleInputChange}
                                className="border border-gray-300 p-2 w-full"
                                required
                            />
                        </div>

                        <button type="submit" className="bg-grey text-white px-4 py-2 rounded">
                            Salvează Modificările
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <Navbar/>
        </div>
    );
};

export default EditProjectPage;
