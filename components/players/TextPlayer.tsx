import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';

import { Text, View } from '../Themed';

export default function TextPlayer({link_text}) {
    
    return (
        <View style={styles.itemView}>
           <Text style={styles.categoryText}>{link_text && link_text}</Text>
        </View>
  );
}

const styles = StyleSheet.create({
    categoryText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        margin:5
    },
    itemView: {
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5
    },
});
