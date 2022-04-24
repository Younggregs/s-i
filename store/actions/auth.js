import { AsyncStorage } from 'react-native';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
export const SET_DID_TRY_AUTO_LOGIN  = 'SET_DID_TRY_AUTO_LOGIN';

export const setDidTryAutoLogin = () => {
    return{
        type: SET_DID_TRY_AUTO_LOGIN
    };
};

export const authenticate = (user, token) => {
    return dispatch => {
        dispatch({
            type: AUTHENTICATE,
            user,
            token
        });
    }
};

export const signup = (name, email, password, expoPushToken) => {
    return async dispatch => {
        
    };
};

export const signin = (email, password, expoPushToken) => {
    return async dispatch => {

        const resData = {
            'user': {
                id: '3iendad39036',
                profileImage: '',
                name: 'Tony Montana'
            },
            'token': '3iendad390363iendad390363iendad39036'
        }

        dispatch(authenticate(resData.user, resData.token));

        saveDataToStorage(resData.token, resData.user);
    };
};

export const forgotPassword = (email) => {
    return async dispatch => {
        
    }
}

export const logout = () => {
    AsyncStorage.removeItem('userData');
    return {
        type: LOGOUT
    };
}

const saveDataToStorage = (token, user) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        token,
        user
    }));
}