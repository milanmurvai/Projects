import axios from "axios";
import {projectsUrl} from "@/apis/urlConstants";
import {secureConfig} from "@/apis/config/apiConfigs";
import {ProjectRequest} from "@/utils/types.tsx";

export const handleGetProjects = (username: string, password: string) => {
    return axios.get(`${projectsUrl}`, secureConfig(username, password))
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error getting projects:', error);
            throw error;
        });
}

export const handleGetProjectsByUser = (username: string, password: string, userId: number) => {
    return axios.get(`${projectsUrl}/byUser/${userId}`, secureConfig(username, password))
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error getting projects:', error);
            throw error;
        });

}

export const handleAddProject = (username: string, password: string, project: ProjectRequest) => {
    return axios.post(`${projectsUrl}`, project, secureConfig(username, password));
}

export const handleDeleteProject = (username: string, password: string, projectId: number) => {
    return axios.delete(`${projectsUrl}/${projectId}`, secureConfig(username, password))
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error deleting project:', error);
            throw error;
        });
}

export const handleGetProject = (username: string, password: string, projectId: number) => {
    return axios.get(`${projectsUrl}/${projectId}`, secureConfig(username, password))
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error getting project:', error);
            throw error;
        });
}

export const handleUpdateProject = (username: string, password: string, projectId: number, project: ProjectRequest) => {
    return axios.put(`${projectsUrl}/${projectId}`, project, secureConfig(username, password));
}

export const handleAddUserToProject = (username: string, password: string, projectId: number, userId: number) => {
    return axios.put(`${projectsUrl}/${projectId}/addUser/${userId}`, {}, secureConfig(username, password));
}

export const handleRemoveUserFromProject = (username: string, password: string, projectId: number, userId: number) => {
    return axios.put(`${projectsUrl}/${projectId}/removeUser/${userId}`, {}, secureConfig(username, password));
}