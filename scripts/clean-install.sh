#!/bin/bash

# Clean install script for React Native project
echo "🧹 Cleaning project..."

# Clean npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules
rm -f package-lock.json

# Clean React Native cache
npx react-native start --reset-cache &
sleep 5
kill %1

# Clean Android build
cd android
./gradlew clean
cd ..

# Clean iOS build (if on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    cd ios
    rm -rf build
    rm -rf Pods
    rm -f Podfile.lock
    pod install
    cd ..
fi

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo "✅ Clean install complete!"
echo "🚀 You can now run: npm run android or npm run ios"
