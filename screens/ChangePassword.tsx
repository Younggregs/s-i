import React, { useState, useCallback } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Linking, KeyboardAvoidingView } from 'react-native';
import { useDispatch } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';

import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import * as auth from '../store/actions/auth';

export default function ChangePasswordScreen({ navigation }: RootStackScreenProps<'NotFound'>) {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const dispatch = useDispatch()

    const submit = useCallback(async (oldPassword, newPassword) => {
        const passwordValidate = newPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*"'()+,-./:;<=>?[\]^_`{|}~])(?=.{8,})/)
        setIsLoading(true);
        setSuccess(false);
        setFailed(false);
        setError('')
        if(passwordValidate){
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
        }else{
            setError('New password not valid, please confirm it contains all necessary characters specified above.')
        }
        setIsLoading(false);
    }, [dispatch, setIsLoading, setError])
    
    return (
    <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
    >
        <Text style={styles.title}>Enter your current password and new password to update</Text>

        <View style={styles.labelView}>
            <Text style={styles.label}>Current password</Text>
        </View>
        <View style={styles.inputContainer}>
            <TextInput 
                secureTextEntry={!showPassword}
                style={{color: '#fff', flex: 8}}
                returnKeyType='done'
                onChangeText={(value) => setPassword(value)}
            />
            <View style={styles.iconView}>
                <FontAwesome
                    onPress={() => setShowPassword(!showPassword)}
                    name= {showPassword ? "eye": "eye-slash"}
                    size={20}
                    color={'#fff'}
                />
            </View>
        </View>

        <View style={styles.labelView}>
            <Text style={styles.label}>New password</Text>
        </View>
        <View style={styles.inputContainer}>
            <TextInput 
                secureTextEntry={!showNewPassword}
                style={{color: '#fff', flex: 8}}
                returnKeyType='done'
                onChangeText={(value) => setNewPassword(value)}
            />
            <View style={styles.iconView}>
                <FontAwesome
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    name= {showNewPassword ? "eye": "eye-slash"}
                    size={20}
                    color={'#fff'}
                />
            </View>
        </View>
        <View>
            <Text>
                Password must contain atleast 1 lowercase and 1 uppercase alphabetical characters respectively, 1 numeric character, 
                1 special character and should be atleast 8 characters long.
            </Text>
        </View>

        {error.length < 1 ? <View /> : <View style={styles.feedback}><Text style={styles.feebackFailedText}>{error}</Text></View>}

        {!success ? <View /> : <View style={styles.feedback}><Text style={styles.feebackSuccessText}>Password updated successfully.</Text></View>}
        {!failed  ? <View /> : <View style={styles.feedback}><Text style={styles.feebackFailedText}>Sorry current password does not match.</Text></View>}

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
        <TouchableOpacity onPress={() => Linking.openURL('https://shareinterest.app')} style={styles.link}>
            <Text style={styles.linkText}>shareinterest.app</Text>
        </TouchableOpacity>
    </KeyboardAvoidingView>
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
    feedback: {
        backgroundColor: '#fff',
        padding: 5,
        borderRadius: 5,
        margin: 5
    },
    feebackSuccessText: {
        color: '#0000ff'
    },
    feebackFailedText: {
        color: '#ff0000'
    },
    inputContainer: {
        width: '100%',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 0.5,
        borderStyle: 'solid',
        borderColor: '#fff',
        marginVertical: 10,
        height: 50,
        flexDirection: 'row'
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
    },
    iconView: {
        flex: 2,
        alignItems: "center",
        justifyContent: 'center'
    }
});
