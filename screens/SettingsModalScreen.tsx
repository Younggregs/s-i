import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Linking, Touchable, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { Text, View } from '../components/Themed';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

import * as auth from '../store/actions/auth';

export default function SettingsModalScreen() {
  const colorScheme = useColorScheme();
  const terms = 'https://shareinterest.app/terms-conditions'
  const privacy = 'https://shareinterest.app/privacy'
  const faq = 'https://shareinterest.app/faq'
  
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const logout = () => {
    try {
        dispatch(auth.logout());
    } catch (err) {
    }
  }


  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={() => navigation.navigate('About')} style={styles.view}>  
        <View style={styles.iconView}>
          <FontAwesome
                name="info"
                size={20}
                color={Colors[colorScheme].text}
            />
        </View>
        <Text style={styles.title}>About app</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Message')} style={styles.view}>  
        <View style={styles.iconView}>
          <FontAwesome
                name="comment-o"
                size={20}
                color={Colors[colorScheme].text}
            />
        </View>
        <Text style={styles.title}>Message us</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.view} onPress={() => navigation.navigate('ChangePassword')}>  
        <View style={styles.iconView}>
          <FontAwesome
            name="key"
            size={20}
            color={Colors[colorScheme].text}
          />
        </View>
        <Text style={styles.title}>Change password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.view} onPress={() => navigation.navigate('ChangeRecoveryEmail')}>  
        <View style={styles.iconView}>
          <FontAwesome
            name="envelope-o"
            size={20}
            color={Colors[colorScheme].text}
          />
        </View>
        <Text style={styles.title}>Change Recovery Email</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.view} onPress={() => Linking.openURL(terms)}>  
        <View style={styles.iconView}>
          <FontAwesome
            name="file"
            size={20}
            color={Colors[colorScheme].text}
          />
        </View>
        <Text style={styles.title}>Terms and Conditions</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.view} onPress={() => Linking.openURL(privacy)}>  
        <View style={styles.iconView}>
          <FontAwesome
            name='unlock-alt'
            size={20}
            color={Colors[colorScheme].text}
          />
        </View>
        <Text style={styles.title}>Privacy Policy</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.view} onPress={() => Linking.openURL(faq)}>  
        <View style={styles.iconView}>
          <FontAwesome
            name='question-circle-o'
            size={20}
            color={Colors[colorScheme].text}
          />
        </View>
        <Text style={styles.title}>Frequently Asked Questions</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.view} 
        onPress={() => 
        {
          logout()
        }}>  
        <View style={styles.iconView}>
          <FontAwesome
            name="sign-out"
            size={20}
            color={Colors[colorScheme].text}
          />
        </View>
        <Text style={styles.title}>Log out</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.view} 
        onPress={() => 
        {
          logout(),
          navigation.navigate('Login')
          
        }}>  
        <View style={styles.iconView}>
          <FontAwesome
            name="trash-o"
            size={20}
            color={Colors[colorScheme].text}
          />
        </View>
        <Text style={styles.title}>Delete Account</Text>
      </TouchableOpacity>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginVertical: 10,
    marginHorizontal: 20,
    flex: 8
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  view: {
    flexDirection: "row"
  },
  iconView: {
    flex: 2,
    alignItems: "center",
    justifyContent: 'center'
  }
});
