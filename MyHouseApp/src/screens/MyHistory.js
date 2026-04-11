import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import categoryContentStyles from '../styles/categoryContentStyles';

export default function MyHistory() {
  return (
    <View style={categoryContentStyles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>My History</Text>
        <Text style={styles.placeholder}>Your transaction and activity history will appear here.</Text>
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4A90E2',
  },
  placeholder: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
