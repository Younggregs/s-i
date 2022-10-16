import React, { useState, useRef, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator, Linking, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { Text, View } from '../components/Themed';
import logo from '../assets/images/logo.png'
import { RootStackScreenProps } from '../types';
import * as auth from '../store/actions/auth';

import PhoneInput from "react-native-phone-number-input";
import SMSVerifyCode from 'react-native-sms-verifycode';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
  } from 'react-native-confirmation-code-field';


const CELL_COUNT = 5;

export default function LoginScreen({ navigation }: RootStackScreenProps<'NotFound'>) {
    const [text, setText] = useState('');
    const [code, setCode] = useState('');
    const [_url, setUrl] = useState('');

    const [value, setValue] = useState("");
    const [formattedValue, setFormattedValue] = useState("");
    const [valid, setValid] = useState(false);
    const [invalidCode, setInvalid] = useState(false);
    const [countryCode, setCountryCode] = useState('');
    const [callingCode, setCallingCode] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [isReturning, setIsReturning] = useState(false);
    const phoneInput = useRef<PhoneInput>(null);

    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState('');

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

    const verifyPhone = useCallback(async (phone, phone_id, callingCode, countryCode) => {
        setError('');
        setShowMessage(false)
        setIsLoading(true);
        try {
            const message = await dispatch(auth.verify_invite_phone(phone, phone_id, callingCode));
            if(message.token){
                setValid(true)
                const res = await dispatch(auth.verify_phone(phone, phone_id, callingCode, countryCode));
                if(res.code){
                    setIsReturning(parseInt(res.code) == 1 ? true : false )
                }
            }else{
                navigation.navigate('Invite')
            }
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, setIsLoading, setError])

    const resendOTP = useCallback(async (phone, phone_id, callingCode, countryCode) => {
        setIsRefreshing(true)
            const res = await dispatch(auth.verify_phone(phone, phone_id, callingCode, countryCode));
        setIsRefreshing(false)
    }, [dispatch, setIsRefreshing])

    const isInvited = async (countryCode, callingCode) => {
        // for test purposes
        if(value === '07015020502' || value === '08094862708'){
            navigation.navigate('Password', {phone_id: formattedValue, phone: value, callingCode: callingCode, isReturning: true })
        }else{
            verifyPhone(value, formattedValue, callingCode, countryCode)
        }
        
        // if(value === '08109599597' || value === '07015020502'){setValid(true)}
        // else{navigation.navigate('Invite')}
    }

    const isValid = async () => {
        setIsLoading(true)
        const response = await dispatch(auth.verify_phone_token(formattedValue, code));
        if(response.code === 'approved'){
         navigation.navigate('Password', {phone_id: formattedValue, phone: value, callingCode: callingCode, isReturning: isReturning })
        }else{
         setInvalid(true)
        }

        // if(code === '01234'){
        //     navigation.navigate('Password', {phone_id: formattedValue, isReturning: isReturning})
        //  }
        //  else{setInvalid(true)}

        setIsLoading(false)
    }

    useEffect(() => {
        const checkLoginStatus = async () => {
            let user = await AsyncStorage.getItem('user')
            if(user){
                finish()
            }
        }

        checkLoginStatus()
    
    })

    const finish = () => {
    
        try {
            dispatch(auth.signin());
        } catch (err) {
        }
    }

    return (
    <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
    >
        <Image source={logo} style={{ width: 50, height: 50 }} />
        <Text style={styles.title}>Share Interest</Text>
        {valid ? (
            <SafeAreaView style={styles.wrapper}>
                <View style={styles.labelView}>
                    <Text style={styles.label}>Enter verification code</Text>
                    <Text style={styles.hint}>A verification code was sent to your whatsapp inbox: {value}</Text>
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

                {isRefreshing ? (
                <View>
                    <ActivityIndicator color="#fff" />
                </View>
                ) : (
                <TouchableOpacity onPress={() => resendOTP(value, formattedValue, callingCode, countryCode)} style={styles.otpStyle}>
                    <Text style={styles.otpText}>Resend OTP</Text>
                    <FontAwesome
                        name="rotate-right"
                        size={15}
                        color={'#fff'}
                    />
                </TouchableOpacity>
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
                    <Text style={styles.buttonText}>Verify</Text>
                </TouchableOpacity>
                )}
                
            </SafeAreaView>
        ) : (
        <SafeAreaView style={styles.wrapper}>
          <View style={styles.labelView}>
              <Text style={styles.label}>Enter Phone number</Text>
          </View>
          <PhoneInput
            ref={phoneInput}
            defaultValue={value}
            defaultCode="NG"
            layout="first"
            onChangeText={(text) => {
              setValue(text);
            }}
            onChangeFormattedText={(text) => {
              setFormattedValue(text);
              setShowMessage(false);
            }}
            containerStyle={{ borderRadius: 10, borderColor: '#fff', borderWidth: 0.5, borderStyle: 'solid'}}
            textContainerStyle={{ backgroundColor: '#000', borderRadius: 10}}
            textInputStyle={{ color: '#fff'}}
            textInputProps={{
                selectionColor: '#fff',
                placeholderTextColor: '#fff'
            }}
            codeTextStyle={{ color: '#fff'}}
            withDarkTheme
            withShadow
            autoFocus
          />
          <View style={styles.labelView}>
              <Text style={styles.hint}>A verification code would be sent to your inbox</Text>
          </View>
          {showMessage && (
            <View style={styles.message}>
                <Text style={styles.errorText}>Invalid phone number</Text>
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
                const checkValid = phoneInput.current?.isValidNumber(value);
                const checkCountryCode = phoneInput.current?.getCountryCode();
                const checkCountryPrefix = phoneInput.current?.getCallingCode();
                setShowMessage(true);
                checkValid ? isInvited(checkCountryCode, checkCountryPrefix) : setValid(false)
                setCountryCode(checkCountryCode !== undefined ? checkCountryCode : '');
                setCallingCode(checkCountryPrefix !== undefined ? checkCountryPrefix : '');
            }}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        )}
          {/* {showMessage && (
            <View style={styles.message}>
                <Text style={styles.errorText}>Invalid phone number</Text>
                <Text>CountryCode: {countryCode}</Text>
                <Text>CallingCode: {callingCode}</Text>
                <Text>Value : {value}</Text>
                <Text>Formatted Value : {formattedValue}</Text>
                <Text>Valid : {valid ? "true" : "false"}</Text>
            </View>
          )} */}
        </SafeAreaView>
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
    otpStyle: {
        flexDirection: 'row',
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    otpText: {
        margin: 5,
        fontSize: 15
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
