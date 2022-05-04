import { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';

export default function ContactScreen({ navigation }: RootStackScreenProps<'NotFound'>) {
    const [message, setMessage] = useState('')
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Send us a message</Text>
            <TextInput
                style={styles.input}
                placeholderTextColor='white'
                multiline
                onChangeText={(value) => setMessage(value)}
                placeholder="Message"
                value={message}
        />
        <TouchableOpacity style={styles.button}>
            <Text style={styles.textStyle}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.replace('Root')} style={styles.link}>
            <Text style={styles.linkText}>shareinterest.app</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: "#2196F3",
    borderWidth: 2,
    borderStyle: 'solid',
    height: 40,
    width: '100%',
    marginTop: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontWeight: "bold",
    textAlign: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  input: {
    height: 150,
    width: '100%',
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: '#373737',
    color: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 5
  },
});
