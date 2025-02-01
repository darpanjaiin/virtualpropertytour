#!/bin/bash

# Build and deploy script for Virtual Property Tour System

# Environment check
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "Error: Missing required environment variables"
    exit 1
fi

# Install dependencies
npm install

# Build process
echo "Building application..."
npm run build

# Run tests
echo "Running tests..."
npm test

# Deploy to production
echo "Deploying to production..."
npm run deploy

# Verify deployment
echo "Verifying deployment..."
./scripts/verify-deployment.sh

echo "Deployment complete!" 