import React, {useRef} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, ScrollView, StyleSheet, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

import InterestCategorySwitch from '../components/InterestCategorySwitch';
import InterestComponent from "../components/InterestComponent";
import AnimatedHeader from '../components/AnimatedHeader';
import * as interests from '../store/actions/interests';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';

export default function ProfileModalScreen() {
  const offset = useRef(new Animated.Value(0)).current;

  const categories = useSelector(state => state.interest.allCategories);
  const activeCategory = categories.find(category => category.active === true);

  const interestsList = useSelector(state => state.interest.allInterests);
  let interestsBucket = []
  interestsBucket = interestsList.filter(interest => interest.category.id === activeCategory.id)

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} forceInset={{ top: 'always' }}>
        <AnimatedHeader animatedValue={offset} />
        <ScrollView
          style={styles.contentContainer}
          contentContainerStyle={{
            alignItems: 'center',
            paddingTop: 220
          }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: offset } } }],
            { useNativeDriver: false }
          )}
        >
          {interestsBucket.map(item => 
            <InterestComponent key={item.id} item={item} />
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
