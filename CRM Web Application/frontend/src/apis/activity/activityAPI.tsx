import axios from "axios";
import {activitiesUrl} from "@/apis/urlConstants";
import {secureConfig} from "@/apis/config/apiConfigs";
import {ActivityRequest} from "@/utils/types.tsx";

export const handleGetActivities = (username: string, password: string) => {
    return axios.get(`${activitiesUrl}`, secureConfig(username, password))
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error getting activities:', error);
            throw error;
        });
}

export const handleGetActivitiesByUser = (username: string, password: string, userId: number) => {
    return axios.get(`${activitiesUrl}/forUser/${userId}`, secureConfig(username, password))
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error getting activities:', error);
            throw error;
        });
}

export const handleAddActivity = (username: string, password: string, activity: ActivityRequest) => {
    return axios.post(`${activitiesUrl}`, activity, secureConfig(username, password));
}

export const handleDeleteActivity = (username: string, password: string, activityId: number) => {
    return axios.delete(`${activitiesUrl}/${activityId}`, secureConfig(username, password))
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error deleting activity:', error);
            throw error;
        });
}