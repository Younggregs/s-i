import {SERVER_URL} from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage';
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
            {id: '3iendad3903', name: 'YouTube', slug:'youtube', active: false},
            {id: '33JDndad3903', name: 'Spotify', slug:'spotify', active: true},
            {id: 'ro3JDndad3903', name: 'Twitter', slug:'twitter', active: false},
            {id: '300ndad3903', name: 'Instagram', slug:'instagram', active: false},
            {id: '23JDndad3903', name: 'Tiktok', slug:'tiktok', active: false},
            {id: '300nda23903', name: 'Snapchat', slug:'snapchat', active: false},
            {id: '23JDn342d3903', name: 'Facebook', slug:'facebook', active: false},
            {id: '23JDn3ntf42d3903', name: 'Netflix', slug:'netflix', active: false},
            {id: '23JDnd333903', name: 'Others', slug:'others', active: false}
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
        formData.append("link_text", interest.link);
        formData.append("type", interest.type);

        const response = await fetch(`${SERVER_URL}/interest/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token c9e4ea24e19a33e72c1b34dafe3e87cee62c3c2f`
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

        const token = getState().auth.token;
        const response = await fetch(`${SERVER_URL}/interesting_view/${id}`, {
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

        console.log('resData', resData)

        const res = [
            {  
                id: '3iendad39036', 
                caption: 'Some mad new jam', 
                link: 'https://youtu.be/tA-FZeeET_M',
                user: {
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
                link: 'https://www.youtube.com/watch?v=ABxbnIPXYls',
                user: {
                    id: '3iendad39035',
                    profileImage: '',
                    name: 'T.I Blaze',
                    phone: '08109090890',
                    countryCode: '91'
                },
                category:  {
                    id: '3iendad3903', 
                    name: 'YouTube', 
                    active: false
                },
                type: 'url',
                interesting: true
            },
            {  
                id: '3iendad39034', 
                caption: 'Some mad new jam', 
                link: 'https://www.youtube.com/watch?v=ABxbnIPXYls',
                user: {
                    id: '3iendad39036',
                    profileImage: '',
                    name: 'Tony Montana',
                    phone: '08109090890',
                    countryCode: '91'
                },
                category:  {
                    id: '3iendad3903', 
                    name: 'YouTube', 
                    active: false
                },
                type: 'url',
                interesting: false
            },
            {  
                id: '3iendad39033', 
                caption: 'Some mad new jam', 
                link: 'https://www.youtube.com/watch?v=ABxbnIPXYls',
                user: {
                    id: '3iendad39036',
                    profileImage: '',
                    name: 'Tony Montana',
                    phone: '08109090890',
                    countryCode: '91'
                },
                category:  {
                    id: '3iendad3903', 
                    name: 'YouTube', 
                    active: false
                },
                type: 'url',
                interesting: true
            },
            {  
                id: '3iendad39032', 
                caption: 'Some mad new jam', 
                link: 'https://www.instagram.com/p/CckZ0FqMLZX/?utm_source=ig_web_copy_link',
                user: {
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
                caption: 'Some mad new jam', 
                link: 'When we walk...',
                user: {
                    id: '3iendad39036',
                    profileImage: '',
                    name: 'Tony Montana',
                    phone: '08109090890',
                    countryCode: '91'
                },
                category:  {
                    id: '23JDnd333903', 
                    name: 'Others', 
                    active: false
                },
                type: 'text',
                interesting: true
            },
        ]

        dispatch({
            type: FETCH_INTERESTS,
            interests: res
        })
    }
};

export const deleteInterest = (id) => {
    console.log('control', id)
    return async (dispatch, getState) => {
        dispatch({
            type: DELETE_INTEREST,
            id: id
        })
    }
};

export const feedback = (message) => {
    return async (dispatch, getState) => {

        const token = getState().auth.token;
        const response = await fetch(`${SERVER_URL}/feedback/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                message
            })
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }
    }
};
