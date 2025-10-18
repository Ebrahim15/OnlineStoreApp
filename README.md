# Online Store App

A modern React Native e-commerce application built with TypeScript, featuring product management, user authentication, and admin functionality. The app provides a seamless shopping experience with offline support, biometric authentication, and comprehensive testing.

## 🚀 Features

### Core Features
- **Product Catalog**: Browse and search through products with real-time filtering
- **Category Management**: Organize products by categories with dedicated category screens
- **User Authentication**: Secure login with JWT tokens and biometric authentication
- **Admin Panel**: Role-based access control with product management capabilities
- **Offline Support**: Cached data with offline indicators and sync capabilities
- **Dark Mode**: Complete theme support with system preference detection

### User Experience
- **Pull-to-Refresh**: Intuitive data refresh mechanism
- **Search Functionality**: Real-time product and category search
- **Responsive Design**: Optimized for various screen sizes
- **Loading States**: Comprehensive loading and error state management
- **Auto-lock Security**: Configurable inactivity timeout with biometric unlock

### Admin Features
- **Product Management**: Add, edit, and delete products (admin role required)
- **User Role Management**: Different permission levels for users and admins
- **Analytics Dashboard**: Product statistics and user activity (planned)

## 🛠️ Technology Stack

### Core Framework
- **React Native 0.82.0**: Cross-platform mobile development
- **TypeScript**: Type-safe development with enhanced IDE support
- **React 19.1.1**: Latest React features and performance improvements

### State Management
- **Redux Toolkit**: Predictable state management with simplified syntax
- **React Query**: Server state management with caching and synchronization
- **MMKV**: High-performance key-value storage for offline data

### Navigation & UI
- **React Navigation**: Declarative navigation with stack and tab navigators
- **React Native Paper**: Material Design 3 components with theming
- **React Native Vector Icons**: Comprehensive icon library

### Authentication & Security
- **JWT Tokens**: Secure authentication with automatic token refresh
- **React Native Biometrics**: Fingerprint and face ID authentication
- **Device Credentials**: PIN/Password fallback for biometric authentication

### Data & API
- **Axios**: HTTP client with request/response interceptors
- **DummyJSON**: Mock API for development and testing
- **Mock Service Worker**: API mocking for comprehensive testing

### Development Tools
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting and consistency
- **Jest**: Unit and integration testing framework
- **React Native Testing Library**: Component testing utilities

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (>= 20.x)
- **npm** or **yarn**
- **React Native CLI**
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)
- **Java Development Kit (JDK) 17**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd OnlineStoreApp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. iOS Setup (macOS only)

Install CocoaPods dependencies:

```bash
cd ios
pod install
cd ..
```

### 4. Start Metro Bundler

```bash
npm start
```

### 5. Run the Application

#### Android
```bash
npm run android
```

#### iOS
```bash
npm run ios
```

## 🧪 Testing

The project includes comprehensive testing with multiple test categories:

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci
```

### Test Coverage
- **Unit Tests**: Individual functions and hooks
- **Component Tests**: React components and screens
- **Integration Tests**: Redux store and API interactions
- **Mock Service Worker**: API mocking for consistent testing

## 🎨 Theming & Design

### Theme System
The app implements a comprehensive theming system with:

- **Material Design 3**: Modern design language implementation
- **Dark/Light Mode**: Automatic system preference detection
- **Custom Color Palette**: Brand-specific colors and semantic tokens
- **Responsive Typography**: Scalable text system
- **Component Theming**: Consistent styling across all components

### Color Scheme
- **Primary**: #6200EE (Purple)
- **Secondary**: Complementary accent colors
- **Surface**: Card and container backgrounds
- **Error**: Consistent error state colors
- **Status**: Success, warning, and info states

## 👥 User Roles & Permissions

### Regular Users
- Browse products and categories
- Search and filter products
- View product details
- Access offline cached data

### Admin Users
- All regular user permissions
- **Product Management**: Add, edit, delete products
- **User Management**: View and manage user accounts
- **Analytics Access**: View sales and user statistics
- **System Settings**: Configure app preferences

### Role Assignment
User roles are determined by the `role` field in the user profile:
- `user`: Standard user permissions
- `admin`: Administrative privileges

## 📱 Screens & Navigation

### Main Screens
- **Login Screen**: Authentication with biometric support
- **Products Screen**: Product catalog with search and filtering
- **Category Selection**: Browse products by category
- **Category Screen**: Category-specific product listings
- **Profile Screen**: User settings and preferences

### Navigation Structure
- **Stack Navigator**: Screen transitions and deep linking
- **Bottom Tab Navigator**: Main app navigation
- **Modal Presentations**: Overlay screens and alerts

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
API_BASE_URL=https://dummyjson.com
BIOMETRIC_ENABLED=true
AUTO_LOCK_TIMEOUT=10000
```

### Build Configuration

#### Android
- **Target SDK**: 34
- **Minimum SDK**: 21
- **Build Tools**: Latest stable

#### iOS
- **Deployment Target**: 13.0
- **Swift Version**: 5.0

## 📦 Dependencies & Rationale

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react-native` | 0.82.0 | Mobile app framework |
| `typescript` | ^5.8.3 | Type safety and development experience |
| `@reduxjs/toolkit` | ^2.9.1 | State management with simplified syntax |
| `@tanstack/react-query` | ^5.90.5 | Server state management and caching |
| `react-native-mmkv` | ^3.3.3 | High-performance local storage |
| `react-native-paper` | ^5.14.5 | Material Design components |
| `@react-navigation/native` | ^7.1.18 | Navigation system |

### Why These Dependencies?

- **Redux Toolkit**: Chosen over Context API for complex state management needs and time-travel debugging
- **React Query**: Essential for server state management, caching, and offline synchronization
- **MMKV**: Selected over AsyncStorage for better performance and synchronous operations
- **React Native Paper**: Provides consistent Material Design components with built-in theming
- **TypeScript**: Ensures type safety and better developer experience in a large codebase

## 🚧 Trade-offs & Design Decisions

### Architecture Trade-offs

#### State Management
- **Chose**: Redux Toolkit + React Query
- **Trade-off**: Added complexity but gained predictable state management and excellent dev tools
- **Alternative**: Context API would be simpler but less scalable for complex state

#### Navigation
- **Chose**: React Navigation v7
- **Trade-off**: Larger bundle size but provides comprehensive navigation features
- **Alternative**: Native navigation would be lighter but less flexible

#### Storage
- **Chose**: MMKV over AsyncStorage
- **Trade-off**: Native dependency but significantly better performance
- **Alternative**: AsyncStorage is pure JS but slower for frequent operations

#### Testing
- **Chose**: Jest + React Native Testing Library + MSW
- **Trade-off**: More setup complexity but comprehensive testing capabilities
- **Alternative**: Simpler testing would be easier to set up but less reliable

### Performance Trade-offs

#### Image Loading
- **Current**: Basic Image component
- **Trade-off**: Simple implementation but no caching or optimization
- **If more time**: Implement react-native-fast-image with caching

#### Bundle Size
- **Current**: Includes all dependencies
- **Trade-off**: Larger initial bundle but better development experience
- **If more time**: Implement code splitting and lazy loading

## 🕐 "If I Had More Time"

### Immediate Improvements (1-2 weeks)
1. **Image Optimization**: Implement image caching and lazy loading
2. **Push Notifications**: Add real-time notifications for orders and updates
3. **Advanced Search**: Implement filters, sorting, and faceted search
4. **User Profiles**: Complete user profile management with avatars
5. **Order Management**: Shopping cart and checkout flow

### Medium-term Features (1-2 months)
1. **Real Backend Integration**: Replace DummyJSON with a real e-commerce API
2. **Payment Integration**: Stripe or PayPal payment processing
3. **Social Features**: Reviews, ratings, and social sharing
4. **Analytics**: User behavior tracking and business intelligence
5. **Multi-language Support**: Internationalization and localization

### Long-term Vision (3-6 months)
1. **AI Recommendations**: Machine learning-based product suggestions
2. **AR Features**: Augmented reality product visualization
3. **Voice Search**: Voice-activated product search
4. **Progressive Web App**: Web version with offline capabilities
5. **Microservices Architecture**: Scalable backend with microservices

### Technical Debt & Refactoring
1. **Component Library**: Extract reusable components into a design system
2. **Performance Monitoring**: Implement crash reporting and performance analytics
3. **Accessibility**: Full WCAG compliance and screen reader support
4. **Security Audit**: Comprehensive security review and penetration testing
5. **Documentation**: API documentation and developer guides

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Maintain code coverage above 80%
- Follow the existing code style and conventions
- Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React Native Community](https://reactnative.dev) for the amazing framework
- [DummyJSON](https://dummyjson.com) for providing mock data
- [Material Design](https://material.io) for design guidelines
- All open-source contributors who made this project possible

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the [documentation](docs/)
- Review the [troubleshooting guide](docs/troubleshooting.md)

---

**Built with ❤️ using React Native**