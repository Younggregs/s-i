import React, { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { View } from '../components/Themed';
import { useNavigation } from '@react-navigation/native';

export default function SearchHeader() {
    const [text, setText] = useState('');
    
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
        flexDirection: 'row',
        backgroundColor: 'transparent'
    },
    search: {
        width: '100%',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: 'transparent'
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
    }
});
