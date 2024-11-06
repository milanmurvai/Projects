import axios from "axios";
import {materialsUrl} from "@/apis/urlConstants";
import {secureConfig} from "@/apis/config/apiConfigs";
import {MaterialRequest} from "@/utils/types.tsx";

export const handleGetMaterials = (username: string, password: string) => {
    return axios.get(`${materialsUrl}`, secureConfig(username, password))
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error getting materials:', error);
            throw error;
        });
}

export const handleAddMaterial = (username: string, password: string, material: MaterialRequest) => {
    return axios.post(`${materialsUrl}`, material, secureConfig(username, password));
}

export const handleDeleteMaterial = (username: string, password: string, materialId: number) => {
    return axios.delete(`${materialsUrl}/${materialId}`, secureConfig(username, password))
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error deleting material:', error);
            throw error;
        });
}

export const handleGetMaterialById = (username: string, password: string, materialId: number) => {
    return axios.get(`${materialsUrl}/${materialId}`, secureConfig(username, password))
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error getting material:', error);
            throw error;
        });
}