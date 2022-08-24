import React, { useState, useCallback } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Animated, View, TouchableOpacity, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { useNavigation } from '@react-navigation/native';

import { Text } from './Themed';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

import * as friends from '../store/actions/friends';
import onShare from './Share';

const HEADER_HEIGHT = 200;

const AnimatedHeader = ({animatedValue, friend}) => {
    const colorScheme = useColorScheme();

    const insets = useSafeAreaInsets();
    const headerHeight = animatedValue.interpolate({
        inputRange: [0, HEADER_HEIGHT + insets.top],
        outputRange: [HEADER_HEIGHT + insets.top, insets.top + 44],
        extrapolate: 'clamp'
      });

    const [visible, setVisible] = useState(false);
    const hideMenu = () => setVisible(false);
    const showMenu = () => setVisible(true);
    const navigation = useNavigation();

    const [toggle, setToggle] = useState(friend.notification);

    const dispatch = useDispatch();

    const untag = async () => {
        try {
            console.log('res')
            await dispatch(friends.untagFriend(friend));
            navigation.goBack();
        } catch (err) {
           
        }
      }

    const toggleNotification = async () => {
        try {
            await dispatch(friends.toggleNotification(friend));
            setToggle(!toggle)
        } catch (err) {
            
        }
    }

    return (
        <Animated.View
            style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            height: headerHeight,
            backgroundColor: 'rgb(40,44,53)'
            }}
        >
            <SafeAreaProvider>
                <SafeAreaView style={{flex: 1}} forceInset={{ top: 'always' }}>
                    <View style={styles.container}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
                            <FontAwesome
                                name="arrow-left"
                                size={20}
                                color={Colors[colorScheme].text}
                            />
                        </TouchableOpacity>
                        <View style={styles.nameView}>
                            <Text style={styles.titleText}>{friend.name}</Text>
                        </View>
                        <TouchableOpacity onPress={() => untag()} style={styles.tag}>
                            <Text style={styles.text}>Untag</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => toggleNotification()} style={styles.notification}>
                            <FontAwesome
                                name="bell"
                                size={20}
                                color={`${toggle ? '#4169E1' : '#fff'}`}
                            />
                        </TouchableOpacity>
                        <View style={styles.menuContainer}>
                            <Menu
                                style={styles.menu}
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
                                <MenuItem 
                                    textStyle={styles.menuText} 
                                    onPress={() => onShare(`${friend.name}\n${friend.phone}`)}>
                                    Share
                                </MenuItem>
                                <MenuDivider />
                                <MenuItem 
                                    textStyle={styles.menuText} 
                                    onPress={() => Linking.openURL('content://com.android.contacts/contacts')}>
                                    View in address book
                                </MenuItem>
                                <MenuDivider />
                            </Menu>
                        </View>
                    </View>
                    <View style={styles.contentContainer}>
                        <View style={styles.imageView}>
                            <Text style={styles.imageAlphabet}>{friend.name.substring(0, 1)}</Text>
                        </View> 
                        <Text style={styles.titleText}>
                            {friend.phone ? friend.phone : friend.phoneNumbers[0].number}
                        </Text>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        </Animated.View>
    )
};

const styles = StyleSheet.create({
    container: { 
        flexDirection: 'row',
        paddingHorizontal: 5,
        paddingVertical: 5,
        backgroundColor: 'transparent',
        alignItems: 'center'
    },
    contentContainer: { 
        paddingHorizontal: 5,
        paddingVertical: 5,
        backgroundColor: 'transparent',
        alignItems: 'center'
    },
    menuText: {
      color: '#fff'
    },
    menu: {
        backgroundColor: '#000'
    },
    menuContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    imageView: {
        borderColor: '#fff',
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#000',
        height: 100,
        width: 100,
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageAlphabet: {
        fontSize: 35,
        fontWeight: 'bold'
    },
    backIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        flex: 2
    },
    icon: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingHorizontal: 10
    },
    nameView: {
        flex: 8
    },
    text: {
        color: '#fff'
    },
    tag: {
        flex: 2,
        borderColor: '#fff',
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#4169E1',
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 30
    },
    notification: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default AnimatedHeader;