import React, {useEffect, useState} from "react";
import {Type, User} from "@/utils/types"; // Import your types
import {Toaster} from "@/components/ui/toaster.tsx";
import {UserService} from "@/apis/profile/UserService.tsx"; // Style for the page

const EmployeePage: React.FC = () => {
    const [employees, setEmployees] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch employees on component mount
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await UserService.getUsersByType(Type.ANGAJAT); // Fetch employees
                setEmployees(response.data); // Assuming the response has a `data` field containing users
            } catch (error) {
                console.error("Error fetching employees:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="employee-page flex flex-col items-center justify-center bg-white">
            <h1 className="text-3xl font-bold">Employee List</h1>
            <div className="employee-list w-full max-w-4xl p-4 space-y-4">
                {employees.length > 0 ? (
                    employees.map((employee) => (
                        <div
                            key={employee.id}
                            className="employee-item p-4 border border-gray-300 rounded-lg shadow-sm"
                        >
                            <h2 className="text-xl font-semibold">{employee.name}</h2>
                            <p>Role: Employee</p> {/* Type is ANGAJAT */}
                        </div>
                    ))
                ) : (
                    <p>No employees found</p>
                )}
            </div>
            <Toaster/>
        </div>
    );
};

export default EmployeePage;
