import {SERVER_URL} from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment'
export const SET_CATEGORIES = "SET_CATEGORIES";
export const SELECT_CATEGORY = "SELECT_CATEGORY";
export const SELECT_TOGGLE_CATEGORY = "SELECT_TOGGLE_CATEGORY";
export const ADD_INTEREST = "ADD_INTEREST"
export const FETCH_INTERESTS = "FETCH_INTERESTS"
export const TOGGLE_INTEREST = "TOGGLE_INTEREST"
export const DELETE_INTEREST = "DELETE_INTEREST"

export const fetchCategories = () => {
    return async (dispatch, getState) => {
        const resData = [
            {id: '1', name: 'YouTube', slug:'youtube', active: false},
            {id: '2', name: 'Spotify', slug:'spotify', active: true},
            {id: '3', name: 'Twitter', slug:'twitter', active: false},
            {id: '4', name: 'Instagram', slug:'instagram', active: false},
            {id: '5', name: 'Tiktok', slug:'tiktok', active: false},
            {id: '6', name: 'Snapchat', slug:'snapchat', active: false},
            {id: '7', name: 'Facebook', slug:'facebook', active: false},
            {id: '8', name: 'Netflix', slug:'netflix', active: false},
            {id: '9', name: 'Others', slug:'others', active: false}
        ]

        dispatch({
            type: SET_CATEGORIES,
            categories: resData
        })
    }
};


export const selectCategory = (categoryId) => {
    return async (dispatch, getState) => {
        dispatch({
            type: SELECT_CATEGORY,
            categoryId: categoryId
        })
    }
};

export const selectToggleCategory = (categoryIndex) => {
    return async (dispatch, getState) => {
        dispatch({
            type: SELECT_TOGGLE_CATEGORY,
            categoryIndex: categoryIndex
        })
    }
};

export const addInterest = (interest) => {
    return async (dispatch, getState) => {
        let user = await AsyncStorage.getItem('user')
        user = JSON.parse(user)

        const formData = new FormData();
        formData.append("category", interest.category.slug);
        formData.append("caption", interest.caption);
        formData.append("link_text", interest.link_text);
        formData.append("type", interest.type);

        const response = await fetch(`${SERVER_URL}/interest/`, {
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
            type: ADD_INTEREST,
            interest: interest
        })
    }
};

export const toggleInterest = (id) => {
    return async (dispatch, getState) => {

        let user = await AsyncStorage.getItem('user')
        user = JSON.parse(user)

        const response = await fetch(`${SERVER_URL}/interesting_view/${id}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${user.token}`
            }
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }

        dispatch({
            type: TOGGLE_INTEREST,
            id: id
        })
    }
};


export const fetchInterests = () => {
    return async (dispatch, getState) => {
        let user = await AsyncStorage.getItem('user')
        user = JSON.parse(user)
        const response = await fetch(`${SERVER_URL}/interest/`, {
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
        const date = moment().subtract(20, 'hours');
        await resData.map(interest => {
            const created_at = moment(interest.created_at)
            if (moment(date).isBefore(created_at)){
                const time_remaining = created_at.diff(date, 'seconds') * 1000
                const bucket = {  
                    id: interest.id, 
                    caption: interest.caption, 
                    link_text: interest.link_text,
                    account: {
                        id: interest.account.id,
                        phone: interest.account.phone_id,
                        name: interest.friends_name
                    },
                    category:  {
                        id: interest.category.id.toString(),
                        name: interest.category.name, 
                        active: false
                    },
                    type: interest.type,
                    interesting: interest.interesting,
                    created_at: interest.created_at,
                    time_remaining: time_remaining,
                    mine: user.phone_id === interest.account.phone_id ? true : false
                }
                resP.unshift(bucket)
            }
        })

        const res = [
            {  
                id: '3iendad39036', 
                caption: 'Some mad new jam', 
                link_text: 'https://youtu.be/tA-FZeeET_M',
                account: {
                    id: '3iendad39036',
                    profileImage: '',
                    name: 'Tony Montana',
                    phone: '08109090890',
                    countryCode: '91'
                },
                category: {
                    id: 'ro3JDndad3903', 
                    name: 'Twitter', 
                    active: false,
                },
                type: 'url',
                interesting: false
            },
            {  
                id: '3iendad39035', 
                caption: 'Some mad new jam', 
                link_text: 'https://www.youtube.com/watch?v=ABxbnIPXYls',
                account: {
                    id: '1',
                    profileImage: '',
                    name: 'T.I Blaze',
                    phone: '08109090890',
                    countryCode: '91'
                },
                category:  {
                    id: '1', 
                    name: 'YouTube', 
                    active: false
                },
                type: 'url',
                interesting: true
            },
            {  
                id: '3iendad39034', 
                caption: 'Some mad new jam', 
                link_text: 'https://www.youtube.com/watch?v=ABxbnIPXYls',
                account: {
                    id: '1',
                    profileImage: '',
                    name: 'Tony Montana',
                    phone: '08109090890',
                    countryCode: '91'
                },
                category:  {
                    id: '1', 
                    name: 'YouTube', 
                    active: false
                },
                type: 'url',
                interesting: false
            },
            {  
                id: '3iendad39033', 
                caption: 'Some mad new jam', 
                link_text: 'https://www.youtube.com/watch?v=ABxbnIPXYls',
                account: {
                    id: '3iendad39036',
                    profileImage: '',
                    name: 'Tony Montana',
                    phone: '08109090890',
                    countryCode: '91'
                },
                category:  {
                    id: '1', 
                    name: 'YouTube', 
                    active: false
                },
                type: 'url',
                interesting: true
            },
            {  
                id: '3iendad39032', 
                caption: 'Some mad new jam', 
                link_text: 'https://www.instagram.com/p/CckZ0FqMLZX/?utm_source=ig_web_copy_link',
                account: {
                    id: '3iendad39036',
                    profileImage: '',
                    name: 'Tony Montana',
                    phone: '08109090890',
                    countryCode: '91'
                },
                category:  {
                    id: '300ndad3903', 
                    name: 'Instagram', 
                    active: false
                },
                type: 'url',
                interesting: false
            },
            {  
                id: '3iendad39032', 
                caption: 'Some mad new jam 6', 
                link_text: 'When we walk...',
                account: {
                    id: '3iendad39036',
                    profileImage: '',
                    phone: '08109090890',
                    countryCode: '91',
                    name: 'Tony Montana',
                },
                category:  {
                    id: '9', 
                    name: 'Others', 
                    active: false
                },
                type: 'text',
                interesting: true
            },
        ]

        dispatch({
            type: FETCH_INTERESTS,
            interests: resP
        })
    }
};

export const deleteInterest = (id) => {
    return async (dispatch, getState) => {

        let user = await AsyncStorage.getItem('user')
        user = JSON.parse(user)

        const response = await fetch(`${SERVER_URL}/delete_interest/${id}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${user.token}`
            }
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }

        dispatch({
            type: DELETE_INTEREST,
            id: id
        })
    }
};

export const feedback = (message) => {
    return async (dispatch, getState) => {

        let user = await AsyncStorage.getItem('user')
        user = JSON.parse(user)

        const formData = new FormData();
        formData.append("message", message);

        const response = await fetch(`${SERVER_URL}/feedback/`, {
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

        return resData
    }
};
