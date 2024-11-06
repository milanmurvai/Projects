import {
    handleAddClient,
    handleDeleteClient,
    handleGetClientById,
    handleGetClients,
    handleUpdateClient
} from "@/apis/client/clientAPI.tsx";
import {ClientRequest} from "@/utils/types";
import {clientAddFail, clientAddSuccess} from "@/apis/auth/responseConstants.tsx";

const getClients = () => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleGetClients(username!, password!)
        .then((response) => {
            return response;
        })

};

const addClient = (client: ClientRequest) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleAddClient(username!, password!, client)
        .then((response) => {
            return {status: response.status, message: clientAddSuccess};
        })
        .catch((err) => {
            return {status: err.status, message: clientAddFail};
        });

}

const deleteClient = (clientId: number) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleDeleteClient(username!, password!, clientId)
        .then((response) => {
            return response;
        })
}

const updateClient = (clientId: number, client: ClientRequest) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleUpdateClient(username!, password!, clientId, client)
        .then((response) => {
            return response.data;
        })


}

const getClientById = (clientId: number) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleGetClientById(username!, password!, clientId)
        .then((response) => {
            return response;
        })

}

export const ClientService = {
    getClients,
    addClient,
    deleteClient,
    getClientById,
    updateClient
}