import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, Image, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import { Text, View } from '../components/Themed';
import logo from '../assets/images/logo.png'
import { RootStackScreenProps } from '../types';
import * as auth from '../store/actions/auth';

import PhoneInput from "react-native-phone-number-input";
import PasswordInputText from 'react-native-hide-show-password-input';

export default function PasswordScreen({ route, navigation }: RootStackScreenProps<'NotFound'>) {
    const { phone_id, isReturning } = route.params;
    const [text, setText] = useState('');
    const [text2, setText2] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState();

    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState('');

    const [value, setValue] = useState("");
    const [formattedValue, setFormattedValue] = useState("");
    const [valid, setValid] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('false');
    const phoneInput = useRef<PhoneInput>(null);
    let verifycode = useRef(null);

    const dispatch = useDispatch();

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setToken(token));
        // let token = registerForPushNotificationsAsync();
      },[])

    const submit = useCallback(async (password, token) => {
        setShowMessage(false)
        setError('');
        setIsLoading(true);
        try {
            const message = await dispatch(auth.verify_password(phone_id, password, token));
            if(message.code){
                await dispatch(auth.auth(phone_id, password));
                if(isReturning){
                    navigation.navigate('LoginContacts')
                }else{
                    navigation.replace('RecoveryEmail', {phone_id: phone_id})
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
        setIsLoading(false);
    }, [dispatch, setIsLoading, setError])
    
    return (
    <View style={styles.container}>
        <Image source={logo} style={{ width: 50, height: 50 }} />
        <Text style={styles.title}>Share Interest</Text>
        {/* <View style={styles.labelView}>
            <Text style={styles.label}>Enter password</Text>
        </View> */}

        <View style={styles.inputContainer}>
            <PasswordInputText
                value={password}
                autoFocus={true}
                placeholder="Enter password"
                placeholderTextColor={'#fff'}
                onChangeText={(password: React.SetStateAction<string>) => setPassword(password)}
                iconColor="#fff"
                textColor="#fff"
            />
        </View>

        {showMessage && (
            <View style={styles.message}>
                <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
        )}

        <TouchableOpacity onPress={() => navigation.replace('ForgotPassword', {phone_id: phone_id})} style={styles.link}>
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
        fontSize: 25,
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