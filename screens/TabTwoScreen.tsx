import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

export default function TabTwoScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <ScrollView>
          <View style={styles.interestContainer} />
          <View style={styles.interestContainer} />
          <View style={styles.interestContainer} />
          <View style={styles.interestContainer} />
          <View style={styles.interestContainer} />
          <View style={styles.interestContainer} />
          <View style={styles.interestContainer} />
        </ScrollView>
      </View>
      <TouchableOpacity style={styles.newFriendContainer} onPress={() => navigation.navigate('CategoryModal')}>
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
