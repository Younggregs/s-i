import React, { useEffect, useState, useCallback, } from "react";
import {
  Platform,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import * as Contacts from "expo-contacts";
import { useDispatch, useSelector } from "react-redux";
import * as Linking from "expo-linking";

import { StatusBar } from "expo-status-bar";
import { Text, View } from "../components/Themed";
import logo from '../assets/images/logo.png'
import onShare from "../components/Share";

import * as friends from "../store/actions/friends";
import { useNavigation } from '@react-navigation/native';

const testActiveContacts = [
  {
    contactType: "person",
    firstName: "0802",
    id: "23350",
    imageAvailable: false,
    lastName: "5431",
    lookupKey: "3789r23006-132313172113191D1B1915",
    middleName: "703",
    name: "0802 703 5431",
  },
  {
    contactType: "person",
    firstName: "7",
    id: "21900",
    imageAvailable: false,
    lastName: "Emmy",
    lookupKey: "1724i126931420c65fbd1.3789r21657-213242425A",
    name: "7 Emmy",
  },
  {
    contactType: "person",
    firstName: "AO",
    id: "21806",
    imageAvailable: false,
    lookupKey: "1724i60424f7a0e70f9f7",
    name: "AO",
  },
  {
    contactType: "person",
    firstName: "Abdul",
    id: "22315",
    imageAvailable: false,
    lastName: "BoardMan",
    lookupKey: "1724i43be121e8b832a69",
    name: "Abdul BoardMan",
  },
  {
    contactType: "person",
    firstName: "Abdul",
    id: "2712",
    imageAvailable: false,
    lastName: "Ptwn",
    lookupKey: "1724i7ec282d98a3e602f",
    name: "Abdul Ptwn",
  },
  {
    contactType: "person",
    firstName: "Abdulrasaq",
    id: "2718",
    imageAvailable: false,
    lookupKey: "1724i55ef0d650b520827",
    name: "Abdulrasaq",
  },
  {
    contactType: "person",
    firstName: "Abdulsalam",
    id: "23181",
    imageAvailable: false,
    lookupKey: "3789r21671-2A2C3052404E2A402A42.1724i36227f9109c197f7",
    name: "Abdulsalam",
  },
];

export default function InviteModalScreen() {
  const [contact, setContact] = useState();
  const [validInvite, setInvite] = useState(false);
  const friendList = useSelector((state) => state.friend.allFriends);
  const contactList = useSelector((state) => state.friend.allContacts);
  const tempList = contactList.filter((item) => {
    const isFriend = friendList.find((friend) => friend.id === item.id);
    if (isFriend === undefined) {
      const activeContact = testActiveContacts.find(
        (contact) => contact.id === item.id
      );
      if (activeContact !== undefined) {
        Object.assign(item, { active: true });
      }
      return item;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const invite = (item) => {
    let redirectUrl = Linking.createURL("login", {
      queryParams: { invite: "dlrow" },
    });
    const message = `Hello ${item.name}, i am inviting you to join Share Interest, use this link \n${redirectUrl} \n\n https://shareinterest.app`;
    onShare(message);
  };

  const add = useCallback(
    async (item) => {
      setError("");
      setIsRefreshing(true);
      try {
        await dispatch(friends.tagFriend(item));
      } catch (err) {
        setError(err.message);
      }
      setIsRefreshing(false);
    },
    [dispatch, setIsLoading, setError]
  );

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
          loadContact(data);
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
