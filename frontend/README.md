# Frontend Setup Guide

## 🚀 Quick Start

The Wordle Challenge frontend is a React/TypeScript application with minimal boilerplate. Your team decides the component architecture!

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager

### Installation & Setup

1. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or  
   yarn start
   ```

4. **Open in browser**
   The app will automatically open at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html          # HTML template
│   └── favicon.ico         # App icon
├── src/
│   ├── App.tsx             # Main app component (minimal starter)
│   ├── App.css             # Basic styling
│   └── index.tsx           # React app entry point
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## 🎨 Current Template

The starter template includes:
- **Hello World UI**: Basic template structure to build upon
- **Backend connection test**: Button to verify API connectivity
- **TypeScript setup**: Configured and ready to use

### What's Provided
- ✅ React/TypeScript project setup
- ✅ Basic component structure
- ✅ API configuration
- ✅ Development environment ready
- ✅ Build and deployment scripts

## 🔧 Configuration

### API Base URL
The backend API URL is configured in `App.tsx`:
```typescript
const API_BASE_URL = 'http://localhost:8000/api';
```

Change this if your backend runs on a different port.