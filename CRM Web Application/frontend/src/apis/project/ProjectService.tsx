import {
    handleAddProject,
    handleAddUserToProject,
    handleDeleteProject,
    handleGetProject,
    handleGetProjects,
    handleGetProjectsByUser,
    handleRemoveUserFromProject,
    handleUpdateProject
} from "@/apis/project/projectAPI.tsx";
import {ProjectRequest} from "@/utils/types";
import {projectAddFail, projectAddSuccess} from "@/apis/auth/responseConstants.tsx";

const getProjects = () => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleGetProjects(username!, password!)
        .then((response) => {
            return response;
        })

};

const getProjectsByUser = (userId: number) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleGetProjectsByUser(username!, password!, userId)
        .then((response) => {
            return response;
        })

}

const addProject = (project: ProjectRequest) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleAddProject(username!, password!, project)
        .then((response) => {
            if (response.status === 200) {
                return {
                    status: 200,
                    data: response.data,
                    message: projectAddSuccess
                };
            }
            return {
                status: response.status,
                data: undefined,
                message: projectAddFail
            };
        })
        .catch((err) => {
            return {
                status: err.status,
                data: undefined,
                message: projectAddFail
            };
        });
};


const deleteProject = (projectId: number) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleDeleteProject(username!, password!, projectId)
        .then((response) => {
            return response;
        })

}

const getProject = (projectId: number) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleGetProject(username!, password!, projectId)
        .then((response) => {
            return response;
        })

}

const updateProject = (projectId: number, project: ProjectRequest) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleUpdateProject(username!, password!, projectId, project)
        .then((response) => {
            return response.data;
        })


}

const addUserToProject = (projectId: number, userId: number) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleAddUserToProject(username!, password!, projectId, userId)
        .then((response) => {
            return response;
        })

}

const removeUserFromProject = (projectId: number, userId: number) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleRemoveUserFromProject(username!, password!, projectId, userId)
        .then((response) => {
            return response;
        })

}

export const ProjectService = {
    getProjects,
    addProject,
    deleteProject,
    getProject,
    updateProject,
    addUserToProject,
    removeUserFromProject,
    getProjectsByUser
}