
export const SET_FRIENDS = "SET_FRIENDS";
export const ADD_FRIENDS = "ADD_FRIENDS";
export const SET_CONTACTS = "SET_CONTACTS";

export const fetchFriends = () => {
    return async (dispatch, getState) => {
        const resData = [
            {id: '3iendad3903', name: 'Jesse', active: false},
            {id: '33JDndad3903', name: 'Diva', active: true},
            {id: 'ro3JDndad3903', name: 'Bruv', active: false},
            {id: '300ndad3903', name: 'Felicity', active: false},
            {id: '23JDndad3903', name: 'Street', active: false},
            {id: '300nda23903', name: 'Oluwadunsin Femidamilola', active: false},
            {id: '23JDn342d3903', name: 'Mohammed Abdulsalam', active: false},
            {id: '23JDn3ntf42d3903', name: 'Uche Okonkwo', active: false},
            {id: '23JDnd333903', name: 'Zindirwe Danwanzam', active: false}
        ]

        dispatch({
            type: SET_FRIENDS,
            friends: resData
        })
    }
};

export const addFriends = (friend) => {
    return async (dispatch, getState) => {
        dispatch({
            type: ADD_FRIENDS,
            friend: friend
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