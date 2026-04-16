import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useProducts, MAX_PRODUCTS } from '../context/ProductsContext';
import AddProductForm from '../components/AddProductForm';
import ProductCard from '../components/ProductCard';

const ProductsScreen = () => {
  const { products, removeProduct, hydrated } = useProducts();

  if (!hydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  const progress = (products.length / MAX_PRODUCTS) * 100;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Products</Text>
        <Text style={styles.subtitle}>
          {products.length} of {MAX_PRODUCTS} uploaded
        </Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <AddProductForm />

      <View style={styles.listSection}>
        {products.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              No products yet. Add your first one above.
            </Text>
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <ProductCard product={item} onRemove={removeProduct} />
            )}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { padding: 16, paddingBottom: 40, marginTop: 40 },
  header: { marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: '#0f172a' },
  subtitle: { fontSize: 13, color: '#64748b', marginTop: 4 },
  progressTrack: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 20,
  },
  progressFill: { height: '100%', backgroundColor: '#6366f1' },
  listSection: { marginTop: 16 },
  empty: {
    padding: 32,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: { color: '#64748b', fontSize: 13 },
});

export default ProductsScreen;
