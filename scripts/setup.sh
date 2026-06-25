#!/bin/bash

echo "🚀 Initializing S.A.M — Secure Asset Manager..."

# Backend
echo "📦 Setting up Backend..."
cd server
npm install
cd ..

# Web
echo "📦 Setting up Web..."
cd web
npm install
cd ..

# Mobile
echo "📦 Setting up Mobile..."
cd mobile
npm install
cd ..

echo "✅ Setup complete! Refer to README.md for running the services."
