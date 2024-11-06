import axios from "axios";
import {employeesUrl} from "@/apis/urlConstants";
import {secureConfig} from "@/apis/config/apiConfigs";
import {EmployeeRequest} from "@/utils/types.tsx";

export const handleGetEmployees = (username: string, password: string) => {
    return axios.get(`${employeesUrl}`, secureConfig(username, password))
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error getting employees:', error);
            throw error;
        });
}

export const handleAddEmployees = (username: string, password: string, employee: EmployeeRequest) => {
    return axios.post(`${employeesUrl}`, employee, secureConfig(username, password));
}

export const handleDeleteEmployee = (username: string, password: string, employeeId: number) => {
    return axios.delete(`${employeesUrl}/${employeeId}`, secureConfig(username, password))
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error deleting employee:', error);
            throw error;
        });
}

export const handleUpdateEmployees = (username: string, password: string, employeeId: number, employee: EmployeeRequest) => {
    return axios.put(`${employeesUrl}/${employeeId}`, employee, secureConfig(username, password));
}

export const handleGetEmployeesById = (username: string, password: string, employeeId: number) => {
    return axios.get(`${employeesUrl}/${employeeId}`, secureConfig(username, password))
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error getting employee:', error);
            throw error;
        });
}