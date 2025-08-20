#!/bin/bash

# UpDrill Performance Test Script
# This script runs k6 performance tests against the API

echo "🚀 Starting UpDrill Performance Tests..."

# Check if k6 is installed
if ! command -v k6 &> /dev/null; then
    echo "❌ k6 is not installed. Please install k6 first:"
    echo "   macOS: brew install k6"
    echo "   Linux: https://k6.io/docs/getting-started/installation/"
    exit 1
fi

# Check if the backend is running
if ! curl -s http://localhost:4000/api/health > /dev/null; then
    echo "❌ Backend is not running. Please start the backend first:"
    echo "   npm run dev"
    exit 1
fi

echo "✅ Backend is running"
echo "📊 Running k6 performance test..."

# Run the k6 test
k6 run k6-performance-test.js

echo "✅ Performance test completed!" 