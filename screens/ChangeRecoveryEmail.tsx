import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import * as auth from '../store/actions/auth';
import logo from '../assets/images/logo.png'

import PhoneInput from "react-native-phone-number-input";
import SMSVerifyCode from 'react-native-sms-verifycode';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
  } from 'react-native-confirmation-code-field';

const CELL_COUNT = 5;

export default function ChangeRecoveryEmail({ route, navigation }: RootStackScreenProps<'NotFound'>) {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [_url, setUrl] = useState('');

    const [value, setValue] = useState("");
    const [formattedValue, setFormattedValue] = useState("");
    const [valid, setValid] = useState(false);
    const [invalidCode, setInvalid] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [success, setSuccess] = useState(false);
    const phoneInput = useRef<PhoneInput>(null);
    let verifycode = useRef(null);

    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState('');

    const validateEmail = (email: String) => {
        return email.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    const verifyEmail = useCallback(async (email) => {
        setError('');
        setShowMessage(false)
        setIsLoading(true);
        if(validateEmail(email.replace(/\s/g, ''))){
            try {
                const message = await dispatch(auth.change_email(email));
                if(message.code){
                    setValid(true)
                }else{
                    setShowMessage(true)
                    setError(message.error_message)
                }
            } catch (err) {
                setError(err.message);
            }
        }else{
            setError('Email is not valid');
            setShowMessage(true)
        }
       
        setIsLoading(false);
    }, [dispatch, setIsLoading, setError])

    const verifyEmailToken = useCallback(async (token) => {
        setError('');
        setShowMessage(false)
        setSuccess(false)
        setIsLoading(true);
        try {
            const message = await dispatch(auth.verify_email_token(token));
            if(message.code){
                setSuccess(true)
            }else{
                setShowMessage(true)
                setError(message.error_message)
            }
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, setIsLoading, setError])

    

    const onInputCompleted = (text) => {
        Alert.alert(
          text,
          '本次输入的验证码',
          [
              {
              text: '确定',
            },
          ]
        )
    }

    const isValid = async () => {
        if(success){
            navigation.navigate('SettingsModal')
        }
        await verifyEmailToken(code)
        // if(code === '01234'){
        //    navigation.navigate('LoginContacts')
        // }
        // else{setInvalid(true)}
    }

    return (
    <View style={styles.container}>
        <Image source={logo} style={{ width: 50, height: 50 }} />
        <Text style={styles.title}>Share Interest</Text>
     
        {valid ? (
            <SafeAreaView style={styles.wrapper}>
                <View style={styles.labelView}>
                    <Text style={styles.label}>Enter verification code</Text>
                    <Text style={styles.hint}>A verification code was sent to: {email}</Text>
                </View>
              
                <CodeField
                    // ref={ref}
                    // {...props}
                    // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                    value={code}
                    onChangeText={setCode}
                    cellCount={CELL_COUNT}
                    rootStyle={styles.codeFieldRoot}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    renderCell={({index, symbol, isFocused}) => (
                    <Text
                        key={index}
                        style={[styles.cell, isFocused && styles.focusCell]}
                        onLayout={getCellOnLayoutHandler(index)}>
                        {symbol || (isFocused ? <Cursor /> : null)}
                    </Text>
                    )}
                />
                
                {showMessage && (
                    <View style={styles.message}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                {success && (
                    <View style={styles.message}>
                        <Text style={styles.hint}>Email updated successfully!</Text>
                    </View>
                )}

                {isLoading ? (
                    <TouchableOpacity
                    style={styles.button}
                >
                    <ActivityIndicator color="#fff" />
                </TouchableOpacity>
                ) : (
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => isValid()}
                >
                    <Text style={styles.buttonText}>{success ? 'Finish': 'Verify'}</Text>
                </TouchableOpacity>)}
            </SafeAreaView>
        ) : (
        <SafeAreaView style={styles.wrapper}>
          <View style={styles.labelView}>
              <Text style={styles.label}>Please enter new recovery email</Text>
              <Text style={styles.hint}> {email && `(Email: ${email})`}</Text>
          </View>
            <TextInput
                style={styles.input}
                placeholderTextColor='white'
                returnKeyType='done'
                onChangeText={(value) => setEmail(value)}
                placeholder="Email"
                value={email}
            />
          <View style={styles.labelView}>
              <Text style={styles.hint}>A verification code would be sent to your inbox</Text>
          </View>
          {showMessage && (
            <View style={styles.message}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

        {isLoading ? (
            <TouchableOpacity
            style={styles.button}
        >
            <ActivityIndicator color="#fff" />
        </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
                verifyEmail(email)
                // setValid(true)
            }}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        )}
        </SafeAreaView>
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
        fontWeight: 'bold',
        marginVertical: 20
    },
    inputContainer: {
        width: '100%',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '#fff',
        backgroundColor: 'transparent'
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    linkText: {
        fontSize: 14,
        color: '#2e78b7',
    },
    input: {
        width: '100%',
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: '#373737',
        color: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 5
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
    root: {
        flex: 1, 
        padding: 20
    },
    codeFieldRoot: {
        marginTop: 20
    },
    cell: {
        width: 40,
        height: 40,
        lineHeight: 38,
        fontSize: 24,
        borderWidth: 0.5,
        marginHorizontal: 5,
        borderRadius: 5,
        borderColor: '#fff',
        textAlign: 'center',
    },
    focusCell: {
        borderColor: '#000',
    },
});
