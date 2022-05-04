// import ENV from '../../env';

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
            {id: '3iendad3903', name: 'YouTube', active: false},
            {id: '33JDndad3903', name: 'Spotify', active: true},
            {id: 'ro3JDndad3903', name: 'Twitter', active: false},
            {id: '300ndad3903', name: 'Instagram', active: false},
            {id: '23JDndad3903', name: 'Tiktok', active: false},
            {id: '300nda23903', name: 'Snapchat', active: false},
            {id: '23JDn342d3903', name: 'Facebook', active: false},
            {id: '23JDn3ntf42d3903', name: 'Netflix', active: false},
            {id: '23JDnd333903', name: 'Others', active: false}
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
        dispatch({
            type: ADD_INTEREST,
            interest: interest
        })
    }
};

export const toggleInterest = (id) => {
    return async (dispatch, getState) => {
        dispatch({
            type: TOGGLE_INTEREST,
            id: id
        })
    }
};


export const fetchInterests = () => {
    return async (dispatch, getState) => {
        const resData = [
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
            interests: resData
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
