import { LOADING, LOAD_USER, LOGIN, LOGIN_FAIL, LOGOUT, ON_NEW_NOTIFICATION, ON_READ_NOTIFICATION, REMOVE_ALERT } from "./types";


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
        case ON_NEW_NOTIFICATION:
            const data = [payload, ...state.notifications.data];
            const count = state.notifications.count + 1;
            return {...state, notifications: {data, count}};
        case ON_READ_NOTIFICATION:
            return {...state, notifications: payload};
        case REMOVE_ALERT:
            return {...state, error: false, loading: false};
        default:
            return state;
    }
}