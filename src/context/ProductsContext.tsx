import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const MAX_PRODUCTS = 5;
const STORAGE_KEY = '@ProductsRN:products';

export type Product = {
  id: string;
  name: string;
  price: number;
  photo: string; // file:// uri or base64 data uri
};

type ProductsContextValue = {
  products: Product[];
  isFull: boolean;
  remaining: number;
  hydrated: boolean;
  addProduct: (input: Omit<Product, 'id'>) => boolean;
  removeProduct: (id: string) => void;
  clearAll: () => void;
};

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Product[];
          if (Array.isArray(parsed)) setProducts(parsed.slice(0, MAX_PRODUCTS));
        }
      } catch (e) {
        console.warn('Failed to load products from storage', e);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  // Persist on every change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products)).catch((e) =>
      console.warn('Failed to persist products', e),
    );
  }, [products, hydrated]);

  const addProduct = useCallback(
    (input: Omit<Product, 'id'>) => {
      let added = false;
      setProducts((prev) => {
        if (prev.length >= MAX_PRODUCTS) {
          Alert.alert(
            'Limit reached',
            `You can only upload up to ${MAX_PRODUCTS} products.`,
          );
          return prev;
        }
        added = true;
        const next = [
          ...prev,
          { ...input, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` },
        ];
        if (next.length === MAX_PRODUCTS) {
          // Notify on reaching the limit
          setTimeout(
            () =>
              Alert.alert(
                'Product limit reached',
                `You've added all ${MAX_PRODUCTS} products.`,
              ),
            0,
          );
        }
        return next;
      });
      return added;
    },
    [],
  );

  const removeProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearAll = useCallback(() => setProducts([]), []);

  const value = useMemo<ProductsContextValue>(
    () => ({
      products,
      isFull: products.length >= MAX_PRODUCTS,
      remaining: Math.max(0, MAX_PRODUCTS - products.length),
      hydrated,
      addProduct,
      removeProduct,
      clearAll,
    }),
    [products, hydrated, addProduct, removeProduct, clearAll],
  );

  return (
    <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
};
