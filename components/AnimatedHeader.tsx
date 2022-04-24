import React, {useState} from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Animated, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { useNavigation } from '@react-navigation/native';

import { Text } from './Themed';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

const HEADER_HEIGHT = 200;

const AnimatedHeader = ({animatedValue}) => {
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

    return (
        <Animated.View
            style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            height: headerHeight,
            backgroundColor: '#373737'
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
                            <Text style={styles.titleText}>Retzam Danladi</Text>
                        </View>
                        <TouchableOpacity style={styles.tag}>
                            <Text style={styles.text}>Tag</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.notification}>
                            <FontAwesome
                                name="bell"
                                size={20}
                                color={Colors[colorScheme].text}
                            />
                        </TouchableOpacity>
                        <View style={styles.menu}>
                            <Menu
                                visible={visible}
                                anchor={<TouchableOpacity onPress={showMenu} style={styles.icon}>
                                    <FontAwesome
                                        name="ellipsis-v"
                                        size={20}
                                        color={Colors[colorScheme].text}
                                    />
                                </TouchableOpacity>}
                                onRequestClose={hideMenu}
                            >
                                <MenuItem  onPress={() => navigation.navigate('ProfileModal')}>View in address book</MenuItem>
                                <MenuDivider />
                            </Menu>
                        </View>
                    </View>
                    <View style={styles.contentContainer}>
                        <View style={styles.imageView} />
                        <Text style={styles.titleText}>0810 959 9597</Text>
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
    imageView: {
        borderColor: '#fff',
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 5,
        height: 100,
        width: 100,
        marginVertical: 5
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
    menu: {
        flex: 1,
    },
    tag: {
        flex: 2,
        borderColor: '#fff',
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 5,
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