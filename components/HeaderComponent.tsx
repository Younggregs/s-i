import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';

import { Text, View } from '../components/Themed';
import { useNavigation } from '@react-navigation/native';

export default function HeaderComponent() {

    const [visible, setVisible] = useState(false);
    const hideMenu = () => setVisible(false);
    const showMenu = () => setVisible(true);
    const navigation = useNavigation();
    
    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <Text style={styles.titleText}>
                    Share Interest
                </Text>
            </View>
            <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('SearchModal')} style={styles.icon}></TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
                <Menu
                    visible={visible}
                    anchor={<TouchableOpacity onPress={showMenu} style={styles.icon}></TouchableOpacity>}
                    onRequestClose={hideMenu}
                >
                    <MenuItem  onPress={() => navigation.navigate('ProfileModal')}>My Profile</MenuItem>
                    <MenuDivider />
                    <MenuItem onPress={() => navigation.navigate('SettingsModal')}>Settings</MenuItem>
                </Menu>
            </View>
        </View>
  );
}

const styles = StyleSheet.create({
    container: { 
        flexDirection: 'row'
    },
    title: {
        flex: 8,
        
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    iconContainer: {
        flex: 1
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
