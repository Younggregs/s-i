import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useCallback } from 'react';
import { Platform, StyleSheet, TextInput, TouchableNativeFeedback, TouchableOpacity } from 'react-native';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { useDispatch, useSelector } from 'react-redux';
import RNUrlPreview from 'react-native-url-preview';

import { Text, View } from '../Themed';
import { RootTabScreenProps } from '../../types';
import { useNavigation } from '@react-navigation/native';
import * as interests from '../../store/actions/interests';

export default function TextPlayer({link_text}) {

    const [visible, setVisible] = useState(false);
    const [text, setText] = useState('');
    const [tweet, setTweet] = useState({})
    const [loaded, setLoaded] = useState(false);
    const navigation = useNavigation();
    
    return (
        <View style={styles.itemView}>
           <Text style={styles.categoryText}>{link_text && link_text}</Text>
        </View>
  );
}

const styles = StyleSheet.create({
    categoryText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        margin:5
    },
    itemView: {
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5
      },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',
        margin:5
      },
});
