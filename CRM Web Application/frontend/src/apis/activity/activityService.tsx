import {
    handleAddActivity,
    handleDeleteActivity,
    handleGetActivities,
    handleGetActivitiesByUser
} from "@/apis/activity/activityAPI.tsx";
import {ActivityRequest} from "@/utils/types";
import {activityAddFail, activityAddSuccess} from "@/apis/auth/responseConstants.tsx";

const getActivities = () => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleGetActivities(username!, password!)
        .then((response) => {
            return response;
        })

};

const getActivitiesByUser = (userId: number) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleGetActivitiesByUser(username!, password!, userId)
        .then((response) => {
            return response;
        })


}

const addActivity = (activity: ActivityRequest) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleAddActivity(username!, password!, activity)
        .then((response) => {
            return {status: response.status, message: activityAddSuccess};
        })
        .catch((err) => {
            return {status: err.status, message: activityAddFail};
        });

}

const deleteActivity = (activityId: number) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return handleDeleteActivity(username!, password!, activityId)
        .then((response) => {
            return response;
        })

}
export const ActivityService = {
    getActivities,
    addActivity,
    deleteActivity,
    getActivitiesByUser
}