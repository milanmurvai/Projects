import {handleLogin, handleSignup} from "@/apis/auth/authAPI.tsx";
import {LoginRequest, User} from "@/utils/types.tsx";
import {loginFail, loginSuccess, signupSuccess} from "@/apis/auth/responseConstants.tsx";

const signup = (data: User) => {
    return handleSignup(data)
        .then((res) => {
            return res;
        })
        .then((data) => {
            history.pushState({}, '', '/sign-in');
            location.reload();
            return {status: data.status, message: signupSuccess};
        })
        .catch((err) => {
            const status = err.response ? err.response.status : 500;
            const message = err.response ? loginFail + err.response.data : loginFail + " Unknown error occurred";

            return {status, message};
        });
}

const login = (data: LoginRequest) => {
    return handleLogin(data)
        .then((res) => {
            return res;
        })
        .then((res) => {
            localStorage.setItem('username', data.username);
            localStorage.setItem('password', data.password);
            history.pushState({}, '', '/');
            location.reload();
            return {status: res.status, message: loginSuccess};
        })
        .catch((err) => {
            localStorage.removeItem('username');
            localStorage.removeItem('password');
            const status = err.response ? err.response.status : 500; // Default to 500 (Internal Server Error) if undefined
            const message = err.response ? loginFail + err.response.data : loginFail + " Unknown error occurred";

            return {status, message};
        });
}

const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    history.pushState({}, '', '/sign-in');
    location.reload();
}

const loginPage = () => {
    history.pushState({}, '', '/sign-in');
    location.reload();
}

export const AuthService = {
    logout,
    signup,
    login,
    loginPage
};