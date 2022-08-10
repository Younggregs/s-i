import {SERVER_URL} from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage';
export const SET_FRIENDS = "SET_FRIENDS";
export const TAG_FRIEND = "TAG_FRIEND";
export const UNTAG_FRIEND = "UNTAG_FRIEND"
export const SET_CONTACTS = "SET_CONTACTS";
export const TOGGLE_NOTIFICATION = "TOGGLE_NOTIFICATION";


export const request_invite = (contact_list) => {
    return async dispatch => {
        const formData = new FormData();
        formData.append("contact_list", contact_list);

        const response = await fetch(`${SERVER_URL}/request_invite/`, {
            method: 'POST',
            body: formData
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }

        return resData;
    };
};

export const create_invite = (phone_id) => {
    return async dispatch => {
        const token = getState().auth.token;
        const response = await fetch(`${SERVER_URL}/create_invite/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                phone_id
            })
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }

        return resData.message;
    };
};

export const fetchFriends = () => {
    return async (dispatch, getState) => {

        const token = getState().auth.token;
        const response = await fetch(`${SERVER_URL}/tag/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }

        // return resData.message;

        const res = [
            {
                id: '3iendad3903', 
                name: 'Jesse', 
                notification: false, 
                phone: '09403903390', 
                countryCode: '91',
            },
            {
                id: '33JDndad3903', 
                name: 'Diva', 
                notification: true, 
                phone: '09403903392', 
                countryCode: '91'
            },
            {
                id: 'ro3JDndad3903', 
                name: 'Bruv', 
                notification: false, 
                phone: '09403903220', 
                countryCode: '91'
            },
            {
                id: '300ndad3903', 
                name: 'Felicity', 
                notification: false, 
                phone: '09403903322', 
                countryCode: '91'
            },
            {
                id: '23JDndad3903', 
                name: 'Street', 
                notification: false, 
                phone: '09403903395', 
                countryCode: '91'
            },
            {
                id: '300nda23903', 
                name: 'Oluwadunsin Femidamilola', 
                notification: false, 
                phone: '08403903390', 
                countryCode: '91'
            },
            {
                id: '23JDn342d3903', 
                name: 'Mohammed Abdulsalam', 
                notification: false, 
                phone: '09423903390', 
                countryCode: '91'
            },
            {
                id: '23JDn3ntf42d3903', 
                name: 'Uche Okonkwo', 
                notification: false, 
                phone: '09403903390', 
                countryCode: '91'
            },
            {
                id: '23JDnd333903', 
                name: 'Zindirwe Danwanzam', 
                notification: false, 
                phone: '0940323390', 
                countryCode: '91'
            }
        ]

        dispatch({
            type: SET_FRIENDS,
            friends: res
        })
    }
};

export const tagFriend = (friend) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(`${SERVER_URL}/tag/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                phone: friend.phone_id,
                name: friend.name
            })
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }

        // return resData.message;

        dispatch({
            type: TAG_FRIEND,
            friend: friend
        })
    }
};


export const untagFriend = (friend) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(`${SERVER_URL}/tag/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                phone: friend.phone_id,
                name: friend.name
            })
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }

        // return resData.message;

        dispatch({
            type: UNTAG_FRIEND,
            id: id
        })
    }
};

export const toggleNotification = (phone_id, toggle) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(`${SERVER_URL}/toggle_notification/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                phone_id,
                toggle
            })
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }

        // return resData.message;

    
        dispatch({
            type: TOGGLE_NOTIFICATION,
            id: id
        })
    }
};

export const setContacts = (contacts) => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_CONTACTS,
            contacts: contacts
        })
    }
};