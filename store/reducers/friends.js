import { SET_FRIENDS, ADD_FRIENDS, SET_CONTACTS } from "../actions/friends";

const initialState = {
    allFriends: [],
    allContacts: []
};

export default (state=initialState, action) => {
    const tempFriends = [...state.allFriends];
    const tempContact = [...state.allContacts]
    switch(action.type){
        case SET_FRIENDS:
            return {
                ...state,
                allFriends: action.friends
            }
        
        case ADD_FRIENDS:
            return {
                ...state,
                allFriends: [action.friend, ...state.allFriends]
            }

         case SET_CONTACTS:
            return {
                ...state,
                allContacts: action.contacts
            }
            
        default:
            return state;
    }
}