import {
    handleAddEmployees,
    handleDeleteEmployee,
    handleGetEmployees,
    handleGetEmployeesById,
    handleUpdateEmployees
} from "@/apis/employee/employeeAPI.tsx";
import {EmployeeRequest} from "@/utils/types";
import {employeeAddFail, employeeAddSuccess} from "@/apis/auth/responseConstants.tsx";

const getEmployees = () => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleGetEmployees(username!, password!)
        .then((response) => {
            return response;
        })

};

const addEmployee = (employee: EmployeeRequest) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleAddEmployees(username!, password!, employee)
        .then((response) => {
            return {status: response.status, message: employeeAddSuccess};
        })
        .catch((err) => {
            return {status: err.status, message: employeeAddFail};
        });

}

const deleteEmployee = (employeeId: number) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleDeleteEmployee(username!, password!, employeeId)
        .then((response) => {
            return response;
        })

}

const updateEmployee = (employeeId: number, employee: EmployeeRequest) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleUpdateEmployees(username!, password!, employeeId, employee)
        .then((response) => {
            return response.data;
        })


}

const getEmployeeById = (employeeId: number) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleGetEmployeesById(username!, password!, employeeId)
        .then((response) => {
            return response;
        })

}

export const EmployeeService = {
    getEmployees,
    addEmployee,
    deleteEmployee,
    getEmployeeById,
    updateEmployee
}