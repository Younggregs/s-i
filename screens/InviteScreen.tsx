import React, { useEffect, useState, useCallback, } from "react";
import {
  Platform,
  StyleSheet,
  Image,
  TouchableOpacity
} from "react-native";
import * as Contacts from "expo-contacts";
import * as Linking from 'expo-linking';
import { useDispatch, useSelector } from "react-redux";

import { StatusBar } from "expo-status-bar";
import { Text, View } from "../components/Themed";
import logo from '../assets/images/logo.png'

import * as friends from "../store/actions/friends";
import { useNavigation } from '@react-navigation/native';

export default function InviteModalScreen() {

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const loadContact = useCallback(
    async (data) => {
      setError("");
      setIsRefreshing(true);
      try {
        await dispatch(friends.setContacts(data));
      } catch (err) {
        setError(err.message);
      }
      setIsRefreshing(false);
    },
    [dispatch, setIsLoading, setError]
  );

  const _handleUrl = async () => {
    const link = await Linking.getInitialURL()
    if(link !== null){
        let { hostname, path, queryParams } = Linking.parse(link);
        if(queryParams.invite === 'dlrow'){
          navigation.navigate('Login')
        }
        // console.log(`Linked to app with hostname: ${hostname}, path: ${path} and data: ${JSON.stringify(queryParams)}`)
    }
  };

  useEffect(() => {
      if(Linking.getInitialURL() !== null){
          _handleUrl()
      }
  });

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails],
        });

        if (data.length > 0) {
          const valid_contacts = data.filter(item => item.name !== undefined)
          loadContact(valid_contacts)
        }
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={logo} style={{ width: 50, height: 50 }} />
      <View
        style={styles.separator}
        lightColor='#eee'
        darkColor='rgba(255,255,255,0.1)'
      />
      <View style={styles.textView}>
        <Text style={styles.title}>Share Interest</Text>
        <Text style={styles.text}>Hey dear, you need a valid invite link to continue... sorry.</Text>
        <Text>You can request invite from your contacts, 
          click the button below to see if any 
          your contacts is on Share Interest. 
        </Text>
      </View>
      
      <View style={styles.requestView}>
        <TouchableOpacity onPress={() => navigation.navigate('RequestInviteModal')} style={styles.buttonView}>
          <Text style={styles.buttonText}>Request Invite</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>{'<< Go back to Login'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => Linking.openURL('https://shareinterest.app')} style={styles.link}>
          <Text style={styles.linkText}>shareinterest.app</Text>
      </TouchableOpacity>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
      fontSize: 14,
      color: '#2e78b7',
  },
  textView: {
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  requestView:{
    marginVertical: 20
  },
  contact: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 1,
    flex: 2,
  },
  contactView: {
    height: "100%",
    width: "100%",
  },
  tagView: {
    padding: 10,
    borderRadius: 5,
    borderColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderStyle: "solid",
    flex: 2,
  },
  contactImage: {
    height: 40,
    width: 40,
    borderRadius: 25,
    borderColor: "#ffffff",
    borderWidth: 1,
    borderStyle: "solid",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: '#fff'
  },
  text: {
    textAlign: 'center',
    color: '#fff'
  },
  buttonText: {
    fontWeight: "bold",
    color: '#000'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  item: {
    height: 50,
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 15,
    flex: 8,
  },
  buttonView: {
    backgroundColor: '#fff',
    height: 40, 
    width: 150,
    alignItems: "center",
    justifyContent: "center",
  }
});
