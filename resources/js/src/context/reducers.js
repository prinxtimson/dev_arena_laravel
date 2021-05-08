import { LOADING, LOAD_USER, LOGIN, LOGIN_FAIL, LOGOUT, REMOVE_ALERT } from "./types";


export const userReducer = (state, action) => {
    const {type, payload} = action;

    switch (type) {
        case LOADING:
            return {...state, loading: true};
        case LOGIN:
            return {...state, ...payload, loading: false};
        case LOGOUT:
            return {...state, ...payload, loading: false};
        case LOAD_USER:
            return {...state, ...payload, loading: false};
        case REMOVE_ALERT:
            return {...state, error: false, loading: false};
        default:
            return state;
    }
}