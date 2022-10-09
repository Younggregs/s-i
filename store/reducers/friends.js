import { SET_FRIENDS, TAG_FRIEND, UNTAG_FRIEND, SET_CONTACTS, TOGGLE_NOTIFICATION } from "../actions/friends";

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
        
        case TAG_FRIEND:
            const friendExist = tempFriends.find(item => item.phone === action.friend.friend.phone_id)
            return {
                ...state,
                allFriends: !friendExist ? [action.friend, ...state.allFriends] : tempFriends
            }

        case UNTAG_FRIEND:
            const updatedFriendList = tempFriends.filter(friend => friend.id !== action.id)
            return{
                ...state,
                allFriends: updatedFriendList
            }

        case SET_CONTACTS:
            return {
                ...state,
                allContacts: action.contacts
            }
        
        case TOGGLE_NOTIFICATION:
            const friend = tempFriends.findIndex(item => item.id === action.id)
            tempFriends[friend].notification = !tempFriends[friend].notification
            return {
                ...state,
                allFriends: tempFriends
            }
            
        default:
            return state;
    }
}