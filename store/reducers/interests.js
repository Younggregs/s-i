import { SET_CATEGORIES, SELECT_CATEGORY, SELECT_TOGGLE_CATEGORY, ADD_INTEREST, FETCH_INTERESTS, TOGGLE_INTEREST, DELETE_INTEREST, UPDATE_INTERESTING_LIST, UPDATE_INTERESTVIEW_LIST } from "../actions/interests";

const initialState = {
    allCategories: [],
    allInterests: [],
    allInterestings: [],
    allViews: []
};

export default (state=initialState, action) => {
    const tempCategory = [...state.allCategories];
    const tempInterest = [...state.allInterests];
    switch(action.type){
        case SET_CATEGORIES:
            return {
                ...state,
                allCategories: action.categories
            }
        case SELECT_CATEGORY:
            tempCategory.forEach(category => {
                if(category.id === action.categoryId){
                    category.active = true
                }else{
                    category.active = false
                }
            });
            return {
                ...state,
                allCategories: tempCategory
            }
        case SELECT_TOGGLE_CATEGORY:
            const activeCategory = tempCategory[action.categoryIndex]
            tempCategory.forEach(category => {
                if(category.id === activeCategory.id){
                    category.active = true
                }else{
                    category.active = false
                }
            });
            return {
                ...state,
                allCategories: tempCategory
            }
        
        case ADD_INTEREST:
            tempCategory.forEach(category => {
                if(category.id === action.interest.category.id){
                    category.active = true
                }else{
                    category.active = false
                }
            });
            return {
                ...state,
                allInterests: [action.interest, ...state.allInterests]
            }

        case FETCH_INTERESTS:
            return {
                ...state,
                allInterests: action.interests
            }

        case TOGGLE_INTEREST:
            const interest = tempInterest.findIndex(item => item.id === action.id)
            tempInterest[interest].interesting = !tempInterest[interest].interesting
            return {
                ...state,
                allInterests: tempInterest
            }
        
        case UPDATE_INTERESTING_LIST:
            return {
                ...state,
                allInterestings: action.interesting
            }

        case UPDATE_INTERESTVIEW_LIST:
            return {
                ...state,
                allViews: action.views
            }
        
        case DELETE_INTEREST:
            const updatedInterestList = tempInterest.filter(interest => interest.id !== action.id)
            return{
                ...state,
                allInterests: updatedInterestList
            }
            
        default:
            return state;
    }
}