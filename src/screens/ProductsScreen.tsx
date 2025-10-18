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
import { useProductsWithRedux, useDeleteProductWithRedux } from '../hooks/useProductsWithRedux';
import { Product } from '../services/productsApi';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../hooks/useTheme';
import { getUserFriendlyError } from '../utils/errorMessages';

const ProductsScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 20;
  const navigation = useNavigation();

  // Get user role from Redux store
  const userRole = useSelector((state: RootState) => state.auth.user?.role);
  const isSuperAdmin = userRole === 'admin';
  const { colors } = useAppTheme();

  const { products, isLoading, error, refetch, isFetching, setSearchQuery: setReduxSearchQuery } = useProductsWithRedux(limit, 0);
  const deleteProductMutation = useDeleteProductWithRedux();

  // Check network status
  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  // Sync local search query with Redux
  React.useEffect(() => {
    setReduxSearchQuery(searchQuery);
  }, [searchQuery, setReduxSearchQuery]);

  // Memoize filtered products to prevent unnecessary re-renders
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;

    return products.filter(
      product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [products, searchQuery]);

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
      <View style={[styles.productCard, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        <View style={styles.productInfo}>
          <Text style={[styles.productTitle, { color: colors.onSurface }]} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={[styles.productPrice, { color: colors.primary }]}>${item.price}</Text>
          <Text style={[styles.productCategory, { color: colors.onSurfaceVariant }]}>{item.category}</Text>
          {isSuperAdmin && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteProduct(item)}
            >
              <Icon name="trash-outline" size={20} color={colors.error} />
              <Text style={[styles.deleteButtonText, { color: colors.error }]}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    ),
    [isSuperAdmin, handleDeleteProduct, colors],
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
          You're currently offline. Some features may not be available.
        </Text>
      </View>
    );
  }, [isOffline]);

  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyState}>
        <Icon name="cube-outline" size={64} color={colors.onSurfaceVariant} />
        <Text style={[styles.emptyStateText, { color: colors.onSurfaceVariant }]}>
          {searchQuery ? 'No products found' : 'No products available'}
        </Text>
        <Text style={[styles.emptyStateSubtext, { color: colors.onSurfaceVariant }]}>
          {searchQuery ? 'Try adjusting your search terms' : 'Pull down to refresh and load products'}
        </Text>
      </View>
    ),
    [searchQuery, colors],
  );

  const renderFooter = useCallback(() => {
    if (!isFetching) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[styles.footerText, { color: colors.onSurfaceVariant }]}>Loading more products...</Text>
      </View>
    );
  }, [isFetching, colors]);

  if (isLoading && products.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.onSurfaceVariant }]}>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Icon name="alert-circle-outline" size={64} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.error }]}>
          {getUserFriendlyError(error, 'products')}
        </Text>
        <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={() => refetch()}>
          <Text style={[styles.retryButtonText, { color: colors.onPrimary }]}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderOfflineBanner()}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.outline }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.headerTitle, { color: colors.onSurface }]}>All Products</Text>
          <TouchableOpacity
            style={styles.categoriesButton}
            onPress={() => navigation.navigate('CategorySelection' as never)}
          >
            <Icon name="grid-outline" size={20} color={colors.primary} />
            <Text style={[styles.categoriesButtonText, { color: colors.primary }]}>Categories</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.searchContainer, { backgroundColor: colors.surfaceVariant }]}>
          <Icon
            name="search"
            size={20}
            color={colors.onSurfaceVariant}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: colors.onSurface }]}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.onSurfaceVariant}
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
