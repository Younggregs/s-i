import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, Image, TouchableOpacity, TextInput, Platform, ActivityIndicator, Linking } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import { Text, View } from '../components/Themed';
import logo from '../assets/images/logo.png'
import { RootStackScreenProps } from '../types';
import * as auth from '../store/actions/auth';

export default function PasswordScreen({ route, navigation }: RootStackScreenProps<'NotFound'>) {
    const { phone_id, phone, callingCode, isReturning } = route.params;
    const [password, setPassword] = useState('');
    const [token, setToken] = useState();
    const [showPassword, setShowPassword] = useState(false)

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('false');

    const dispatch = useDispatch();

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setToken(token));
        // let token = registerForPushNotificationsAsync();
      },[])

    const submit = useCallback(async (password, token) => {
        const passwordValidate = password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*"'()+,-./:;<=>?[\]^_`{|}~])(?=.{8,})/)
        setShowMessage(false)
        setError('');
        setIsLoading(true);
        if((!isReturning && passwordValidate) || isReturning){
            try {
                const message = await dispatch(auth.verify_password(phone_id, phone, callingCode, password, token));
                if(message.code){
                    const phone_res = message.code
                    await dispatch(auth.auth(phone_res, password));
                    if(isReturning){
                        navigation.navigate('LoginContacts')
                    }else{
                        navigation.replace('RecoveryEmail', {phone_id: phone_res, phone: phone, callingCode: callingCode})
                    }
                }else if(message.error_message){
                    setShowMessage(true)
                    setErrorMessage(message.error_message)
                }else{
                    setShowMessage(true)
                    setErrorMessage('Sorry something went wrong')
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
    <View style={styles.container}>
        <Image source={logo} style={{ width: 50, height: 50 }} />
        <Text style={styles.title}>Share Interest</Text>

        <View style={styles.labelView}>
            <Text style={styles.label}>{isReturning ? 'Enter' : 'Create'} password</Text>
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
        {isReturning ? <View /> : 
            <View>
                <Text>
                    Password must contain atleast 1 lowercase and 1 uppercase alphabetical characters respectively, 1 numeric character, 
                    1 special character and should be atleast 8 characters long.
                </Text>
            </View>
        }

        {error.length < 1 ? <View /> : <View style={styles.feedback}><Text style={styles.feebackFailedText}>{error}</Text></View>}

        {showMessage && (
            <View style={styles.message}>
                <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
        )}

        <TouchableOpacity onPress={() => navigation.replace('ForgotPassword', {phone_id: phone_id, phone: phone, callingCode: callingCode})} style={styles.link}>
            <Text style={styles.linkText}>Forgot password</Text>
        </TouchableOpacity>

        {isLoading ? (
            <TouchableOpacity
            style={styles.button}
        >
            <ActivityIndicator color="#fff" />
        </TouchableOpacity>
        ) : (
        <TouchableOpacity
            style={styles.button}
            onPress={() => submit(password, token)}
        >
            <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        )}
        
        <TouchableOpacity onPress={() => Linking.openURL('https://shareinterest.app')} style={styles.link}>
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
        fontSize: 25,
        marginVertical: 20
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
        height: 50,
        flexDirection: 'row'
    },
    iconView: {
        flex: 2,
        alignItems: "center",
        justifyContent: 'center'
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



async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      //console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }