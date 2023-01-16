import {SERVER_URL} from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLinkPreview, getPreviewFromContent } from "link-preview-js";
import moment from 'moment'
export const SET_CATEGORIES = "SET_CATEGORIES";
export const SELECT_CATEGORY = "SELECT_CATEGORY";
export const SELECT_TOGGLE_CATEGORY = "SELECT_TOGGLE_CATEGORY";
export const ADD_INTEREST = "ADD_INTEREST"
export const FETCH_INTERESTS = "FETCH_INTERESTS"
export const TOGGLE_INTEREST = "TOGGLE_INTEREST"
export const UPDATE_INTERESTING_LIST = "UPDATE_INTERESTING_LIST"
export const UPDATE_INTERESTVIEW_LIST = "UPDATE_INTERESTVIEW_LIST"
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
            {id: '7', name: 'Pinterest', slug:'pinterest', active: false},
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

        // dispatch({
        //     type: ADD_INTEREST,
        //     interest: interest
        // })
        
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
        if(!resData.error_message){
            interest.id = resData.id
            dispatch({
                type: ADD_INTEREST,
                interest: interest
            })
        }

        return resData
    }
};

export const add_interest_query = async (interest) => {

        let user = await AsyncStorage.getItem('user')
        user = JSON.parse(user)

        const formData = new FormData();
        formData.append("category", interest.category.slug);
        formData.append("caption", interest.caption);
        formData.append("link_text", interest.link_text);
        formData.append("type", interest.type);
        formData.append("share_list", interest.share_list);
       
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
        
        if(!resData.error_message){
            interest.id = resData.id
            return interest
        }

        return []
};

export const toggleInterest = (id) => {
    return async (dispatch, getState) => {

        dispatch({
            type: TOGGLE_INTEREST,
            id: id
        })

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
    }
};

export const toggle_interest_query = async (id) => {
        let user = await AsyncStorage.getItem('user')
        user = JSON.parse(user)

        const response = await fetch(`${SERVER_URL}/interesting_view/${id}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${user.token}`
            }
        });
        const resData = await response.json();

        return resData
};

export const interestingList = (id) => {
    return async (dispatch, getState) => {

        let user = await AsyncStorage.getItem('user')
        user = JSON.parse(user)
        const response = await fetch(`${SERVER_URL}/interesting_list/${id}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${user.token}`
            }
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }

        if(!resData.error_message && resData.length > 0){
            resData.map(item => {
                dispatch({
                    type: UPDATE_INTERESTING_LIST,
                    interesting: item
                })
            })
        }
    }
};

export const interesting_list_query = async (id) => {
    let user = await AsyncStorage.getItem('user')
    user = JSON.parse(user)
    const response = await fetch(`${SERVER_URL}/interesting_list/${id}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${user.token}`
        }
    });

    return await response.json()
};

export const interestViewRecord = (id) => {
    return async (dispatch, getState) => {

        let user = await AsyncStorage.getItem('user')
        user = JSON.parse(user)
        const response = await fetch(`${SERVER_URL}/interestview/${id}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${user.token}`
            }
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }

        return resData
    }
};

export const interestViewList = (id) => {
    return async (dispatch, getState) => {

        let user = await AsyncStorage.getItem('user')
        user = JSON.parse(user)
        const response = await fetch(`${SERVER_URL}/interestview_list/${id}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${user.token}`
            }
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }

        if(!resData.error_message && resData.length > 0){
            resData.map(item => (
                dispatch({
                    type: UPDATE_INTERESTVIEW_LIST,
                    views: item
                })
            ))
        }
    }
};


export const view_list_query = async (id) => {
    let user = await AsyncStorage.getItem('user')
    user = JSON.parse(user)
    const response = await fetch(`${SERVER_URL}/interestview_list/${id}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${user.token}`
        }
    });

    return await response.json()
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
                        slug: interest.category.slug, 
                        active: false
                    },
                    type: interest.type,
                    interesting: interest.interesting,
                    created_at: interest.created_at,
                    saved: interest.saved,
                    time_remaining: time_remaining,
                    mine: user.phone_id === interest.account.phone_id ? true : false
                }
                resP.unshift(bucket)
            }
        })

        dispatch({
            type: FETCH_INTERESTS,
            interests: resP
        })
    }
};

export const fetch_interests_query = async () => {
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
                        slug: interest.category.slug, 
                        active: false
                    },
                    type: interest.type,
                    interesting: interest.interesting,
                    created_at: interest.created_at,
                    time_remaining: time_remaining,
                    saved: interest.saved,
                    mine: user.phone_id === interest.account.phone_id ? true : false
                }
                resP.unshift(bucket)
            }
        })

    return resP
};

export const fetch_saved_interests_query = async () => {
    let user = await AsyncStorage.getItem('user')
    user = JSON.parse(user)
    const response = await fetch(`${SERVER_URL}/fetch_saved_interest/`, {
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
                    slug: interest.category.slug, 
                    active: false
                },
                type: interest.type,
                interesting: interest.interesting,
                created_at: interest.created_at,
                time_remaining: time_remaining,
                saved: interest.saved,
                saved_screen: true,
                mine: user.phone_id === interest.account.phone_id ? true : false
            }
            resP.unshift(bucket)
    })

return resP
};

export const fetch_preview_query = async(link) => {
    const res = await getLinkPreview(link).then((data) =>
      {
        return data
      }
    );

    return res
}

export const fetchTweet = (id) => {
    return async (dispatch, getState) => {

        let user = await AsyncStorage.getItem('user')
        user = JSON.parse(user)

        const response = await fetch(`${SERVER_URL}/tweet/${id}/`, {
            method: 'GET',
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }
        return resData.tweet
    }
};

export const fetch_tweet_query = async (id) => {

        let user = await AsyncStorage.getItem('user')
        user = JSON.parse(user)

        const response = await fetch(`${SERVER_URL}/tweet/${id}/`, {
            method: 'GET',
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }
        return resData.tweet
};

export const fetchTweetPreview = (link) => {
    return async (dispatch, getState) => {
        const formData = new FormData();
        formData.append("link", link);

        const response = await fetch(`${SERVER_URL}/tweet/id/`, {
            method: 'POST',
            body: formData
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }
        return resData[0].text
    }
};

export const fetch_tweet_preview_query = async (link) => {
        const formData = new FormData();
        formData.append("link", link);

        const response = await fetch(`${SERVER_URL}/tweet/id/`, {
            method: 'POST',
            body: formData
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }
        return resData[0].text
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

export const delete_saved_interest_query = async (id) => {

        let user = await AsyncStorage.getItem('user')
        user = JSON.parse(user)

        const response = await fetch(`${SERVER_URL}/delete_saved_interest/${id}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${user.token}`
            }
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }

        return resData
};

export const delete_interest_query = async (id) => {

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

        return resData
};

export const save_interest_query = async (id) => {

    let user = await AsyncStorage.getItem('user')
    user = JSON.parse(user)

    const response = await fetch(`${SERVER_URL}/save_interest/${id}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${user.token}`
        }
    });
    const resData = await response.json();

    if(resData.error){
        throw new Error(resData.error);
    }

    return resData
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
