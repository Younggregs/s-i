import {SERVER_URL} from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
export const SET_DID_TRY_AUTO_LOGIN  = 'SET_DID_TRY_AUTO_LOGIN';

export const setDidTryAutoLogin = () => {
    return{
        type: SET_DID_TRY_AUTO_LOGIN
    };
};

export const authenticate = (token, phone_id) => {
    return dispatch => {
        dispatch({
            type: AUTHENTICATE,
            token,
            phone_id
        });
    }
};

export const verify_invite_token = (token) => {
    return async dispatch => {
        const response = await fetch(`${SERVER_URL}/verify_invite/${token}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }
        return resData;
    };
};

export const verify_invite_phone = (phone, phone_id, callingCode) => {
    return async dispatch => {
        const formData = new FormData();
        formData.append("phone_id", phone_id);
        formData.append("phone", phone);
        formData.append("callingCode", callingCode);

        const response = await fetch(`${SERVER_URL}/verify_invite/token/`, {
            method: 'POST',
            body: formData
        });

        const message = await response.json();

        if(message.error){
            throw new Error(message.error);
        }

        return message;
    };
};

export const verify_phone = (phone, phone_id, callingCode, countryCode) => {
    return async dispatch => {
        const formData = new FormData();
        formData.append("phone", phone);
        formData.append("phone_id", phone_id);
        formData.append("callingCode", callingCode);
        formData.append("countryCode", countryCode);

        const response = await fetch(`${SERVER_URL}/verify_phone/`, {
            method: 'POST',
            body: formData
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }

        return resData;
    };
};

export const verify_phone_token = (phone_id, token) => {
    return async dispatch => {
        const formData = new FormData();
        formData.append("token", token);
        formData.append("phone_id", phone_id);

        const response = await fetch(`${SERVER_URL}/verify_phone_token/`, {
            method: 'POST',
            body: formData
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }

        return resData;
    };
};

export const verify_password = (phone_id, phone, callingCode, password, notification_token) => {
    return async dispatch => {
        const formData = new FormData();
        formData.append("phone_id", phone_id);
        formData.append("phone", phone);
        formData.append("callingCode", callingCode);
        formData.append("password", password);
        formData.append("notification_token", notification_token);

        const response = await fetch(`${SERVER_URL}/verify_password/`, {
            method: 'POST',
            body: formData
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }

        return resData;
    };
};

export const verify_email = (phone_id, phone, callingCode, email_id) => {
    return async dispatch => {
        const formData = new FormData();
        formData.append("phone_id", phone_id);
        formData.append("phone", phone);
        formData.append("callingCode", callingCode);
        formData.append("email_id", email_id);
        
        const response = await fetch(`${SERVER_URL}/verify_email/`, {
            method: 'POST',
            body: formData
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }

        return resData;
    };
};

export const change_email = (email_id) => {
    return async dispatch => {
        let user = await AsyncStorage.getItem('user')
        user = JSON.parse(user)

        const formData = new FormData();
        formData.append("phone_id", user.phone_id);
        formData.append("email_id", email_id);
        
        const response = await fetch(`${SERVER_URL}/verify_email/`, {
            method: 'POST',
            body: formData
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }

        return resData;
    };
};

export const verify_email_token = (token) => {
    return async dispatch => {
        const formData = new FormData();
        formData.append("token", token);
        
        const response = await fetch(`${SERVER_URL}/verify_email_token/`, {
            method: 'POST',
            body: formData
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }

        return resData;
    };
};

export const verify_email_forgot_password = (phone_id, phone, callingCode) => {
    return async dispatch => {
        const formData = new FormData();
        formData.append("phone_id", phone_id);
        formData.append("phone", phone);
        formData.append("callingCode", callingCode);

        const response = await fetch(`${SERVER_URL}/verify_email_forgot_password/`, {
            method: 'POST',
            body: formData
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }

        return resData;
    };
};

export const forgot_password = (phone_id, password) => {
    return async dispatch => {
        const formData = new FormData();
        formData.append("phone_id", phone_id);
        formData.append("password", password);
        //formData.append("notification_token", 'notification_token');

        const response = await fetch(`${SERVER_URL}/forgot_password/`, {
            method: 'POST',
            body: formData
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }

        return resData;
    };
};

export const signup = (name, email, password, expoPushToken) => {
    return async dispatch => {
        
    };
};

export const signin = () => {
    return async dispatch => {
        let user = await AsyncStorage.getItem('user')
        user = JSON.parse(user)
        dispatch(authenticate(user.phone_id, user.token));
    };
};

export const change_password = (old_password, new_password) => {
    return async dispatch => {
        let user = await AsyncStorage.getItem('user')
        user = JSON.parse(user)

        const formData = new FormData();
        formData.append("old_password", old_password);
        formData.append("new_password", new_password);


        const response = await fetch(`${SERVER_URL}/change_password/`, {
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

        return resData;
    }
}

export const logout = () => {
    return async dispatch => {
        AsyncStorage.removeItem('user');
        // const response = await fetch(`${SERVER_URL}/logout/`, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Token ${token}`
        //     }
        // });
        // const resData = await response.json();

        // if(resData.error){
        //     throw new Error(resData.error);
        // }

        dispatch({
            type: LOGOUT
        });
    };
}


export const auth = (username, password) => {
    return async dispatch => {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        const response = await fetch(`${SERVER_URL}/auth/`, {
            method: 'POST',
            body: formData
        });
        const resData = await response.json();

        if(resData.error){
            throw new Error(resData.error);
        }
        if(resData.token){
            await saveDataToStorage(resData.token, username)
        }
        return resData;
    };
};

const saveDataToStorage = async (token, phone_id) => {
    try{
        const user = JSON.stringify({
            token,
            phone_id
        })
        await AsyncStorage.setItem('user', user);
    } catch (e) {
        // console.log(e)
    }
    return 1
}