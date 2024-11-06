import {Type, User} from "@/utils/types";
import {
    handleAddUser,
    handleDeleteUser,
    handleGetUser,
    handleGetUserById,
    handleGetUsers,
    handleGetUsersByProjectId,
    handleGetUsersByType,
    handleUpdateUser
} from "./userAPI";

const getCurrentUser = () => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    return handleGetUser(username!, password!)
        .then((response) => {
            return response.data;
        }) as Promise<User>;
};

const getUsersByType = (type: Type) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleGetUsersByType(username!, password!, type)
        .then((response) => {
            return response;
        })

}

const getUsers = () => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleGetUsers(username!, password!)
        .then((response) => {
            return response;
        })

}

const getUsersByProjectId = (projectId: number) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleGetUsersByProjectId(username!, password!, projectId)
        .then((response) => {
            return response;
        })

}

const getUserById = (userId: number) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleGetUserById(username!, password!, userId)
        .then((response) => {
            return response;
        })

}

const addUser = (user: any) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleAddUser(username!, password!, user)
        .then((response) => {
            return response;
        })

}

const deleteUser = (userId: number) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleDeleteUser(username!, password!, userId)
        .then((response) => {
            return response;
        })


}

const updateUser = (userId: number, user: any) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleUpdateUser(username!, password!, userId, user)
        .then((response) => {
            return response;
        })

}

export const UserService = {
    getCurrentUser,
    getUsersByType,
    getUsers,
    getUsersByProjectId,
    getUserById,
    addUser,
    deleteUser,
    updateUser
};