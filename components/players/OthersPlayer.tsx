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

export default function OthersPlayer({link_text}) {

    const [visible, setVisible] = useState(false);
    const [text, setText] = useState('');
    const [tweet, setTweet] = useState({})
    const [loaded, setLoaded] = useState(false);
    const navigation = useNavigation();
    
    return (
        <View style={styles.itemView}>
           <RNUrlPreview 
              text={link_text}
              containerStyle={styles.itemView}
              titleStyle={{color: '#fff', fontWeight: 'bold', fontSize: 15}}
              descriptionStyle={{color: '#fff'}}
              imageStyle={{height: 140, width: 100}}
              onLoad={() => setLoaded(true)}
            />
              {!loaded && (
                <View style={styles.itemView}>
                  <Text style={styles.loadingText}>Loading...</Text>
                </View>
              )}
        </View>
  );
}

const styles = StyleSheet.create({
    container: { 
        flexDirection: 'row',
        backgroundColor: 'transparent',
        
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
