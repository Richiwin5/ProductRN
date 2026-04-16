/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { ProductsProvider } from './src/context/ProductsContext';
import ProductsScreen from './src/screens/ProductsScreen';

const App = () => (
  <ProductsProvider>
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ProductsScreen />
    </SafeAreaView>
  </ProductsProvider>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#ffffff' },
});

export default App;
