#!/bin/bash

echo "🚀 Starting Memee Frontend Deployment..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed! dist directory not found."
    exit 1
fi

# Copy configuration files to dist
echo "📋 Copying configuration files..."
cp static.json dist/
cp public/_redirects dist/

# Create a simple index.html test in dist
echo "🧪 Creating test file..."
cat > dist/test.html << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Deployment Test</title>
</head>
<body>
    <h1>Deployment Successful!</h1>
    <p>If you can see this, the build worked correctly.</p>
    <p>Your app should be available at the root URL.</p>
</body>
</html>
EOF

echo "✅ Build completed successfully!"
echo "📁 Build output: dist/"
echo "🌐 Deploy the 'dist' folder to your hosting service"
echo ""
echo "🔗 Your URLs will now be:"
echo "   - Homepage: https://your-domain.com/#/"
echo "   - Signup: https://your-domain.com/#/signup"
echo "   - Login: https://your-domain.com/#/login"
echo "   - OTP: https://your-domain.com/#/verify-otp" 