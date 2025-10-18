import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useProducts, useDeleteProduct } from '../hooks/useProducts';
import { Product } from '../services/productsApi';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useNavigation } from '@react-navigation/native';

const ProductsScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 20;
  const navigation = useNavigation();

  // Get user role from Redux store
  const userRole = useSelector((state: RootState) => state.auth.user?.role);
  const isSuperAdmin = userRole === 'admin';

  const { data, isLoading, error, refetch, isFetching } = useProducts(limit, 0);
  const deleteProductMutation = useDeleteProduct();

  // Check network status
  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  // Memoize filtered products to prevent unnecessary re-renders
  const filteredProducts = useMemo(() => {
    const products = data?.products || [];
    if (!searchQuery.trim()) return products;

    return products.filter(
      product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [data?.products, searchQuery]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handleDeleteProduct = useCallback(
    (product: Product) => {
      if (!isSuperAdmin) return;

      Alert.alert(
        'Delete Product',
        `Are you sure you want to delete "${product.title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              deleteProductMutation.mutate(product.id);
            },
          },
        ],
      );
    },
    [isSuperAdmin, deleteProductMutation],
  );

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => (
      <View style={styles.productCard}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.productPrice}>${item.price}</Text>
          <Text style={styles.productCategory}>{item.category}</Text>
          {isSuperAdmin && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteProduct(item)}
            >
              <Icon name="trash-outline" size={20} color="#ff4444" />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    ),
    [isSuperAdmin, handleDeleteProduct],
  );

  //   const renderHeader = useCallback(() => (
  //     <View style={styles.header}>
  //       <Text style={styles.headerTitle}>All Products</Text>
  //     </View>
  //   ), []);

  const renderOfflineBanner = useCallback(() => {
    if (!isOffline) return null;

    return (
      <View style={styles.offlineBanner}>
        <Icon name="wifi-off" size={16} color="#fff" />
        <Text style={styles.offlineText}>
          You're offline. Data may be outdated.
        </Text>
      </View>
    );
  }, [isOffline]);

  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyState}>
        <Icon name="cube-outline" size={64} color="#ccc" />
        <Text style={styles.emptyStateText}>No products found</Text>
        <Text style={styles.emptyStateSubtext}>
          {searchQuery ? 'Try adjusting your search' : 'Pull down to refresh'}
        </Text>
      </View>
    ),
    [searchQuery],
  );

  const renderFooter = useCallback(() => {
    if (!isFetching) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#6200EE" />
        <Text style={styles.footerText}>Loading more products...</Text>
      </View>
    );
  }, [isFetching]);

  if (isLoading && !data) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={64} color="#ff4444" />
        <Text style={styles.errorText}>Failed to load products</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderOfflineBanner()}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>All Products</Text>
          <TouchableOpacity
            style={styles.categoriesButton}
            onPress={() => navigation.navigate('CategorySelection' as never)}
          >
            <Icon name="grid-outline" size={20} color="#6200EE" />
            <Text style={styles.categoriesButtonText}>Categories</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
          />
        </View>
      </View>
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#6200EE']}
            tintColor="#6200EE"
          />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  offlineBanner: {
    backgroundColor: '#ff6b6b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  offlineText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  categoriesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  categoriesButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#6200EE',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  listContainer: {
    padding: 16,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 4,
  },
  deleteButtonText: {
    color: '#ff4444',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ff4444',
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  footerText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
});

export default ProductsScreen;
