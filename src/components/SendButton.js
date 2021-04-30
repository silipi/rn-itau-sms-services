import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function SendButton({handlePress, text}) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => handlePress()}>
      <Text style={styles.cardText}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    height: '100%',
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    
    borderRadius: 7,
    
    shadowColor: "rgba(0, 0, 0, 0.6)",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
    
  },
  cardText: {
    textAlignVertical: 'center',
    textAlign: 'center'
  },
})
