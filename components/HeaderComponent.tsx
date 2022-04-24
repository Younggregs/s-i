import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Platform, ColorSchemeName, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';

import { Text, View } from '../components/Themed';
import { useNavigation } from '@react-navigation/native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

export default function HeaderComponent() {
    const colorScheme = useColorScheme();

    const [visible, setVisible] = useState(false);
    const [isSearch, setIsSearch] = useState(false)
    const [text, setText] = useState('')
    const hideMenu = () => setVisible(false);
    const showMenu = () => setVisible(true);
    const navigation = useNavigation();
    
    return (
        <>
            {isSearch ? ( 
            <View style={styles.container}>
                <TouchableOpacity style={styles.backIcon} onPress={() => setIsSearch(false)}>
                    <FontAwesome
                        name="arrow-left"
                        size={20}
                        color={Colors[colorScheme].text}
                    />
                </TouchableOpacity>
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
            ) : ( 
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>
                        Share Interest
                    </Text>
                </View>
                <View>
                    
                </View>
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => setIsSearch(true)} style={styles.icon}>
                        <FontAwesome
                            name="search"
                            size={20}
                            color={Colors[colorScheme].text}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.iconContainer}>
                    <Menu
                        visible={visible}
                        anchor={
                        <TouchableOpacity onPress={showMenu} style={styles.icon}>
                            <FontAwesome
                                name="ellipsis-v"
                                size={20}
                                color={Colors[colorScheme].text}
                            />
                        </TouchableOpacity>}
                        onRequestClose={hideMenu}
                    >
                        <MenuItem  onPress={() => navigation.navigate('ProfileModal')}>My Profile</MenuItem>
                        <MenuDivider />
                        <MenuItem onPress={() => navigation.navigate('SettingsModal')}>Settings</MenuItem>
                    </Menu>
                </View>
            </View>
            )}
            
        </>
    );
}

const styles = StyleSheet.create({
    container: { 
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: 'transparent',
        alignItems: 'center'
    },
    title: {
        flex: 8,
        backgroundColor: 'transparent'
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    iconContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    icon: {
        width: 30,
        height: 30,
        backgroundColor: 'transparent',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    textInputContainer: {
        color: '#fff'
    },
    search: {
        width: '100%',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: 'transparent'
    },
    backIcon: {
        width: 40,
        height: 30,
        paddingHorizontal: 5,
        marginLeft: 10,
        paddingVertical: 5,
        backgroundColor: 'transparent',
    }
});
