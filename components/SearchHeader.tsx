import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { useNavigation } from '@react-navigation/native';

export default function HeaderComponent() {

    const [visible, setVisible] = useState(false);
    const [text, setText] = useState('');
    const navigation = useNavigation();
    
    return (
        <View style={styles.container}>
            <View style={styles.search}>
                <TextInput
                    style={styles.textInputContainer}
                    placeholder="Search"
                    placeholderTextColor={'#fff'}
                    autoFocus={true}
                    returnKeyType="search"
                    clearButtonMode="always"
                    enablesReturnKeyAutomatically={true}
                    onChangeText={newText => setText(newText)}
                    defaultValue={text}
                />
            </View>
            
        </View>
  );
}

const styles = StyleSheet.create({
    container: { 
        flexDirection: 'row'
    },
    search: {
        width: '100%',
    },
    searchText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    textInputContainer: {
        flex: 1,
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
});
