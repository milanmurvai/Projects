import Navbar from "@/components/Navbar.tsx";
import {Material, MaterialRequest, User} from "@/utils/types.tsx"; // Ensure MaterialRequest is imported
import {useEffect, useMemo, useState} from "react";
import {MaterialService} from "@/apis/material/MaterialService.tsx";
import {UserService} from "@/apis/profile/UserService.tsx";
import {TrashIcon} from "@heroicons/react/24/outline";
import axios from "axios";

const MaterialsPage = () => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [currentUser, setCurrentUser] = useState<User>();
    const [showForm, setShowForm] = useState(false); // State to control form visibility
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [newMaterial, setNewMaterial] = useState<MaterialRequest>({name: "", coefficient: 0}); // Ensure the type is MaterialRequest

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

    const loadMaterials = async () => {
        try {
            setIsLoading(true);
            const materialsData = await MaterialService.getMaterials();
            setMaterials(materialsData);
        } catch (err) {
            setError("Failed to load clients");
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        if (currentUser && currentUser.username && currentUser.password && currentUser.id) {
            loadMaterials();
        }
    }, [currentUser]);

    const filteredMaterials = useMemo(() => {
        return materials.filter(
            (material) =>
                material.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [materials, searchTerm]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setNewMaterial((prev) => ({...prev, [name]: value}));
    };

    const handleDelete = async (materialId: number) => {
        if (confirm("Sigur doriți să ștergeți acest material?")) {
            try {
                await MaterialService.deleteMaterial(materialId);
                setMaterials(materials.filter((material) => material.id !== materialId));
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    alert(error.response.data);
                } else {
                    alert("An unexpected error occurred.");
                }
            }
        }
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await MaterialService.addMaterial(newMaterial); // Call the service to add the material
            setNewMaterial({name: "", coefficient: 0}); // Reset the form
            setShowForm(false); // Hide the form after submission
            loadMaterials(); // Reload materials to include the new one
        } catch (error) {
            console.error("Failed to add material:", error);
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
                    <h1 className="text-2xl font-bold mb-6 text-[#C51321]">Materiale</h1>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Cauta materiale..."
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
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Denumire</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Coeficient</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actiuni</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-[#858C88]">
                                {filteredMaterials.map((material) => (
                                    <tr key={material.id} className="hover:bg-[#858C88] hover:bg-opacity-10">
                                        <td className="px-6 py-4 whitespace-nowrap text-[#3C4741]">{material.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[#3C4741]">{material.coefficient}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[#3C4741]">
                                            <button
                                                className="text-red hover:text-red"
                                                onClick={() => handleDelete(material.id)}
                                                title="Sterge materialul"
                                            >
                                                <TrashIcon className="h-5 w-5 inline"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <button
                        className="bg-black text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
                        onClick={() => setShowForm((prev) => !prev)}
                    >
                        Adauga Material
                    </button>
                    {showForm && ( // Render form conditionally
                        <form onSubmit={handleFormSubmit} className="mt-4">
                            <div>
                                <label className="block mb-2">Denumire:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newMaterial.name}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mt-2">
                                <label className="block mb-2">Coeficient:</label>
                                <input
                                    type="text"
                                    name="coefficient"
                                    value={newMaterial.coefficient}
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


export default MaterialsPage;
