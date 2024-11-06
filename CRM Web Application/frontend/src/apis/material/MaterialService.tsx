import {
    handleAddMaterial,
    handleDeleteMaterial,
    handleGetMaterialById,
    handleGetMaterials
} from "@/apis/material/materialAPI.tsx";
import {MaterialRequest} from "@/utils/types";
import {materialAddFail, materialAddSuccess} from "@/apis/auth/responseConstants.tsx";

const getMaterials = () => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleGetMaterials(username!, password!)
        .then((response) => {
            return response;
        })

};

const addMaterial = (materialRequest: MaterialRequest) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleAddMaterial(username!, password!, materialRequest)
        .then((response) => {
            return {status: response.status, message: materialAddSuccess};
        })
        .catch((err) => {
            return {status: err.status, message: materialAddFail};
        });

}

const deleteMaterial = (clientId: number) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleDeleteMaterial(username!, password!, clientId)
        .then((response) => {
            return response;
        })

}

const getMaterialById = (clientId: number) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleGetMaterialById(username!, password!, clientId)
        .then((response) => {
            return response;
        })

}

export const MaterialService = {
    getMaterials,
    addMaterial,
    deleteMaterial,
    getMaterialById
}