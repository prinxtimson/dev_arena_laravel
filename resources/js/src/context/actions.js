
const axios = window.axios;
const BASE_URL = "http://127.0.0.1:8000";

export const loginUser = async (data) => {
    const config = {
        'Accept': 'applicatio/json',
    }

    try {
        const res = await axios.post(`${BASE_URL}/login`, data, config);
       
        return {user: res.data, isAuthenticated: true};

    } catch (err) {
        console.log(err.response);
        return {error: err.response.data};
    }
}

export const logoutUser = async () => {
    try {
        await axios.post(`${BASE_URL}/logout`);

        return {isAuthenticated: false, user: null}
    } catch (err) {
        console.log(err.response);
        return {error: err.response.data, isAuthenticated: false,};
    }
}

export const getUser = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/api/me`);
        
        return {user: res.data, isAuthenticated: true};

    } catch (err) {
        console.log(err.response);
        return {error: err.response.data, isAuthenticated: false,};
    }
}
