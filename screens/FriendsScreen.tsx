import React from "react";
import { FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery, useQueryClient } from 'react-query'

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import * as friends from '../store/actions/friends';

export default function FriendsScreen({ navigation }: RootTabScreenProps<'Friends'>) {
  const queryClient = useQueryClient()
  const {data, isLoading} = useQuery('friendsList', friends.fetch_friends_query,{
    initialData: () => {
      return queryClient.getQueryData('friendsList') || []
    }
  })

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color="#fff" size='large'/>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ paddingBottom: 20 }}
          data={data}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => navigation.navigate('ProfileModal', {item})}
              key={item.id} 
              style={styles.interestContainer} 
              lightColor="#eee" 
              darkColor="rgba(255,255,255,0.1)">
              <View style={styles.contactImage}>
                <Text style={styles.contactText}>{item.name.substring(0, 1)}</Text>
              </View>
              <Text style={styles.item}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      </View>
      <TouchableOpacity style={styles.newFriendContainer} onPress={() => navigation.navigate('ContactModal')}>
        <Text style={styles.newFriendText}>Tag Friend</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
      flex: 1 // pushes the footer to the end of the screen
  },
  item: {
    height: 50,
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 15
  },
  loading: {
    margin: 100
  },
  contactImage: {
    height: 40,
    width: 40,
    borderRadius: 25,
    borderColor: '#ffffff',
    borderWidth: 1,
    borderStyle: 'solid',
    justifyContent: "center",
    alignItems: 'center'
  },
  contactText: {
    fontWeight: 'bold',
    fontSize: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  interestContainer: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1
  },
  newFriendContainer: {
    borderTopColor: '#fff',
    borderWidth: 2,
    borderStyle: 'solid',
    paddingVertical: 15,
    width: '100%',
    marginTop: 10
  },
  newFriendText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  }
});
