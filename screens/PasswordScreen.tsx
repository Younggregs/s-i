import React, { useState, useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';

import PhoneInput from "react-native-phone-number-input";
import PasswordInputText from 'react-native-hide-show-password-input';

export default function PasswordScreen({ navigation }: RootStackScreenProps<'NotFound'>) {
    const [text, setText] = useState('');
    const [text2, setText2] = useState('');
    const [password, setPassword] = useState('');
    const [codeText, setCodeText] = useState('');

    const [value, setValue] = useState("");
    const [formattedValue, setFormattedValue] = useState("");
    const [valid, setValid] = useState(false);
    const [countryCode, setCountryCode] = useState('')
    const [showMessage, setShowMessage] = useState(false);
    const phoneInput = useRef<PhoneInput>(null);
    let verifycode = useRef(null);
    
    return (
    <View style={styles.container}>
        <Text style={styles.title}>Share Interest</Text>
        {/* <View style={styles.labelView}>
            <Text style={styles.label}>Enter password</Text>
        </View> */}

        <View style={styles.inputContainer}>
            <PasswordInputText
                value={password}
                autoFocus={true}
                placeholder="Create password"
                placeholderTextColor={'#fff'}
                onChangeText={(password: React.SetStateAction<string>) => setPassword(password)}
                iconColor="#fff"
                textColor="#fff"
            />
        </View>

        <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.replace('LoginContacts')}
        >
            <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        
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
        backgroundColor: 'rgba(255,255,255,0.1)'
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
