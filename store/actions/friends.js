
export const SET_FRIENDS = "SET_FRIENDS";
export const TAG_FRIEND = "TAG_FRIEND";
export const UNTAG_FRIEND = "UNTAG_FRIEND"
export const SET_CONTACTS = "SET_CONTACTS";
export const TOGGLE_NOTIFICATION = "TOGGLE_NOTIFICATION";


export const fetchFriends = () => {
    return async (dispatch, getState) => {
        const resData = [
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
            friends: resData
        })
    }
};

export const tagFriend = (friend) => {
    return async (dispatch, getState) => {
        dispatch({
            type: TAG_FRIEND,
            friend: friend
        })
    }
};


export const untagFriend = (id) => {
    return async (dispatch, getState) => {
        dispatch({
            type: UNTAG_FRIEND,
            id: id
        })
    }
};

export const toggleNotification = (id) => {
    return async (dispatch, getState) => {
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