import React, { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Animated, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import { useNavigation } from '@react-navigation/native';

import { Text } from './Themed';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

const HEADER_HEIGHT = 200;

const MyAnimatedHeader = ({animatedValue}) => {
    const colorScheme = useColorScheme();

    const insets = useSafeAreaInsets();
    const headerHeight = animatedValue.interpolate({
        inputRange: [0, HEADER_HEIGHT + insets.top],
        outputRange: [HEADER_HEIGHT + insets.top, insets.top + 44],
        extrapolate: 'clamp'
      });

    const [visible, setVisible] = useState(false);
    const navigation = useNavigation();

    const dispatch = useDispatch();

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
                            <Text style={styles.titleText}>My Profile</Text>
                        </View>
                    </View>
                    <View style={styles.contentContainer}>
                        <View style={styles.imageView}>
                            <Text style={styles.imageAlphabet}>Me</Text>
                        </View> 
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
    }
})

export default MyAnimatedHeader;