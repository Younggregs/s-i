import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Linking, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';

import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import * as auth from '../store/actions/auth';
import logo from '../assets/images/logo.png'

import PhoneInput from "react-native-phone-number-input";

import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
  } from 'react-native-confirmation-code-field';

const CELL_COUNT = 5;

export default function ForgotPasswordScreen({ route, navigation }: RootStackScreenProps<'NotFound'>) {
    const { phone_id, phone, callingCode } = route.params;
    
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [_url, setUrl] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false)

    const [value, setValue] = useState("");
    const [valid, setValid] = useState(true);
    const [invalidCode, setInvalid] = useState(false);

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const isValid = async () => {
        await verifyEmailToken(code)
        // if(code === '01234'){
        //    setValid(false)
        // }
        // else{setInvalid(true)}
    }

    const submit = useCallback(async (phone_id, password) => {
        const passwordValidate = password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*"'()+,-./:;<=>?[\]^_`{|}~])(?=.{8,})/)
        setIsLoading(true);
        if(passwordValidate){
            try {
                const message = await dispatch(auth.forgot_password(phone_id, password));
                if(message.code){
                    navigation.navigate('Password', {phone_id: phone_id, isReturning: true})
                }else{
                    
                }
            } catch (err) {
                setError(err.message);
            }
        }else{
            setError('New password not valid, please confirm it contains all necessary characters specified above.')
        }
        setIsLoading(false);
    }, [dispatch, setIsLoading, setError])


    const verifyEmailToken = useCallback(async (token) => {
        setIsLoading(true);
        try {
            const message = await dispatch(auth.verify_email_token(token));
            if(message.code){
                // navigation.navigate('LoginContacts')
                setValid(false)
            }else{
                setInvalid(true)
            }
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, setIsLoading, setError])

    const getEmailID = useCallback(async () => {
        setError('');
        setIsLoading(true);
        try {
            const res = await dispatch(auth.verify_email_forgot_password(phone_id, phone, callingCode));
            if(res.error_message){

            }else{
                const message = await dispatch(auth.verify_email(phone_id, res.code));
                setEmail(res.code)
            }
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
      }, [dispatch, setIsLoading, setError])
      
    
      useEffect(() => {
        getEmailID()
        .then(() => {
            setIsLoading(false);
        });
      }, [dispatch, getEmailID])    

    return (
    <>
    {isLoading ? (
          <View style={styles.container}>
            <ActivityIndicator color="#fff" size='large'/>
          </View>
    ) : (
    <View style={styles.container}>
        <Image source={logo} style={{ width: 50, height: 50 }} />
        <Text style={styles.title}>Share Interest</Text>
        {valid ? (
            <SafeAreaView style={styles.wrapper}>
                <View style={styles.labelView}>
                    <Text style={styles.label}>Enter verification code</Text>
                    <Text style={styles.hint}>A verification code was sent to your recovery email: {email}</Text>
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
                {invalidCode && (
                    <View style={styles.message}>
                        <Text style={styles.errorText}>Incorrect code</Text>
                    </View>
                )}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => isValid()}
                >
                    <Text style={styles.buttonText}>Verify</Text>
                </TouchableOpacity>
            </SafeAreaView>
        ) : (
        <SafeAreaView style={styles.wrapper}>
        <View style={styles.labelView}>
            <Text style={styles.label}>Create new password</Text>
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
        <View>
            <Text>
                Password must contain atleast 1 lowercase and 1 uppercase alphabetical characters respectively, 1 numeric character, 
                1 special character and should be atleast 8 characters long.
            </Text>
        </View>

        {error.length < 1 ? <View /> : <View style={styles.feedback}><Text style={styles.feebackFailedText}>{error}</Text></View>}

        <TouchableOpacity
            style={styles.button}
            onPress={() => submit(phone_id, password)}
        >
            <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        </SafeAreaView>
        )}
        
        <TouchableOpacity onPress={() => Linking.openURL('https://shareinterest.app')} style={styles.link}>
            <Text style={styles.linkText}>shareinterest.app</Text>
        </TouchableOpacity>
    </View>
    )}
    </>
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
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '#fff',
        backgroundColor: 'transparent',
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
