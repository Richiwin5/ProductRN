import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Product } from '../context/ProductsContext';

type Props = { product: Product; onRemove: (id: string) => void };

const ProductCard: React.FC<Props> = ({ product, onRemove }) => (
  <View style={styles.card}>
    <Image source={{ uri: product.photo }} style={styles.image} />
    <View style={styles.body}>
      <Text style={styles.name} numberOfLines={1}>
        {product.name}
      </Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      <TouchableOpacity style={styles.remove} onPress={() => onRemove(product.id)}>
        <Text style={styles.removeText}>Remove</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
    margin: 6,
  },
  image: { width: '100%', aspectRatio: 1, backgroundColor: '#f5f5f7' },
  body: { padding: 10 },
  name: { fontSize: 14, fontWeight: '600', color: '#111' },
  price: { fontSize: 13, color: '#6366f1', marginTop: 2, fontWeight: '600' },
  remove: {
    marginTop: 8,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
  },
  removeText: { color: '#b91c1c', fontWeight: '600', fontSize: 12 },
});

export default ProductCard;
