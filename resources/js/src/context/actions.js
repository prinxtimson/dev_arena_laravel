
const axios = window.axios;
const BASE_URL = "http://127.0.0.1:8000";

export const loginUser = async (data) => {
    const config = {
        'Accept': 'applicatio/json',
    }

    try {
        const res = await axios.post(`${BASE_URL}/login`, data, config);
        console.log(res)
        //getUser(res.data.user.id);
        return {user: res.data};

    } catch (err) {
        console.log(err.response);
        return {error: err.response.data};
    }
}

export const getUser = async (user) => {
    try {
        const res = await axios.get(`${BASE_URL}/api/users/${user}`);
        console.log(res.data)
        return res.data;

    } catch (err) {
        console.log(err.response);
        return {error: err.response.data};
    }
}
