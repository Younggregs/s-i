import React, { useState, useCallback } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import * as auth from '../store/actions/auth';

import PhoneInput from "react-native-phone-number-input";
import PasswordInputText from 'react-native-hide-show-password-input';

export default function ChangePasswordScreen({ navigation }: RootStackScreenProps<'NotFound'>) {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)

    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState('');

    const dispatch = useDispatch()

    const submit = useCallback(async (oldPassword, newPassword) => {
        setIsLoading(true);
        setSuccess(false);
        setFailed(false)
        try {
            const message = await dispatch(auth.change_password(oldPassword, newPassword));
            if(message.code){
                setSuccess(true)
            }else{
                setFailed(true)
            }
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, setIsLoading, setError])
    
    return (
    <View style={styles.container}>
        <Text style={styles.title}>Enter your current password and new password to update</Text>
        {/* <View style={styles.labelView}>
            <Text style={styles.label}>Enter password</Text>
        </View> */}

        <View style={styles.inputContainer}>
            <PasswordInputText
                value={password}
                autoFocus={true}
                placeholder="Current password"
                placeholderTextColor={'#fff'}
                onChangeText={(password: React.SetStateAction<string>) => setPassword(password)}
                iconColor="#fff"
                textColor="#fff"
            />
        </View>

        <View style={styles.inputContainer}>
            <PasswordInputText
                value={newPassword}
                placeholder="New password"
                placeholderTextColor={'#fff'}
                onChangeText={(password: React.SetStateAction<string>) => setNewPassword(password)}
                iconColor="#fff"
                textColor="#fff"
            />
        </View>

        {!success ? <View /> : <Text>Password updated successfully</Text>}
        {!failed  ? <View /> : <Text> Sorry something went wrong, please retry</Text>}

        {isLoading ? (
          <TouchableOpacity
          style={styles.button}
        >
          <ActivityIndicator color="#fff" />
        </TouchableOpacity>
        ) : (
        <TouchableOpacity
            style={styles.button}
            onPress={() => submit(password, newPassword)}
        >
            <Text style={styles.buttonText}>Update password</Text>
        </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => navigation.replace('Root')} style={styles.link}>
            <Text style={styles.linkText}>shareinterest.app</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        marginVertical: 20
    },
    input: {
        color: '#fff'
    },
    inputContainer: {
        width: '100%',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 0.5,
        borderStyle: 'solid',
        borderColor: '#fff',
        marginVertical: 10
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    linkText: {
        fontSize: 14,
        color: '#2e78b7',
    },
    button: {
        height: 30,
        width: '100%',
        padding: 5,
        borderRadius: 5,
        marginVertical: 40,
        backgroundColor: "#2196F3",
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 15,
        fontWeight: "bold"
    },
    message: {
        marginVertical: 10
    },
    wrapper: {
        width: '100%',
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        color: '#ff0000',
        fontSize: 15
    },
    label: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#fff',
        textAlign: 'left',
        marginHorizontal: 10,
    },
    hint: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#fff',
        textAlign: 'left',
        marginHorizontal: 10,
    },
    labelView: {
        marginVertical: 10,
        width: '100%'
    }
});
