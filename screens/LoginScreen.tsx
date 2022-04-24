import React, { useState, useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';

import PhoneInput from "react-native-phone-number-input";

export default function LoginScreen({ navigation }: RootStackScreenProps<'NotFound'>) {
    const [text, setText] = useState('');

    const [value, setValue] = useState("");
    const [formattedValue, setFormattedValue] = useState("");
    const [valid, setValid] = useState(false);
    const [countryCode, setCountryCode] = useState('')
    const [showMessage, setShowMessage] = useState(false);
    const phoneInput = useRef<PhoneInput>(null);

    return (
    <View style={styles.container}>
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
        <SafeAreaView style={styles.wrapper}>
          {showMessage && (
            <View style={styles.message}>
                <Text>CountryCode: {countryCode}</Text>
                <Text>Value : {value}</Text>
                <Text>Formatted Value : {formattedValue}</Text>
                <Text>Valid : {valid ? "true" : "false"}</Text>
            </View>
          )}
          <PhoneInput
            ref={phoneInput}
            defaultValue={value}
            defaultCode="US"
            layout="first"
            onChangeText={(text) => {
              setValue(text);
            }}
            onChangeFormattedText={(text) => {
              setFormattedValue(text);
            }}
            containerStyle={{ borderRadius: 10, borderColor: '#fff', borderWidth: 2, borderStyle: 'solid'}}
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
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              const checkValid = phoneInput.current?.isValidNumber(value);
              const checkCountryCode = phoneInput.current?.getCountryCode();
              setShowMessage(true);
              setValid(checkValid ? checkValid : false);
              setCountryCode(checkCountryCode);
            }}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </SafeAreaView>
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

    },
    wrapper: {
        width: '100%',
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
