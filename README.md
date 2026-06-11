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

The API will be available at:

- **Application:** http://localhost:3000
- **Health check:** http://localhost:3000/health
- **Swagger docs:** http://localhost:3000/api/docs

### Local Development

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

## Project Structure

```
src/
├── config/          # Environment configuration and validation
├── database/        # Prisma service and database module
├── health/          # Health check endpoint
├── app.module.ts    # Root application module
└── main.ts          # Application bootstrap
prisma/
├── schema.prisma    # Database schema
└── migrations/      # SQL migrations
docker/
└── entrypoint.sh    # Container startup script
```

## Available Make Commands

| Command       | Description                          |
|---------------|--------------------------------------|
| `make up`     | Build and start all services         |
| `make down`   | Stop containers                      |
| `make logs`   | Follow application logs              |
| `make restart`| Restart all services                 |
| `make clean`  | Stop containers and remove volumes   |
| `make migrate`| Run database migrations              |
| `make help`   | List all available commands          |

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

| Variable            | Default        | Description              |
|---------------------|----------------|--------------------------|
| `NODE_ENV`          | `development`  | Runtime environment      |
| `PORT`              | `3000`         | Application port         |
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
