import axios from "axios";
import {clientsUrl} from "@/apis/urlConstants";
import {secureConfig} from "@/apis/config/apiConfigs";
import {ClientRequest} from "@/utils/types.tsx";

export const handleGetClients = (username: string, password: string) => {
    return axios.get(`${clientsUrl}`, secureConfig(username, password))
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error getting clients:', error);
            throw error;
        });
}

export const handleAddClient = (username: string, password: string, client: ClientRequest) => {
    return axios.post(`${clientsUrl}`, client, secureConfig(username, password));
}

export const handleDeleteClient = (username: string, password: string, clientId: number) => {
    return axios.delete(`${clientsUrl}/${clientId}`, secureConfig(username, password))
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error deleting client:', error);
            throw error;
        });
}

export const handleUpdateClient = (username: string, password: string, clientId: number, client: ClientRequest) => {
    return axios.put(`${clientsUrl}/${clientId}`, client, secureConfig(username, password));
}

export const handleGetClientById = (username: string, password: string, clientId: number) => {
    return axios.get(`${clientsUrl}/${clientId}`, secureConfig(username, password))
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error getting client:', error);
            throw error;
        });
}