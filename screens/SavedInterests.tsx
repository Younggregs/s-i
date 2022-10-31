import React, {useRef, useState, useEffect} from 'react';
import { ScrollView, StyleSheet, Animated } from 'react-native';
import { useSelector } from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useQueryClient } from 'react-query'

import InterestCategorySwitch from '../components/InterestCategorySwitch';
import InterestComponent from "../components/InterestComponent";
import * as interests from '../store/actions/interests';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';

export default function SaveInterests(props: any) {
    const queryClient = useQueryClient()
    const {data, isLoading} = useQuery('savedInterestsList', interests.fetch_saved_interests_query,{
        initialData: () => {
        return queryClient.getQueryData('savedInterestsList') || []
        }
    }) 
    
    const offset = useRef(new Animated.Value(0)).current;
    const [user, setUser] = useState({});

    useEffect(() => {
        const getUser = async () => {
        let user = await AsyncStorage.getItem('user')
        user = JSON.parse(user)
        setUser(user)
        }
        getUser()
    }, [setUser])

    const categories = useSelector(state => state.interest.allCategories);
    const activeCategory = categories.find(category => category.active === true);

    let contactsInterests = []
    contactsInterests = data.filter(interest => interest.account.phone == user.phone_id)
    let interestsBucket = []
    interestsBucket = contactsInterests.filter(interest => interest.category.id === activeCategory.id)

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.contentContainer}
          contentContainerStyle={{
            alignItems: 'center'
          }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: offset } } }],
            { useNativeDriver: false }
          )}
        >
          {interestsBucket.map(item => 
            <InterestComponent key={item.id} item={item}/>
          )}
        </ScrollView>
        <InterestCategorySwitch path="/screens/FriendsScreen.tsx" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    flex: 1
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
});
