import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { useDispatch  } from "react-redux";
import * as Linking from "expo-linking";
import { Text, View } from "../components/Themed";
import onShare from "../components/Share";

import * as friends from "../store/actions/friends";
import Toast from 'react-native-root-toast';

export default function ContactItem({ item }) {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const create_invite = useCallback(async (item) => {
    setError('');
    setIsLoading(true)
    const phone_id = item.phoneNumbers[0].number
    try {
        const message = await dispatch(friends.create_invite(phone_id.replace(/\s/g, ''), item.name));
        if (message.token){
          invite(message.token, item.name)
        }
    } catch (err) {
        setError(err.message);
    }
    setIsLoading(false)
  }, [dispatch, setIsLoading, setError])

  const invite = (invite, name) => {
    let redirectUrl = Linking.createURL("invite", {
      queryParams: { invite: invite },
    });
    const message = `Hello ${name}, i am inviting you to join Share Interest, use this link \n${redirectUrl} \n\n https://shareinterest.app`;
    onShare(message);
  };

  const add = useCallback(
    async (item) => {
      setError("");
      setIsLoading(true)
      try {
        const phone_id = item.phoneNumbers[0].number
        const obj = {
          'phone_id': phone_id.replace(/\s/g, ''),
          'name': item.name
        }
        const res = await dispatch(friends.tagFriend(obj));
        if(res.error_message){
          Toast.show(res.error_message, {
            duration: Toast.durations.LONG,
          });
        }
      } catch (err) {
        setError(err.message);
      }
      setIsLoading(false)
    },
    [dispatch, setIsLoading, setError]
  );

  return (
    <View
        style={styles.contact}
        lightColor='#eee'
        darkColor='rgba(255,255,255,0.1)'
    >
        <View style={styles.contactImage}>
            <Text style={styles.contactText}>{item.name.substring(0, 1)}</Text>
        </View>
            <Text style={styles.item}>{`${item.name}`}</Text>
        {item.active ? (
        <TouchableOpacity
            onPress={() => add(item)}
            style={styles.tagView}
        >{isLoading ? (
            <ActivityIndicator color="#fff"/>
        ): (
            <Text style={styles.buttonText}>Tag</Text>
        )}
            
        </TouchableOpacity>
        ) : (
        <TouchableOpacity
            onPress={() => create_invite(item)}
            style={styles.tagView}
        >{isLoading ? (
            <ActivityIndicator color="#fff"/>
        ): (
            <Text style={styles.buttonText}>Invite</Text>
        )}
        </TouchableOpacity>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  contact: {
    flexDirection: "row",
    alignItems: "center",
    flex: 2,
  },
  contactView: {
    height: '100%',
    width: '100%',
  },
  contactText: {
    fontWeight: 'bold',
    fontSize: 20
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonText: {
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 60,
    height: 1,
    width: "80%",
  },
  separatorb: {
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
