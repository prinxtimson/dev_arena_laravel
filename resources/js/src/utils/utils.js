export const axios = window.axios;
//export const BASE_URL = 'http://127.0.0.1:8000' 
export const BASE_URL = 'https://tritekdevarena.herokuapp.com';

export const generatePassword = (len) => {
    let result = [];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@-%$#!&+?';
    const charLength = characters.length;
    for (let i = 0; i < len; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charLength)));
    }
    return result.join('');
}

export const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };