import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Linking from "expo-linking";

import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';

import PhoneInput from "react-native-phone-number-input";
import SMSVerifyCode from 'react-native-sms-verifycode';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
  } from 'react-native-confirmation-code-field';

const CELL_COUNT = 5;

export default function ChangeRecoveryEmailScreen({ navigation }: RootStackScreenProps<'NotFound'>) {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [_url, setUrl] = useState('');

    const [value, setValue] = useState("");
    const [formattedValue, setFormattedValue] = useState("");
    const [valid, setValid] = useState(false);
    const [invalidCode, setInvalid] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const phoneInput = useRef<PhoneInput>(null);
    let verifycode = useRef(null);

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

    const isValid = () => {
        if(code === '012345'){
            navigation.goBack()
        }
        else{setInvalid(true)}
    }

    return (
    <View style={styles.container}>
        {valid ? (
            <SafeAreaView style={styles.wrapper}>
                <View style={styles.labelView}>
                    <Text style={styles.label}>Enter verification code</Text>
                    <Text style={styles.hint}>A verification code was sent to: {email}</Text>
                </View>
                
                <CodeField
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
              <Text style={styles.label}>Please enter new recovery email</Text>
              <Text style={styles.hint}>(Your current verification email is: dummy@email.com)</Text>
          </View>
            <TextInput
                style={styles.input}
                placeholderTextColor='white'
                multiline
                onChangeText={(value) => setEmail(value)}
                placeholder="Email"
                value={email}
            />
          <View style={styles.labelView}>
              <Text style={styles.hint}>A verification code would be sent to your inbox</Text>
          </View>
          {showMessage && (
            <View style={styles.message}>
                <Text style={styles.errorText}>Invalid phone number</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
                setValid(true)
            }}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </SafeAreaView>
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
