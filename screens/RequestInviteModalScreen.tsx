import React, { useEffect, useState, useCallback } from "react";
import {
  Platform,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity
} from "react-native";
import * as Linking from 'expo-linking';
import * as Contacts from "expo-contacts";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesome } from '@expo/vector-icons';

import { StatusBar } from "expo-status-bar";
import { Text, View } from "../components/Themed";
import onShare from "../components/Share";

import * as friends from "../store/actions/friends";
import { useNavigation } from '@react-navigation/native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

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

export default function RequestInviteModalScreen() {
  const [contact, setContact] = useState([]);
  const [text, setText] = useState('');

  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const processContacts = async (data) => {
    const contact_list = []
    
    data.forEach(contact => {
      if(contact.phoneNumbers){
        let phone_id = contact.phoneNumbers[0].number;
        phone_id = phone_id.replace(/\s/g, '');
        contact_list.push(phone_id)
      }
    });

    return contact_list;
  }

  const requestInvite = useCallback(async (data) => {
    setError('');
    setIsLoading(true);
    try {
        const contact_list = await processContacts(data)
        const message = await dispatch(friends.request_invite(contact_list));
        setContact(message)
        
    } catch (err) {
        setError(err.message);
    }
    setIsLoading(false);
}, [dispatch, setIsLoading, setError])

  const friendList = useSelector((state) => state.friend.allFriends);
  const contactList = useSelector((state) => state.friend.allContacts);

  const tempList = contactList.filter((item) => {
    let isActive = false
    contact.find((friend) => {
      if(item.phoneNumbers){
        const phone = item.phoneNumbers[0].number
        const phoneRegex = phone.replace(/\s/g, '')
        if( phoneRegex === friend.phone_id || phoneRegex === friend.phone){
          isActive = true
        }
      }
    })
    if(isActive){
      return item
    }
  })
  const searchList = tempList.filter((friend) => friend.name.toUpperCase().indexOf(text.toUpperCase()) > -1)
  

  const invite = (item) => {
    let redirectUrl = Linking.createURL("invite", {
      queryParams: { invite: "dlrow" },
    });
    const message = `Hello ${item.name}, can you send me an invite to join Share Interest please? \n\n https://shareinterest.app`;
    onShare(message);
  };

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

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          const valid_contacts = data.filter(item => item.name !== undefined)
          loadContact(valid_contacts)
          requestInvite(valid_contacts);
        }
      }
    })();
  }, []);

  return (
    <>
    {isLoading ? (
      <View style={styles.container} >
        <ActivityIndicator color="#fff" size='large' />
      </View>
    ) : (

    <View style={styles.container}>
      <View
        style={styles.separator}
        lightColor='#eee'
        darkColor='rgba(255,255,255,0.1)'
      /> 
      <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
              <FontAwesome
                  name="arrow-left"
                  size={20}
                  color={Colors[colorScheme].text}
              />
          </TouchableOpacity>
          <View style={styles.search}>
              <TextInput
                  style={styles.textInputContainer}
                  placeholder="Search Contact"
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
      <View style={styles.contactView}>
        <FlatList
          data={searchList}
          contentContainerStyle={{ paddingBottom: 150 }}
          renderItem={({ item }) => (
            <View
              style={styles.contact}
              lightColor='#eee'
              darkColor='rgba(255,255,255,0.1)'
            >
              <View style={styles.contactImage}>
                <Text style={styles.contactText}>{item.name.substring(0, 1)}</Text>
              </View>
              <Text style={styles.item}>{`${item.name}`}</Text>
                <TouchableOpacity
                  onPress={() => invite(item)}
                  style={styles.tagView}
                >
                  <Text style={styles.buttonText}>Request Invite</Text>
                </TouchableOpacity>
            </View>
          )}
        />
      </View>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
    )}
  </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    justifyContent: "center",
    alignItems: 'center'
  },
  contactText: {
    fontWeight: 'bold',
    fontSize: 20
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonText: {
    fontWeight: "bold",
    textAlign: 'center'
  },
  separator: {
    marginVertical: 60,
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
  searchContainer: { 
    flexDirection: 'row',
    paddingHorizontal: 10,
    width: '100%',
    paddingVertical: 5,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  search: {
      width: '100%',
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
      backgroundColor: 'transparent'
  },
  searchText: {
      fontSize: 20,
      fontWeight: 'bold',
  },
  textInputContainer: {
      flex: 1,
      color: '#fff',
      fontSize: 18,
      fontWeight: "bold"
  },
  icon: {
      width: 30,
      height: 30,
      backgroundColor: '#fff'
  },
  backIcon: {
    width: 40,
    height: 30,
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginVertical: 10,
    backgroundColor: 'transparent',
},
});
