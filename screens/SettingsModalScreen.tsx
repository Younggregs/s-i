import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Linking, Touchable, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

export default function SettingsModalScreen() {
  const colorScheme = useColorScheme();
  const terms = 'https://shareinterest.app/terms-conditions'
  const privacy = 'https://shareinterest.app/privacy'

  const navigation = useNavigation();

  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={() => navigation.navigate('About')} style={styles.view}>  
        <View style={styles.iconView}>
          <FontAwesome
                name="info"
                size={20}
                color={Colors[colorScheme].text}
            />
        </View>
        <Text style={styles.title}>About app</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Message')} style={styles.view}>  
        <View style={styles.iconView}>
          <FontAwesome
                name="envelope"
                size={20}
                color={Colors[colorScheme].text}
            />
        </View>
        <Text style={styles.title}>Message us</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.view} onPress={() => Linking.openURL(terms)}>  
        <View style={styles.iconView}>
          <FontAwesome
            name="file"
            size={20}
            color={Colors[colorScheme].text}
          />
        </View>
        <Text style={styles.title}>Terms and Conditions</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.view} onPress={() => Linking.openURL(privacy)}>  
        <View style={styles.iconView}>
          <FontAwesome
            name="key"
            size={20}
            color={Colors[colorScheme].text}
          />
        </View>
        <Text style={styles.title}>Privacy Policy</Text>
      </TouchableOpacity>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginVertical: 10,
    marginHorizontal: 20,
    flex: 8
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  view: {
    flexDirection: "row"
  },
  iconView: {
    flex: 2,
    alignItems: "center",
    justifyContent: 'center'
  }
});
