# Thesis

A full-stack monorepo application built with **NestJS** (backend) and **Next.js** (frontend), managed with **PNPM Workspaces**.

---

## 📋 Main Features

- **Monorepo Architecture** — Single repository managing both backend API and frontend web app with shared tooling and configuration.
- **RESTful API** — Backend API built with NestJS featuring modular architecture, dependency injection, and decorator-based routing.
- **Database Integration** — PostgreSQL database with Prisma ORM for type-safe queries, migrations, and schema management.
- **Caching Layer** — Redis integration for caching and session management.
- **Server-Side Rendering** — Next.js frontend with React 19, supporting SSR/SSG for optimal performance and SEO.
- **User Management** — User model with UUID-based identification and unique email constraints.
- **Dockerized Infrastructure** — Docker Compose setup for PostgreSQL and Redis, enabling one-command local environment provisioning.
- **Code Quality** — ESLint, Prettier, and TypeScript configured across all apps for consistent code standards.
- **Testing** — Jest-based unit and e2e testing setup for the backend API.

---

## 🛠️ Tech Stack

### Backend (`apps/api`)

| Technology | Version | Purpose |
|---|---|---|
| **NestJS** | ^11.0.1 | Backend framework |
| **TypeScript** | ^5.7.3 | Type-safe JavaScript |
| **Prisma** | ^7.6.0 | ORM & database toolkit |
| **PostgreSQL** | 15 | Relational database |
| **Redis** | 7 | Caching & session store |
| **Jest** | ^30.0.0 | Testing framework |
| **ESLint** | ^9.18.0 | Code linting |
| **Prettier** | ^3.4.2 | Code formatting |

### Frontend (`apps/web`)

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.2.2 | React framework (SSR/SSG) |
| **React** | 19.2.4 | UI library |
| **Tailwind CSS** | ^4 | Utility-first CSS framework |
| **TypeScript** | ^5 | Type-safe JavaScript |
| **ESLint** | ^9 | Code linting |

### Infrastructure

| Technology | Purpose |
|---|---|
| **Docker Compose** | Container orchestration for local dev |
| **PNPM** (v10.33.0) | Fast, disk-efficient package manager |
| **PNPM Workspaces** | Monorepo management |

---

## 📁 Project Structure

```
thesis/
├── apps/
│   ├── api/                  # NestJS backend
│   │   ├── prisma/           # Prisma schema & migrations
│   │   ├── src/
│   │   │   ├── prisma/       # Prisma module & service
│   │   │   ├── app.module.ts
│   │   │   ├── app.controller.ts
│   │   │   ├── app.service.ts
│   │   │   └── main.ts       # Entry point (port 3004)
│   │   ├── test/             # E2E tests
│   │   └── package.json
│   └── web/                  # Next.js frontend
│       ├── app/              # App Router pages
│       ├── public/           # Static assets
│       └── package.json
├── packages/                 # Shared libraries (future use)
├── docker-compose.yml        # PostgreSQL & Redis services
├── pnpm-workspace.yaml       # Workspace configuration
├── .env                      # Root environment variables
└── package.json              # Root package config
```

---

## 🚀 Prerequisites

Make sure you have the following installed:

- **Node.js** >= 18
- **PNPM** v10.33.0 — Install with `corepack enable && corepack prepare pnpm@10.33.0 --activate`
- **Docker** & **Docker Compose** — For PostgreSQL and Redis

---

## ⚙️ Setup & Run

### 1. Clone the repository

```bash
git clone <repository-url>
cd thesis
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the project root (if not already present):

```env
# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=123456
POSTGRES_DB=thesis_db

# Database connection URL
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5433/${POSTGRES_DB}
```

Create a `.env` file in `apps/api/` (if not already present):

```env
DATABASE_URL="postgresql://postgres:123456@localhost:5433/thesis_db"
```

### 4. Start infrastructure services

```bash
docker compose up -d
```

This will spin up:
- **PostgreSQL** on `localhost:5433`
- **Redis** on `localhost:6380`

### 5. Set up the database

```bash
cd apps/api

# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev
```

### 6. Run the applications

#### Start the Backend API

```bash
# From apps/api/
pnpm start:dev
```

The API server will be available at **http://localhost:3004**

#### Start the Frontend Web App

```bash
# From apps/web/
pnpm dev
```

The web app will be available at **http://localhost:3003**

---

## 📜 Available Scripts

### Backend (`apps/api`)

| Command | Description |
|---|---|
| `pnpm start:dev` | Start in dev mode with hot reload |
| `pnpm start:debug` | Start in debug mode with hot reload |
| `pnpm build` | Build for production |
| `pnpm start:prod` | Run production build |
| `pnpm test` | Run unit tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:cov` | Run tests with coverage |
| `pnpm test:e2e` | Run end-to-end tests |
| `pnpm lint` | Lint and fix code |
| `pnpm format` | Format code with Prettier |

### Frontend (`apps/web`)

| Command | Description |
|---|---|
| `pnpm dev` | Start in dev mode (port 3003) |
| `pnpm build` | Build for production |
| `pnpm start` | Run production build (port 3003) |
| `pnpm lint` | Lint code |

---

## 🐳 Docker Services

| Service | Image | Host Port | Container Port |
|---|---|---|---|
| PostgreSQL | `postgres:15` | 5433 | 5432 |
| Redis | `redis:7` | 6380 | 6379 |

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f
```

---

## 📄 License

This project is licensed under the **ISC License**.
