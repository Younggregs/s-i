import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Linking from "expo-linking";
import { useDispatch, useSelector } from 'react-redux';

import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import * as auth from '../store/actions/auth';
import logo from '../assets/images/logo.png'

import PhoneInput from "react-native-phone-number-input";
import SMSVerifyCode from 'react-native-sms-verifycode';
import PasswordInputText from 'react-native-hide-show-password-input';

import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
  } from 'react-native-confirmation-code-field';

const CELL_COUNT = 5;

export default function ForgotPasswordScreen({ route, navigation }: RootStackScreenProps<'NotFound'>) {
    const { phone_id } = route.params;
    
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [_url, setUrl] = useState('');
    const [password, setPassword] = useState('');

    const [value, setValue] = useState("");
    const [formattedValue, setFormattedValue] = useState("");
    const [valid, setValid] = useState(true);
    const [invalidCode, setInvalid] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const phoneInput = useRef<PhoneInput>(null);
    let verifycode = useRef(null);

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    

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

    const isInvited = () => {
        if(value === '08109599597' || value === '08109599598'){setValid(true)}
        else{navigation.navigate('Invite')}
    }

    const isValid = async () => {
        await verifyEmailToken(code)
        // if(code === '01234'){
        //    setValid(false)
        // }
        // else{setInvalid(true)}
    }

    const submit = useCallback(async (phone_id, password) => {
        setIsLoading(true);
        try {
            const message = await dispatch(auth.forgot_password(phone_id, password));
            if(message.code){
                navigation.navigate('Password', {phone_id: phone_id, isReturning: true})
            }else{
                
            }
        } catch (err) {
            setError(err.message);
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
            const res = await dispatch(auth.verify_email_forgot_password(phone_id));

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
        {/* <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder="Phone number"
                placeholderTextColor={'#fff'}
                autoFocus={true}
                returnKeyType="next"
                clearButtonMode="always"
                enablesReturnKeyAutomatically={true}
                onChangeText={newText => setText(newText)}
                defaultValue={text}
            />
        </View> */}
        {valid ? (
            <SafeAreaView style={styles.wrapper}>
                <View style={styles.labelView}>
                    <Text style={styles.label}>Enter verification code</Text>
                    <Text style={styles.hint}>A verification code was sent to your recovery email: {email}</Text>
                </View>
                {/* <SMSVerifyCode
                    onInputCompleted={onInputCompleted}
                    containerPaddingHorizontal={30}
                    containerBackgroundColor="transparent"
                    codeColor="#fff"
                    initialCodes={[1, 2, 3, 4, 5]}
                /> */}
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
         <View style={styles.inputContainer}>
            <PasswordInputText
                value={password}
                autoFocus={true}
                placeholder="Create new password"
                placeholderTextColor={'#fff'}
                onChangeText={(password: React.SetStateAction<string>) => setPassword(password)}
                iconColor="#fff"
                textColor="#fff"
            />
        </View>

        <TouchableOpacity
            style={styles.button}
            onPress={() => submit(phone_id, password)}
        >
            <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        </SafeAreaView>
        )}
        
        <TouchableOpacity onPress={() => navigation.replace('Root')} style={styles.link}>
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
