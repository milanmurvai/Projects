import Navbar from "@/components/Navbar.tsx";
import {Employee, EmployeeRequest, User} from "@/utils/types.tsx"; // Ensure MaterialRequest is imported
import React, {useEffect, useMemo, useState} from "react";
import {UserService} from "@/apis/profile/UserService.tsx";
import {PencilIcon, TrashIcon} from "@heroicons/react/24/outline";
import {EmployeeService} from "@/apis/employee/EmployeeService.tsx";
import axios from "axios";

const WorkerPage = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [newEmployee, setNewEmployee] = useState<EmployeeRequest>({name: "", coefficient: 0, costCoefficient: 0}); // Ensure the type is EmployeeRequest
    const [currentUser, setCurrentUser] = useState<User>();
    const [showForm, setShowForm] = useState(false); // State to control form visibility
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showEditForm, setShowEditForm] = useState(false); // State to control form visibility
    const [employeeData, setEmployeeData] = useState<Employee>({
        id: 0,
        name: "",
        coefficient: 0,
        costCoefficient: 0
    });
    const [editEmployeeId, setEditEmployeeId] = useState<number>();

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

    const loadEmployees = async () => {
        try {
            setIsLoading(true);
            const employeesData = await EmployeeService.getEmployees();
            setEmployees(employeesData);
        } catch (err) {
            setError("Failed to load clients");
        } finally {
            setIsLoading(false);
        }
    };

    const loadEmployee = async () => {
        if (editEmployeeId) {
            const employee = await EmployeeService.getEmployeeById(editEmployeeId);
            setEmployeeData({
                id: employee.id,
                name: employee.name,
                coefficient: employee.coefficient,
                costCoefficient: employee.costCoefficient
            });
        }
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setEmployeeData(prevState => ({...prevState, [name]: value}));
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const employeeToSubmit = {...employeeData};
        await EmployeeService.updateEmployee(Number(editEmployeeId), employeeToSubmit);
        setShowEditForm(false); // Hide the form after submission
        alert("Angajatul actualizat cu succes");
        loadEmployees();
    };


    useEffect(() => {
        if (editEmployeeId) {
            loadEmployee();
        }
    }, [editEmployeeId]);


    useEffect(() => {
        if (currentUser && currentUser.username && currentUser.password && currentUser.id) {
            loadEmployees();
        }
    }, [currentUser]);

    const filteredEmployees = useMemo(() => {
        return employees.filter(
            (employee) =>
                employee.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [employees, searchTerm]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setNewEmployee((prev) => ({...prev, [name]: value}));
    };

    const handleDelete = async (employeeId: number) => {
        if (confirm("Sigur doriți să ștergeți acest angajat?")) {
            try {
                await EmployeeService.deleteEmployee(employeeId);
                setEmployees(employees.filter((employee) => employee.id !== employeeId));
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
            await EmployeeService.addEmployee(newEmployee); // Call the service to add the material
            setNewEmployee({name: "", coefficient: 0, costCoefficient: 0}); // Reset the form
            setShowForm(false); // Hide the form after submission
            loadEmployees(); // Reload materials to include the new one
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
                    <h1 className="text-2xl font-bold mb-6 text-[#C51321]">Angajati</h1>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Cauta angajati..."
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
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Coeficient</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Cost
                                        Coeficient
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actiuni</th>

                                </tr>
                                </thead>
                                <tbody className="divide-y divide-[#858C88]">
                                {filteredEmployees.map((employee) => (
                                    <tr key={employee.id} className="hover:bg-[#858C88] hover:bg-opacity-10">
                                        <td className="px-6 py-4 whitespace-nowrap text-[#3C4741]">{employee.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[#3C4741]">{employee.coefficient}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[#3C4741]">{employee.costCoefficient}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[#3C4741]">
                                            <button
                                                className="text-blue-500 hover:text-black"
                                                onClick={() => {
                                                    setEditEmployeeId(employee.id);
                                                    console.log("employeeId:" + employee.id);
                                                    setShowEditForm((prev) => !prev);
                                                    setShowForm(false);
                                                }}
                                                title="Editeaza Angajatul"
                                            >
                                                <PencilIcon className="h-5 w-5 inline"/>
                                            </button>
                                            <button
                                                className="text-red hover:text-red"
                                                onClick={() => handleDelete(employee.id)}
                                                title="Sterge angajatul"
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
                                            value={employeeData.name}
                                            onChange={handleEditInputChange}
                                            className="border border-gray-300 p-2 w-full"
                                            required
                                        />
                                    </div>
                                    <div className="mt-2">
                                        <label className="block mb-2">Coeficient:</label>
                                        <input
                                            type="text"
                                            id="coefficent"
                                            name="coefficient"
                                            value={employeeData.coefficient}
                                            onChange={handleEditInputChange}
                                            className="border border-gray-300 p-2 w-full"
                                            required
                                        />
                                    </div>
                                    <div className="mt-2">
                                        <label className="block mb-2">Cost Coeficient:</label>
                                        <input
                                            type="text"
                                            id="costCoefficient"
                                            name="costCoefficient"
                                            value={employeeData.costCoefficient}
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
                        onClick={() => setShowForm((prev) => !prev)}
                    >
                        Adauga Angajat
                    </button>
                    {showForm && ( // Render form conditionally
                        <form onSubmit={handleFormSubmit} className="mt-4">
                            <div>
                                <label className="block mb-2">Nume:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newEmployee.name}
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
                                    value={newEmployee.coefficient}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mt-2">
                                <label className="block mb-2">Cost Coeficient:</label>
                                <input
                                    type="text"
                                    name="costCoefficient"
                                    value={newEmployee.costCoefficient}
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


export default WorkerPage;
