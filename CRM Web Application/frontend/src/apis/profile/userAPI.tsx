import {signupUrl, usersUrl} from "@/apis/urlConstants";
import {secureConfig} from "@/apis/config/apiConfigs";
import axios from "axios";
import {Type} from "@/utils/types";

export const handleGetUser = (username: string, password: string) => {
    return axios.get(`${usersUrl}/byUsername/${username}`, secureConfig(username, password));
}
export const handleGetUsersByType = (username: string, password: string, type: Type) => {
    return axios.get(`${usersUrl}/byType/${type}`, secureConfig(username, password))
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error getting users by type:', error);
            throw error;
        });
}

export const handleGetUsers = (username: string, password: string) => {
    return axios.get(`${usersUrl}`, secureConfig(username, password))
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error getting users:', error);
            throw error;
        });
}

export const handleGetUsersByProjectId = (username: string, password: string, projectId: number) => {
    return axios.get(`${usersUrl}/byProject/${projectId}`, secureConfig(username, password))
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error getting users by projectId:', error);
            throw error;
        });
}

export const handleGetUserById = (username: string, password: string, userId: number) => {
    return axios.get(`${usersUrl}/byId/${userId}`, secureConfig(username, password))
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error getting user by id:', error);
            throw error;
        });
}

export const handleAddUser = (username: string, password: string, user: any) => {
    return axios.post(`${signupUrl}`, user, secureConfig(username, password));
}

export const handleDeleteUser = (username: string, password: string, userId: number) => {
    return axios.delete(`${usersUrl}/${userId}`, secureConfig(username, password));
}

export const handleUpdateUser = (username: string, password: string, userId: number, user: any) => {
    return axios.put(`${usersUrl}/${userId}`, user, secureConfig(username, password));
}