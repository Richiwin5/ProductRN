import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useProducts, MAX_PRODUCTS } from '../context/ProductsContext';

const AddProductForm = () => {
  const { addProduct, isFull } = useProducts();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [photo, setPhoto] = useState<string>('');

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.7,
      includeBase64: false,
    });
    if (result.didCancel) return;
    const uri = result.assets?.[0]?.uri;
    if (uri) setPhoto(uri);
  };

  const reset = () => {
    setName('');
    setPrice('');
    setPhoto('');
  };

  const submit = () => {
    if (isFull) {
      Alert.alert('Limit reached', `You can only upload ${MAX_PRODUCTS} products.`);
      return;
    }
    const priceNum = parseFloat(price);
    if (!name.trim() || !photo || isNaN(priceNum) || priceNum < 0) {
      Alert.alert('Invalid input', 'Please complete all fields with valid values.');
      return;
    }
    const ok = addProduct({ name: name.trim(), price: priceNum, photo });
    if (ok) reset();
  };

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Product name</Text>
      <TextInput
        style={[styles.input, isFull && styles.disabled]}
        value={name}
        onChangeText={setName}
        placeholder="e.g. Wireless headphones"
        editable={!isFull}
      />

      <Text style={styles.label}>Price (USD)</Text>
      <TextInput
        style={[styles.input, isFull && styles.disabled]}
        value={price}
        onChangeText={setPrice}
        placeholder="0.00"
        keyboardType="decimal-pad"
        editable={!isFull}
      />

      <Text style={styles.label}>Photo</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.thumb}
          onPress={pickImage}
          disabled={isFull}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.thumbImg} />
          ) : (
            <Text style={styles.thumbPlaceholder}>+</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pickBtn, isFull && styles.disabled]}
          onPress={pickImage}
          disabled={isFull}>
          <Text style={styles.pickBtnText}>
            {photo ? 'Change photo' : 'Choose photo'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.submit, isFull && styles.submitDisabled]}
        onPress={submit}
        disabled={isFull}>
        <Text style={styles.submitText}>
          {isFull ? 'Limit reached' : 'Add product'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  label: { fontSize: 13, fontWeight: '600', marginTop: 10, marginBottom: 6, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111',
  },
  disabled: { opacity: 0.5 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    backgroundColor: '#f5f5f7',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbImg: { width: '100%', height: '100%' },
  thumbPlaceholder: { fontSize: 28, color: '#999' },
  pickBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  pickBtnText: { color: '#0f172a', fontWeight: '600' },
  submit: {
    marginTop: 16,
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitDisabled: { backgroundColor: '#a5b4fc' },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

export default AddProductForm;
