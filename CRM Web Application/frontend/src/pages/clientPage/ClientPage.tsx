import Navbar from "@/components/Navbar.tsx";
import {Client, ClientRequest, User} from "@/utils/types.tsx";
import React, {useEffect, useMemo, useState} from "react";
import {ClientService} from "@/apis/client/ClientService.tsx";
import {UserService} from "@/apis/profile/UserService.tsx";
import {PencilIcon, TrashIcon} from "@heroicons/react/24/outline";
import {useLocation} from "react-router-dom";
import axios from 'axios';

const ClientsPage = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [currentUser, setCurrentUser] = useState<User>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [newClient, setNewClient] = useState<ClientRequest>({name: "", address: "", email: "", phone: ""}); // Ensure the type is MaterialRequest
    const [showForm, setShowForm] = useState(false); // State to control form visibility
    const [showEditForm, setShowEditForm] = useState(false); // State to control form visibility
    const [clientData, setClientData] = useState<Client>({
        id: 0,
        name: "",
        address: "",
        phone: "",
        email: ""
    });
    const [editClientId, setEditClientId] = useState<number>();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const editId = queryParams.get("editId");

    useEffect(() => {
        if (editId) {
            setEditClientId(parseInt(editId, 10));
            setShowEditForm(true); // Open the edit form
        }
    }, [editId]);

    useEffect(() => {
        loadUserInfo();
    }, []);

    const loadUserInfo = async () => {
        try {
            const user = await UserService.getCurrentUser();
            setCurrentUser(user);
        } catch (err) {
            setError("Failed to load user information");
            setIsLoading(false);
        }
    };

    const loadClients = async () => {
        try {
            setIsLoading(true);
            const clientsData = await ClientService.getClients();
            setClients(clientsData);
        } catch (err) {
            setError("Failed to load clients");
        } finally {
            setIsLoading(false);
        }
    };

    const loadClient = async () => {
        if (editClientId) {
            const client = await ClientService.getClientById(editClientId);
            setClientData({
                id: client.id,
                name: client.name,
                address: client.address,
                phone: client.phone,
                email: client.email
            });
        }
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setClientData(prevState => ({...prevState, [name]: value}));
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const clientToSubmit = {...clientData};
        await ClientService.updateClient(Number(editClientId), clientToSubmit);
        setShowEditForm(false); // Hide the form after submission
        alert("Client actualizat cu succes");
        loadClients();
    };

    useEffect(() => {
        if (editClientId) {
            loadClient();
        }
    }, [editClientId]);

    useEffect(() => {
        if (currentUser && currentUser.username && currentUser.password && currentUser.id) {
            loadClients();
        }
    }, [currentUser]);

    const filteredClients = useMemo(() => {
        return clients.filter(
            (client) =>
                client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [clients, searchTerm]);

    const handleDelete = async (clientId: number) => {
        if (confirm("Sigur doriți să ștergeți acest client?")) {
            try {
                await ClientService.deleteClient(clientId);
                setClients(clients.filter((client) => client.id !== clientId));
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    alert(error.response.data);
                } else {
                    alert("An unexpected error occurred.");
                }
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setNewClient((prev) => ({...prev, [name]: value}));
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await ClientService.addClient(newClient); // Call the service to add the material
            setNewClient({name: "", address: "", email: "", phone: ""}); // Reset the form
            setShowForm(false); // Hide the form after submission
            loadClients(); // Reload materials to include the new one
        } catch (error) {
            console.error("Failed to add client:", error);
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0C1911]">
                <div className="bg-[#FFFFFF] p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4 text-[#C51321]">Error</h2>
                    <p className="text-[#3C4741]">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#FFFFFF] min-h-screen">
            <Navbar/>
            <div className="container mx-auto py-10 px-4">
                <div className="bg-[#FFFFFF] rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold mb-6 text-[#C51321]">Clienti</h1>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Cauta clienti..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full max-w-md px-4 py-2 border border-[#858C88] rounded-md focus:outline-none focus:ring-2 focus:ring-[#C51321] text-[#3C4741]"
                        />
                    </div>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div
                                className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C51321]"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-[#FFFFFF]">
                                <thead className="bg-[#3C4741] text-[#FFFFFF]">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nume</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Adresa</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Telefon</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actiuni</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-[#858C88]">
                                {filteredClients.map((client) => (
                                    <tr key={client.id} className="hover:bg-[#858C88] hover:bg-opacity-10">
                                        <td className="px-6 py-4 whitespace-nowrap text-[#3C4741]">{client.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[#3C4741]">{client.address}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[#3C4741]">{client.phone}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[#3C4741]">{client.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[#3C4741]">
                                            <button
                                                className="text-blue-500 hover:text-black"
                                                onClick={() => {
                                                    setEditClientId(client.id);
                                                    console.log("clientId:" + client.id);
                                                    setShowEditForm((prev) => !prev);
                                                    setShowForm(false);
                                                }}
                                                title="Editeaza clientul"
                                            >
                                                <PencilIcon className="h-5 w-5 inline"/>
                                            </button>
                                            <button
                                                className="text-red hover:text-red"
                                                onClick={() => handleDelete(client.id)}
                                                title="Sterge clientul"
                                            >
                                                <TrashIcon className="h-5 w-5 inline"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            {showEditForm && ( // Render form conditionally
                                <form onSubmit={handleEditSubmit} className="mt-4">
                                    <div>
                                        <label className="block mb-2">Nume:</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={clientData.name}
                                            onChange={handleEditInputChange}
                                            className="border border-gray-300 p-2 w-full"
                                            required
                                        />
                                    </div>
                                    <div className="mt-2">
                                        <label className="block mb-2">Adresa:</label>
                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            value={clientData.address}
                                            onChange={handleEditInputChange}
                                            className="border border-gray-300 p-2 w-full"
                                            required
                                        />
                                    </div>
                                    <div className="mt-2">
                                        <label className="block mb-2">Email:</label>
                                        <input
                                            type="text"
                                            id="email"
                                            name="email"
                                            value={clientData.email}
                                            onChange={handleEditInputChange}
                                            className="border border-gray-300 p-2 w-full"
                                            required
                                        />
                                    </div>
                                    <div className="mt-2">
                                        <label className="block mb-2">Telefon:</label>
                                        <input
                                            type="text"
                                            id="phone"
                                            name="phone"
                                            value={clientData.phone}
                                            onChange={handleEditInputChange}
                                            className="border border-gray-300 p-2 w-full"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-grey text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
                                    >
                                        Salveaza Modificarile
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                    <button
                        className="bg-black text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
                        onClick={() => {
                            setShowForm((prev) => !prev);
                            setShowEditForm(false);
                        }}
                    >
                        Adauga Client
                    </button>
                    {showForm && ( // Render form conditionally
                        <form onSubmit={handleFormSubmit} className="mt-4">
                            <div>
                                <label className="block mb-2">Nume:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newClient.name}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mt-2">
                                <label className="block mb-2">Adresa:</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={newClient.address}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mt-2">
                                <label className="block mb-2">Email:</label>
                                <input
                                    type="text"
                                    name="email"
                                    value={newClient.email}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mt-2">
                                <label className="block mb-2">Telefon:</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={newClient.phone}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 p-2 w-full"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-grey text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
                            >
                                Adauga
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientsPage;