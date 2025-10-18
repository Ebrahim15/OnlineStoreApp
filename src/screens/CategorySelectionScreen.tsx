import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useCategoriesWithRedux } from '../hooks/useProductsWithRedux';
import Icon from 'react-native-vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';

interface CategorySelectionScreenProps {
  navigation: any;
}

const CategorySelectionScreen: React.FC<CategorySelectionScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOffline, setIsOffline] = useState(false);

  const { categories, isLoading, error, refetch } = useCategoriesWithRedux();

  // Check network status
  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const filteredCategories = React.useMemo(() => {
    if (!categories) return [];
    console.log('Categories data:', categories);
    console.log('Categories type:', typeof categories);
    console.log('Is array:', Array.isArray(categories));
    console.log('Search query:', searchQuery);
    console.log('Search query length:', searchQuery.length);
    
    // Ensure we have an array
    const categoriesArray = Array.isArray(categories) ? categories : [];
    console.log('Categories array:', categoriesArray);
    console.log('Categories array length:', categoriesArray.length);
    
    // Convert objects to strings for display and filtering
    const categoryNames = categoriesArray.map((category: any) => {
      if (typeof category === 'string') {
        return category;
      }
      // Handle object structure - try common property names
      const name = category?.name || category?.title || category?.slug || category?.category || String(category);
      console.log('Converted category object to name:', category, '->', name);
      return name;
    });
    
    console.log('Category names:', categoryNames);
    
    if (!searchQuery.trim()) {
      console.log('No search query, returning all category names');
      return categoryNames;
    }

    const filtered = categoryNames.filter(categoryName => {
      const matches = categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      console.log(`Category: "${categoryName}", Query: "${searchQuery}", Matches: ${matches}`);
      return matches;
    });
    
    console.log('Filtered categories:', filtered);
    return filtered;
  }, [categories, searchQuery]);

  const handleCategorySelect = useCallback((category: string) => {
    navigation.navigate('Category', { category });
  }, [navigation]);

  const renderCategory = useCallback(({ item }: { item: string }) => {
    if (!item || typeof item !== 'string') {
      return null;
    }
    
    return (
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() => handleCategorySelect(item)}
      >
        <View style={styles.categoryContent}>
          <Icon name="folder-outline" size={24} color="#6200EE" />
          <Text style={styles.categoryName}>{item.charAt(0).toUpperCase() + item.slice(1)}</Text>
          <Icon name="chevron-forward" size={20} color="#666" />
        </View>
      </TouchableOpacity>
    );
  }, [handleCategorySelect]);

  const renderOfflineBanner = () => {
    if (!isOffline) return null;

    return (
      <View style={styles.offlineBanner}>
        <Icon name="wifi-off" size={16} color="#fff" />
        <Text style={styles.offlineText}>
          You're offline. Data may be outdated.
        </Text>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="folder-open-outline" size={64} color="#ccc" />
      <Text style={styles.emptyStateText}>No categories found</Text>
      <Text style={styles.emptyStateSubtext}>
        {searchQuery ? 'Try adjusting your search' : 'Pull down to refresh'}
      </Text>
    </View>
  );

  console.log('Component state - isLoading:', isLoading, 'error:', error, 'categories:', categories);

  if (isLoading) {
    console.log('Showing loading state');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  if (error) {
    console.log('Showing error state:', error);
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={64} color="#ff4444" />
        <Text style={styles.errorText}>Failed to load categories</Text>
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
        <Text style={styles.headerTitle}>Categories</Text>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search categories..."
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
        data={filteredCategories}
        renderItem={renderCategory}
        keyExtractor={(item, index) => {
          console.log('KeyExtractor item:', item, 'type:', typeof item);
          return item || `category-${index}`;
        }}
        ListEmptyComponent={renderEmptyState}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
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
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
    textTransform: 'capitalize',
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
});

export default CategorySelectionScreen;
