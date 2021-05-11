import {axios, BASE_URL, setAuthToken} from '../utils/utils';

export const loginUser = async (data) => {

    try {
        const res = await axios.post(`${BASE_URL}/login`, data);
        location.replace('/dashboard')
        return {...res.data, isAuthenticated: true};

    } catch (err) {
        console.log(err.response);
        if (err.response.status == 500){
            return {error: {message: 'Server errror, please try again.'}, isAuthenticated: false, token: null};
        }
        return {error: err.response.data, isAuthenticated: false, token: null};
    }
}

export const logoutUser = async () => {
    try {
        await axios.post(`${BASE_URL}/logout`);
        location.replace('/login');
        return {isAuthenticated: false};
    } catch (err) {
        console.log(err.response);
        if (err.response.status == 500){
            return {error: {message: 'Server errror, please try again.'}};
        }
        return {error: err.response.data};
    }
}

export const getUser = async () => {
    try {
        console.log(process.env.APP_ENV)
        const res = await axios.get(`${BASE_URL}/api/me`);

        return {user: res.data, isAuthenticated: true};

    } catch (err) {
        console.log(err.response);
        if (err.response.status == 500){
            return {error: {message: 'Server errror, please try again.'}, isAuthenticated: false, token: null};
        }
        
        return {isAuthenticated: false, token: null};
    }
}

export const getAllUsers = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/api/users`);
        
        return res.data;

    } catch (error) {
        
    }
}