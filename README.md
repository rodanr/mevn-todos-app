# MEVN Todos App

A full-stack Todo application built with MongoDB, Express.js, Vue.js, and Node.js (MEVN stack) using TypeScript.

## 📋 Features

- User authentication (login/register)
- Create, read, update, and delete todos
- Responsive design
- TypeScript throughout the stack
- Shared types and schemas between frontend and backend

## 🏗️ Project Structure

```zsh
mevn-todos-app/
├── apps/
│   ├── backend/          # Express.js API server
│   └── frontend/         # Vue.js client application
└── packages/
    └── shared/           # Shared types and schemas
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- pnpm (package manager)
- Docker and Docker Compose (for MongoDB)

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd mevn-todos-app
pnpm install
```

### 2. Setup Environment Variables

Copy the environment example files and configure your settings:

```bash
# Backend environment
cp apps/backend/.env.example apps/backend/.env

# Frontend environment
cp apps/frontend/.env.example apps/frontend/.env
```

Update the `.env` files with your preferred settings. The default values should work for local development.

### 3. Start MongoDB with Docker

Navigate to the backend directory and start MongoDB using Docker Compose:

```bash
cd apps/backend
docker-compose up -d
```

This will start a MongoDB instance on port 27017 with the credentials defined in your `.env` file.

### 4. Run the Application

From the root directory, start both frontend and backend:

```bash
pnpm run dev
```

This command will start:

- Backend API server on `http://localhost:8080`
- Frontend Vue.js app on `http://localhost:5173`

## 🛠️ Development Commands

### Root Level Commands

```bash
# Start all services (frontend + backend)
pnpm run dev

# Build all packages
pnpm run build

# Run linting
pnpm run lint

# Format code
pnpm run format

# Clean build artifacts
pnpm run clean
```

### Individual Service Commands

```bash
# Start only the backend
pnpm run dev:backend

# Start only the frontend
pnpm run dev:frontend

# Start only the shared package (for development)
pnpm run dev:shared
```

## 🐳 Docker Setup

The MongoDB database runs in a Docker container. The configuration is located in `apps/backend/docker-compose.yml`.

```bash
# Start MongoDB
cd apps/backend
docker-compose up -d

# Stop MongoDB
docker-compose down
```

## 🔧 Configuration

### Backend Configuration

Environment variables are configured in `apps/backend/.env`:

- `NODE_ENV`: Application environment (development/production)
- `PORT`: Backend server port (default: 8080)
- `DB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `CORS_ORIGIN`: Allowed CORS origin (frontend URL)

### Frontend Configuration

Environment variables are configured in `apps/frontend/.env`. The frontend automatically connects to the backend API. Configuration is handled in `apps/frontend/src/config/index.ts`.

## 📦 Tech Stack

### Backend

- **Node.js** with **TypeScript**
- **Express.js** - Web framework
- **MongoDB** with **Mongoose** - Database
- **JWT** - Authentication
- **Zod** - Schema validation

### Frontend

- **Vue.js 3** with **TypeScript**
- **PrimeVue** - UI component library
- **Vue Router** - Client-side routing
- **Pinia** - State management
- **Vite** - Build tool and dev server

### Shared

- **TypeScript** - Shared types and schemas
- **Zod** - Schema definitions

## 🚦 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Todos

- `GET /api/todos` - Get user's todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
