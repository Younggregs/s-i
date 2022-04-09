import { ScrollView, StyleSheet, Touchable, TouchableOpacity } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import InterestCategorySwitch from '../components/InterestCategorySwitch';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <ScrollView>
          <TouchableOpacity style={styles.interestContainer} onPress={() => navigation.navigate('CategoryModal')} />
          <View style={styles.interestContainer} />
          <View style={styles.interestContainer} />
          <View style={styles.interestContainer} />
          <View style={styles.interestContainer} />
          <View style={styles.interestContainer} />
          <View style={styles.interestContainer} />
          <View style={styles.interestContainer} />
        </ScrollView>
      </View>
      <InterestCategorySwitch path="/screens/TabOneScreen.tsx" />
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
    borderColor: '#fff',
    borderWidth: 2,
    borderStyle: 'solid',
    height: 100,
    width: '100%',
    marginTop: 10
  }
});
