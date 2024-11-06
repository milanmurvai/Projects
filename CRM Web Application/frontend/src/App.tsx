import {Suspense} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";

import SignInPage from "./pages/auth/SignInPage";
// import SignUpPage from "./pages/auth/SignUpPage";
import {Toaster} from "sonner";
import UserProfilePage from "./pages/userPage/UserProfilePage";
import ProjectPage from "@/pages/projectPage/ProjectPage.tsx";
import ClientsPage from "@/pages/clientPage/ClientPage.tsx";
import MaterialsPage from "./pages/materialPage/MaterialPage";
import AddProjectPage from "@/pages/projectPage/AddProjectPage.tsx";
import EditProjectPage from "@/pages/projectPage/EditProjectPage.tsx";
import ActivityPage from "@/pages/activityPage/ActivityPage.tsx";
import WorkerPage from "@/pages/workersPage/WorkerPage.tsx";
import AddActivityPage from "@/pages/activityPage/AddActivityPage.tsx";
import UserPage from "@/pages/userPage/UserPage.tsx";

function App() {
    return (
        <>
            <BrowserRouter>
                <Suspense fallback={<div>Loading...</div>}>
                    <Toaster/>
                    <Routes>
                        <Route path="/" element={<ProjectPage/>}/>
                        <Route path="/sign-in" element={<SignInPage/>}/>
                        {/*<Route path="/sign-up" element={<SignUpPage/>}/>*/}
                        <Route path="/profile" element={<UserProfilePage/>}/>
                        <Route path="/projects" element={<ProjectPage/>}/>
                        <Route path="/add-project" element={<AddProjectPage/>}/>
                        <Route path="/edit-project/:projectId" element={<EditProjectPage/>}/>
                        <Route path="/clients" element={<ClientsPage/>}/>
                        <Route path="/materials" element={<MaterialsPage/>}/>
                        <Route path="/employees" element={<WorkerPage/>}/>
                        <Route path="/activities" element={<ActivityPage/>}/>
                        <Route path="/add-activity" element={<AddActivityPage/>}/>
                        <Route path="/users" element={<UserPage/>}/>
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </>
    );
}

export default App;
