// User-friendly error messages utility
export const ErrorMessages = {
  // Authentication errors
  AUTH: {
    INVALID_CREDENTIALS: 'The username or password you entered is incorrect. Please try again.',
    NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.',
    BIOMETRIC_FAILED: 'Biometric authentication failed. Please try again or use your password.',
    BIOMETRIC_UNAVAILABLE: 'Biometric authentication is not available on this device.',
    LOGIN_REQUIRED: 'Please log in to continue.',
  },

  // Product errors
  PRODUCTS: {
    LOAD_FAILED: 'Unable to load products. Please check your connection and try again.',
    SEARCH_FAILED: 'Search is temporarily unavailable. Please try again later.',
    DELETE_FAILED: 'Unable to delete the product. Please try again.',
    DELETE_SUCCESS: 'Product has been removed successfully.',
    NOT_FOUND: 'No products found matching your search.',
    NETWORK_ERROR: 'Unable to load products. Please check your internet connection.',
  },

  // Category errors
  CATEGORIES: {
    LOAD_FAILED: 'Unable to load categories. Please check your connection and try again.',
    NOT_FOUND: 'No categories found.',
    SEARCH_FAILED: 'Category search is temporarily unavailable.',
    NETWORK_ERROR: 'Unable to load categories. Please check your internet connection.',
  },

  // General errors
  GENERAL: {
    NETWORK_ERROR: 'Please check your internet connection and try again.',
    SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
    OFFLINE: 'You\'re currently offline. Some features may not be available.',
    TIMEOUT: 'The request is taking longer than expected. Please try again.',
    PERMISSION_DENIED: 'You don\'t have permission to perform this action.',
  },

  // Validation errors
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long.',
    USERNAME_TOO_SHORT: 'Username must be at least 3 characters long.',
    INVALID_FORMAT: 'Please check the format and try again.',
  },

  // Success messages
  SUCCESS: {
    LOGIN_SUCCESS: 'Welcome back!',
    LOGOUT_SUCCESS: 'You have been logged out successfully.',
    PRODUCT_DELETED: 'Product has been removed successfully.',
    DATA_REFRESHED: 'Data has been updated.',
    SETTINGS_SAVED: 'Settings have been saved successfully.',
  },
};

// Helper function to get user-friendly error message
export const getUserFriendlyError = (error: any, context?: string): string => {
  // Handle network errors
  if (!error) {
    return ErrorMessages.GENERAL.UNKNOWN_ERROR;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Handle error objects
  if (error.message) {
    const message = error.message.toLowerCase();
    
    // Network-related errors
    if (message.includes('network') || message.includes('fetch')) {
      return ErrorMessages.GENERAL.NETWORK_ERROR;
    }
    
    if (message.includes('timeout')) {
      return ErrorMessages.GENERAL.TIMEOUT;
    }
    
    if (message.includes('unauthorized') || message.includes('401')) {
      return ErrorMessages.AUTH.SESSION_EXPIRED;
    }
    
    if (message.includes('forbidden') || message.includes('403')) {
      return ErrorMessages.GENERAL.PERMISSION_DENIED;
    }
    
    if (message.includes('server') || message.includes('500')) {
      return ErrorMessages.GENERAL.SERVER_ERROR;
    }
    
    if (message.includes('invalid credentials')) {
      return ErrorMessages.AUTH.INVALID_CREDENTIALS;
    }
    
    // Return the original message if it's already user-friendly
    if (message.length < 100 && !message.includes('error') && !message.includes('exception')) {
      return error.message;
    }
  }

  // Handle HTTP status codes
  if (error.response?.status) {
    switch (error.response.status) {
      case 400:
        return ErrorMessages.GENERAL.UNKNOWN_ERROR;
      case 401:
        return ErrorMessages.AUTH.SESSION_EXPIRED;
      case 403:
        return ErrorMessages.GENERAL.PERMISSION_DENIED;
      case 404:
        return context === 'products' 
          ? ErrorMessages.PRODUCTS.NOT_FOUND 
          : ErrorMessages.GENERAL.UNKNOWN_ERROR;
      case 408:
        return ErrorMessages.GENERAL.TIMEOUT;
      case 500:
        return ErrorMessages.GENERAL.SERVER_ERROR;
      case 502:
      case 503:
      case 504:
        return ErrorMessages.GENERAL.SERVER_ERROR;
      default:
        return ErrorMessages.GENERAL.UNKNOWN_ERROR;
    }
  }

  // Context-specific fallbacks
  if (context) {
    switch (context) {
      case 'auth':
        return ErrorMessages.AUTH.NETWORK_ERROR;
      case 'products':
        return ErrorMessages.PRODUCTS.NETWORK_ERROR;
      case 'categories':
        return ErrorMessages.CATEGORIES.NETWORK_ERROR;
      default:
        return ErrorMessages.GENERAL.NETWORK_ERROR;
    }
  }

  return ErrorMessages.GENERAL.UNKNOWN_ERROR;
};

// Helper function to show success messages
export const getSuccessMessage = (action: string): string => {
  switch (action) {
    case 'login':
      return ErrorMessages.SUCCESS.LOGIN_SUCCESS;
    case 'logout':
      return ErrorMessages.SUCCESS.LOGOUT_SUCCESS;
    case 'delete_product':
      return ErrorMessages.SUCCESS.PRODUCT_DELETED;
    case 'refresh':
      return ErrorMessages.SUCCESS.DATA_REFRESHED;
    case 'save_settings':
      return ErrorMessages.SUCCESS.SETTINGS_SAVED;
    default:
      return 'Operation completed successfully.';
  }
};
