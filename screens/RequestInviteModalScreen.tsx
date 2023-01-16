import React, { useEffect, useState } from "react";
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
import { FontAwesome } from '@expo/vector-icons';
import parsePhoneNumber from 'libphonenumber-js'
import { useQuery, useQueryClient } from 'react-query'

import { StatusBar } from "expo-status-bar";
import { Text, View } from "../components/Themed";

import * as friends from "../store/actions/friends";
import { useNavigation } from '@react-navigation/native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

export default function RequestInviteModalScreen() {
  const queryClient = useQueryClient()
  const [phonebook, setPhonebook] = useState(false)
  const [contactList, setContactList] = useState([])
  const { data, isLoading } = useQuery(
    ['registered_contacts', phonebook], 
    () => friends.request_invite_query(phonebook), 
    {
        enabled: !!phonebook,
        initialData: () => {
          return queryClient.getQueryData('registered_contacts') || []
        }
    })

  const [text, setText] = useState('');

  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const processContacts = async (data) => {
    const contact_list = []

    // We'll need to generate atleast two different phone number format for each phone returned
    // eg 8109599597 and 08109599597 or if it starts with + 
    // eg +2348109599597 and +2348109599597.
    data.forEach(contact => {
      if(contact.phoneNumbers){
        let phone_id = contact.phoneNumbers[0].number;
        phone_id = phone_id.replace(/\s/g, '');

        if(phone_id.charAt(0) === '0'){
          contact_list.push(phone_id.slice(1))
          contact_list.push(phone_id)
        }else if(phone_id.charAt(0) === '+') {
          // This small process here is crazy lol
          const phoneNumber = parsePhoneNumber(phone_id)
          const callingCode = phoneNumber ? phoneNumber.countryCallingCode : '+234'
          let phone = phoneNumber ? phoneNumber.formatNational() : '';
          phone = phone.replace(/\s/g, '');
          const phone1_id = '+' + callingCode + phone
          const phone2_id = '+' + callingCode + phone.slice(1)

          contact_list.push(phone1_id)
          contact_list.push(phone2_id)
        }else{
          contact_list.push('0' + phone_id)
          contact_list.push(phone_id)
        }
      }
    });

    setPhonebook(contact_list)
    return contact_list;
  }

  const tempList = contactList.filter((item) => {
    let isActive = false
    data.find((friend) => {
      if(item.phoneNumbers){
        const phone = item.phoneNumbers[0].number
        const phoneRegex = phone.replace(/\s/g, '')
        if( phoneRegex === friend.phone_id || phoneRegex === friend.phone1_id || phoneRegex === friend.phone || phoneRegex === friend.phone1){
          isActive = true
          Object.assign(item, { active: true, phone_id: friend.phone_id, phone1_id: friend.phone1_id, phone: friend.phone, phone1: friend.phone1});
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
    const message = `Hello ${item.name}, can you send me an invite to join Share Interest please? \n\n https://shareinterest.page.link/invite`;
    // onShare(message);

    let url =
        "whatsapp://send?text=" +
        message +
        "&phone=" +
        item.phone_id;
      Linking.openURL(url)
        .then(data => {
          // console.log("WhatsApp Opened successfully " + data);
        })
        .catch(() => {
          alert("Make sure WhatsApp is installed on your device");
        });  

  };

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          const valid_contacts = data.filter(item => item.name !== undefined)
          processContacts(valid_contacts)
          setContactList(valid_contacts)
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
