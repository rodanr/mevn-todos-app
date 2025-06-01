# Vue Todo App Frontend

A modern Vue.js frontend for the MEVN Todo application with TypeScript, PrimeVue, and comprehensive state management.

## 🚀 Quick Start

1. **Install dependencies:**

```bash
pnpm install
```

2. **Set up environment variables:**

```bash
cp .env.example .env
```

3. **Start development server:**

```bash
pnpm dev
```

## 🔧 Environment Configuration

### Required Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

```bash
# API Configuration (Required)
VITE_API_BASE_URL=http://localhost:3000/api/v1

# App Configuration
VITE_APP_NAME=Todo App
VITE_APP_VERSION=1.0.0

# Environment
VITE_NODE_ENV=development

# Optional Features
VITE_ENABLE_DEVTOOLS=true
VITE_ENABLE_MOCK_API=false

# API Settings
VITE_API_TIMEOUT=10000
```

### Environment Files

- `.env.example` - Template with all available variables
- `.env.production.example` - Production environment template
- `.env` - Local development environment (not committed to git)
- `.env.local` - Local overrides (not committed to git)

### Backend Integration

Ensure your backend API is running on the URL specified in `VITE_API_BASE_URL`. The frontend expects:

- Authentication endpoints: `/auth/login`, `/auth/register`
- Todo endpoints: `/todos` with full CRUD operations
- JWT token-based authentication

## 🏗️ Project Structure

```
src/
├── api/          # API service layers
├── stores/       # Pinia state management
├── composables/  # TanStack Query hooks
├── config/       # Environment configuration
├── types/        # TypeScript definitions
├── utils/        # Utility functions
├── views/        # Page components
├── components/   # Reusable components
└── router/       # Vue Router configuration
```

## 🛠️ Tech Stack

- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Pinia** for state management
- **TanStack Query** for data fetching
- **PrimeVue** for UI components
- **VeeValidate + Zod** for form validation
- **Axios** for HTTP requests
- **Vue Router** for routing

## 📝 Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript checks
```
