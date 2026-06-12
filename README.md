# Mirror Hub

Production-ready NestJS backend with PostgreSQL, Prisma ORM, Docker, and Swagger documentation.

## Tech Stack

- **NestJS** 11.x — modular Node.js framework
- **PostgreSQL** 16 — relational database
- **Prisma** — type-safe ORM
- **Swagger** — API documentation at `/api/docs`
- **Docker & Docker Compose** — containerized deployment
- **ESLint + Prettier** — code quality and formatting

## Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- [Make](https://www.gnu.org/software/make/) (Git Bash, WSL, or Linux/macOS)

### Run with Docker

```bash
cp .env.example .env
make up
```

The full stack will be available at:

- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:3000
- **Health check:** http://localhost:3000/health
- **Swagger docs:** http://localhost:3000/api/docs
- **Queue dashboard:** http://localhost:3000/admin/queues

On startup, the backend automatically runs migrations and seeds sample mirrors from `prisma/seed.js` (idempotent — safe on every `docker compose up`).

### Local Development

**Backend:**

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

**Frontend:**

```bash
cp ui/.env.example ui/.env
make frontend-install
make frontend-dev
```

The frontend runs at http://localhost:3001 and expects the API at `NEXT_PUBLIC_API_URL` (default `http://localhost:3002`).

## Frontend (`ui/`)

Production-ready Next.js 15 dashboard for mirror monitoring.

| Stack | Purpose |
|-------|---------|
| Next.js 15 App Router | SPA shell and routing |
| TailwindCSS + shadcn-style UI | Design system |
| TanStack Query + Axios | API data layer |
| Recharts | 24h analytics charts |
| Framer Motion | Section transitions |
| Vazirmatn + RTL | Persian developer UX |

### Frontend environment

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3002` | Browser-facing API URL |
| `API_INTERNAL_URL` | `http://backend:3000` | SSR API URL inside Docker |

### Frontend API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/mirrors/fastest?package=pip\|npm\|apt` | Ranked mirrors |
| POST | `/mirrors/refresh` | Queue mirror speed tests |
| GET | `/reports/summary?package=...` | 24h analytics summary |
| GET | `/reports/history?package=...` | 24h chart data |

## Project Structure

```
src/                 # NestJS backend
ui/                  # Next.js frontend
├── app/             # App Router pages
├── components/      # Reusable UI
├── features/        # Feature sections
├── hooks/           # React Query hooks
├── services/        # Axios API layer
├── lib/             # Utilities
├── types/           # Shared TypeScript types
└── styles/          # Design tokens
prisma/
├── schema.prisma    # Database schema
└── migrations/      # SQL migrations
docker/
└── entrypoint.sh    # Container startup script
```

## Available Make Commands

| Command       | Description                          |
|---------------|--------------------------------------|
| `make up`            | Build and start all services (postgres, redis, backend, frontend) |
| `make down`          | Stop containers                      |
| `make logs`          | Follow backend logs                  |
| `make frontend-logs` | Follow frontend logs                 |
| `make frontend-dev`  | Run frontend locally                 |
| `make restart`| Restart all services                 |
| `make clean`  | Stop containers and remove volumes   |
| `make migrate`| Run database migrations              |
| `make seed`   | Run database seed manually         |
| `make help`   | List all available commands          |

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

| Variable            | Default        | Description              |
|---------------------|----------------|--------------------------|
| `NODE_ENV`          | `development`  | Runtime environment      |
| `PORT`              | `3000`         | Backend port inside the container |
| `APP_PORT`          | `3002`         | Backend port on your machine      |
| `DATABASE_URL`      | —              | PostgreSQL connection URL|
| `POSTGRES_USER`     | `mirror`       | Database user            |
| `POSTGRES_PASSWORD` | `mirror_secret`| Database password        |
| `POSTGRES_DB`       | `mirror_hub`   | Database name            |

## Scripts

```bash
npm run start:dev     # Development with hot reload
npm run build         # Compile TypeScript
npm run start:prod    # Run production build
npm run lint          # ESLint
npm run format        # Prettier
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
```

## License

MIT
