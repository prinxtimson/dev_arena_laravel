import {axios, BASE_URL, setAuthToken} from '../utils/utils';

export const loginUser = async (data) => {
    const config = {
        'Accept': 'applicatio/json',
    }

    try {
        const res = await axios.post(`${BASE_URL}/login`, data, config);
        console.log(res.data)
        localStorage.setItem('DEV-ARENA-TOKEN', res.data.token);
        setAuthToken(res.data.token);
        return {...res.data, isAuthenticated: true};

    } catch (err) {
        console.log(err.response);
        if (err.response.status == 500){
            return {error: 'Server errror, please try again.', isAuthenticated: false, token: null};
        }
        return {error: err.response.data, isAuthenticated: false, token: null};
    }
}

export const logoutUser = async () => {
    try {
        const res = await axios.post(`${BASE_URL}/logout`);
        console.log(res.data)
        localStorage.removeItem('DEV-ARENA-TOKEN');
        setAuthToken();
        window.location.reload()
    } catch (err) {
        console.log(err.response);
        if (err.response.status == 500){
            return {error: 'Server errror, please try again.'};
        }
        return {error: err.response.data};
    }
}

export const getUser = async () => {
    try {
        const token = localStorage.getItem('DEV-ARENA-TOKEN');

        setAuthToken(token);

        const res = await axios.get(`${BASE_URL}/me`);
        console.log(res.data)
        return {user: res.data, isAuthenticated: true};

    } catch (err) {
        console.log(err.response);
        if (err.response.status == 500){
            return {error: 'Server errror, please try again.', isAuthenticated: false, token: null};
        }
        localStorage.removeItem('DEV-ARENA-TOKEN');
        setAuthToken();
        return {isAuthenticated: false, token: null};
    }
}

export const getAllUsers = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/users`);
        
        return res.data;

    } catch (error) {
        
    }
}