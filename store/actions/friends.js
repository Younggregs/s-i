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
        formData.append("contact_list", JSON.stringify(contact_list));

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

export const create_invite = (phone_id, name) => {
    return async dispatch => {
        let user = await AsyncStorage.getItem('user')
        user = JSON.parse(user)

        const formData = new FormData();
        formData.append("phone_id", phone_id);
        formData.append("name", name);

        const response = await fetch(`${SERVER_URL}/create_invite/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${user.token}`
            },
            body: formData
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }

        return resData;
    };
};

export const fetch_friends = () => {
    return async (dispatch, getState) => {

        let user = await AsyncStorage.getItem('user')
        user = JSON.parse(user)

        const response = await fetch(`${SERVER_URL}/tag/`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${user.token}`
            }
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }

        const resP = []
        await resData.map(friend => {
                const bucket = {  
                    id: friend.friend.id, 
                    name: friend.name, 
                    phone: friend.friend.phone_id,
                    notification: friend.notification
                }
            resP.unshift(bucket)
        })

        dispatch({
            type: SET_FRIENDS,
            friends: resP
        })
    }
};

export const tagFriend = (friend) => {
    return async (dispatch, getState) => {
        let user = await AsyncStorage.getItem('user')
        user = JSON.parse(user)

        const formData = new FormData();
        formData.append("phone_id", friend.phone_id);
        formData.append("name", friend.name);

        const response = await fetch(`${SERVER_URL}/tag/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${user.token}`
            },
            body: formData
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }
        if(!resData.error_message){
            dispatch({
                type: TAG_FRIEND,
                friend: resData
            })
        }
        return resData        
    }
};


export const untagFriend = (friend) => {
    return async (dispatch, getState) => {
        let user = await AsyncStorage.getItem('user')
        user = JSON.parse(user)

        const formData = new FormData();
        formData.append("phone_id", friend.phone);
        formData.append("name", friend.name);

        const response = await fetch(`${SERVER_URL}/tag/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${user.token}`
            },
            body: formData
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }

        dispatch({
            type: UNTAG_FRIEND,
            id: friend.id
        })
    }
};

export const toggleNotification = (friend, toggle) => {
    return async (dispatch, getState) => {
        let user = await AsyncStorage.getItem('user')
        user = JSON.parse(user)

        const formData = new FormData();
        formData.append("phone_id", friend.phone_id);
        formData.append("toggle", toggle);

        const response = await fetch(`${SERVER_URL}/toggle_notification/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${user.token}`
            },
            body: formData
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }
    
        dispatch({
            type: TOGGLE_NOTIFICATION,
            id: friend.id
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