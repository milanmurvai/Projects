import Navbar from "@/components/Navbar.tsx";
import {Type, User} from "@/utils/types.tsx";
import React, {useEffect, useMemo, useState} from "react";
import {UserService} from "@/apis/profile/UserService.tsx";
import {PencilIcon, TrashIcon} from "@heroicons/react/24/outline";
import Select from "react-select";
import axios from "axios";

const UserPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [newUser, setNewUser] = useState<User>({
        id: "",
        name: "",
        username: "",
        password: "",
        projects: [],
        type: Type.ANGAJAT
    }); // Ensure the type is MaterialRequest
    const [showForm, setShowForm] = useState(false); // State to control form visibility
    const [showEditForm, setShowEditForm] = useState(false); // State to control form visibility
    const [userData, setUserData] = useState<User>({
        id: "",
        username: "",
        password: "",
        name: "",
        type: Type.ANGAJAT,
        projects: []
    });
    const [editUserId, setEditUserId] = useState<number>();

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

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const usersData = await UserService.getUsers();
            setUsers(usersData);
        } catch (err) {
            setError("Failed to load users");
        } finally {
            setIsLoading(false);
        }
    };

    const loadUser = async () => {
        if (editUserId) {
            const user = await UserService.getUserById(editUserId);
            setUserData({
                id: user.id,
                username: user.username,
                password: user.password,
                name: user.name,
                type: user.type,
                projects: user.projects
            });
        }
    };

    const getTypeOptions = () => {
        return Object.keys(Type).map((key) => ({
            value: Type[key as keyof typeof Type],
            label: Type[key as keyof typeof Type],
        }));
    };
    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setUserData(prevState => ({...prevState, [name]: value}));
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userToSubmit = {...userData};
        await UserService.updateUser(Number(editUserId), userToSubmit);
        setShowEditForm(false); // Hide the form after submission
        alert("User actualizat cu succes");
        loadUsers();
    };

    useEffect(() => {
        if (editUserId) {
            loadUser();
        }
    }, [editUserId]);

    useEffect(() => {
        if (currentUser && currentUser.username && currentUser.password && currentUser.id) {
            loadUsers();
        }
    }, [currentUser]);

    const filteredUsers = useMemo(() => {
        return users.filter(
            (users) =>
                users.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                users.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const handleDelete = async (userId: number) => {
        if (confirm("Sigur doriți să ștergeți acest user?")) {
            try {
                await UserService.deleteUser(userId);
                setUsers(users.filter((user) => Number(user.id) !== userId));
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
        setNewUser((prev) => ({...prev, [name]: value}));
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await UserService.addUser(newUser); // Call the service to add the material
            setNewUser({id: "", name: "", username: "", password: "", projects: [], type: Type.ANGAJAT})
            setShowForm(false); // Hide the form after submission
            loadUsers(); // Reload materials to include the new one
        } catch (error) {
            console.error("Failed to add User:", error);
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
                    <h1 className="text-2xl font-bold mb-6 text-[#C51321]">Utilizatori</h1>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Cauta utilizatori..."
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
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Parola</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tip</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actiuni</th>

                                </tr>
                                </thead>
                                <tbody className="divide-y divide-[#858C88]">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-[#858C88] hover:bg-opacity-10">
                                        <td className="px-6 py-4 whitespace-nowrap text-[#3C4741]">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[#3C4741]">{user.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[#3C4741]">{user.password}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[#3C4741]">{user.type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[#3C4741]">
                                            <button
                                                className="text-blue-500 hover:text-black"
                                                onClick={() => {
                                                    setEditUserId(Number(user.id));
                                                    console.log("userId:" + user.id);
                                                    setShowEditForm((prev) => !prev);
                                                    setShowForm(false);
                                                }}
                                                title="Editeaza userul"
                                            >
                                                <PencilIcon className="h-5 w-5 inline"/>
                                            </button>
                                            <button
                                                className="text-red hover:text-red"
                                                onClick={() => handleDelete(Number(user.id))}
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
                                            value={userData.name}
                                            onChange={handleEditInputChange}
                                            className="border border-gray-300 p-2 w-full"
                                            required
                                        />
                                    </div>
                                    <div className="mt-2">
                                        <label className="block mb-2">Username:</label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={userData.username}
                                            onChange={handleEditInputChange}
                                            className="border border-gray-300 p-2 w-full"
                                            required
                                        />
                                    </div>
                                    <div className="mt-2">
                                        <label className="block mb-2">Parola:</label>
                                        <input
                                            type="text"
                                            id="password"
                                            name="password"
                                            value={userData.password}
                                            onChange={handleEditInputChange}
                                            className="border border-gray-300 p-2 w-full"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2">Tip:</label>
                                        <Select
                                            options={getTypeOptions()}
                                            value={{value: userData.type, label: userData.type}}
                                            onChange={(selectedOption) => {
                                                if (selectedOption) { // Check if selectedOption is not null
                                                    setUserData((prevState) => ({
                                                        ...prevState,
                                                        type: selectedOption.value,
                                                    }));
                                                }
                                            }}

                                            placeholder="Selectează un tip..."
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
                        Adauga User
                    </button>
                    {showForm && ( // Render form conditionally
                        <form onSubmit={handleFormSubmit} className="mt-4">
                            <div>
                                <label className="block mb-2">Nume:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newUser.name}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mt-2">
                                <label className="block mb-2">Username:</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={newUser.username}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mt-2">
                                <label className="block mb-2">Password:</label>
                                <input
                                    type="text"
                                    name="password"
                                    value={newUser.password}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 p-2 w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Tip:</label>
                                <Select
                                    options={getTypeOptions()}
                                    value={{value: userData.type, label: userData.type}}
                                    onChange={(selectedOption) => {
                                        if (selectedOption) { // Check for null
                                            setUserData((prevState) => ({
                                                ...prevState,
                                                type: selectedOption.value,
                                            }));
                                        }
                                    }}
                                    placeholder="Selectează un tip..."
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

export default UserPage;