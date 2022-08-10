import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback } from 'react';
import { Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { useDispatch, useSelector } from 'react-redux';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { useNavigation } from '@react-navigation/native';

import * as auth from '../store/actions/auth';

export default function LoginContactSearchHeader() {

    const [visible, setVisible] = useState(false);
    const [text, setText] = useState('');
    const navigation = useNavigation();

    const dispatch = useDispatch();

    const finish = () => {
        const phone = '03003039'
        const password = 'password'
        const expoPushToken = 'khadjadjkkaldjfkd'

        try {
            dispatch(auth.signin());
        } catch (err) {
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.search}>
                <TextInput
                    style={styles.input}
                    placeholder="Tag Friends"
                    placeholderTextColor={'#fff'}
                    autoFocus={true}
                    returnKeyType="search"
                    clearButtonMode="always"
                    enablesReturnKeyAutomatically={true}
                    onChangeText={newText => setText(newText)}
                    defaultValue={text}
                />
            </View>
            <View style={styles.buttonView}>
                <TouchableOpacity style={styles.button} onPress={() => finish()}>
                    <Text style={styles.buttonText}> Done </Text>
                </TouchableOpacity> 
            </View>    
        </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'transparent'
    },
    search: {
        flex: 8,
        borderRadius: 10,
        paddingVertical: 5,
        backgroundColor: 'transparent'
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff'
    },
    input: {
        color: '#fff'
    },
    icon: {
        width: 30,
        height: 30,
        backgroundColor: '#fff'
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    buttonView: {
        flex: 3,
        backgroundColor: 'transparent'
    },
    button: {
        height: 40,
        width: 100,
        padding: 5,
        borderRadius: 5,
        backgroundColor: "#2196F3",
        alignItems: 'center',
        justifyContent: 'center',
    }
});
