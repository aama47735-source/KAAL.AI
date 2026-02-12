#!/bin/bash

# KAAL Deployment Script
# Quick deployment to Vercel or Netlify

echo "🚀 KAAL Deployment Script"
echo "========================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run build
echo "🔨 Building production bundle..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Check errors above."
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Ask for deployment platform
echo "Choose deployment platform:"
echo "1) Vercel (Recommended)"
echo "2) Netlify"
echo "3) Preview build locally"
echo "4) Cancel"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo "🚀 Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "📦 Installing Vercel CLI..."
            npm install -g vercel
        fi
        vercel --prod
        ;;
    2)
        echo "🚀 Deploying to Netlify..."
        if ! command -v netlify &> /dev/null; then
            echo "📦 Installing Netlify CLI..."
            npm install -g netlify-cli
        fi
        netlify deploy --prod
        ;;
    3)
        echo "👀 Starting preview server..."
        echo "Open http://localhost:4173 in your browser"
        npm run preview
        ;;
    4)
        echo "❌ Deployment cancelled"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Done!"
echo ""
echo "⚠️  IMPORTANT: Don't forget to:"
echo "   1. Set environment variables in hosting dashboard"
echo "   2. Update Supabase redirect URLs"
echo "   3. Test the deployed app thoroughly"
echo ""