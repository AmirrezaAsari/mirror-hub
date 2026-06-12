.PHONY: up down build logs restart clean shell migrate dev install lint format test frontend-dev frontend-install frontend-logs help

COMPOSE := docker compose

up: ## Start all services in detached mode
	$(COMPOSE) up -d --build

down: ## Stop and remove containers
	$(COMPOSE) down

build: ## Build Docker images
	$(COMPOSE) build

logs: ## Follow backend logs
	$(COMPOSE) logs -f backend

frontend-logs: ## Follow frontend logs
	$(COMPOSE) logs -f frontend

restart: ## Restart all services
	$(COMPOSE) restart

clean: ## Stop containers and remove volumes
	$(COMPOSE) down -v

shell: ## Open a shell in the backend container
	$(COMPOSE) exec backend sh

migrate: ## Run Prisma migrations in the backend container
	$(COMPOSE) exec backend npx prisma migrate deploy

seed: ## Run database seed in the backend container
	$(COMPOSE) exec backend npx prisma db seed

dev: ## Start the backend locally in development mode
	npm run start:dev

frontend-dev: ## Start the frontend locally in development mode
	cd ui && npm run dev

install: ## Install backend npm dependencies
	npm install

frontend-install: ## Install frontend npm dependencies
	cd ui && npm install

lint: ## Run backend ESLint
	npm run lint

format: ## Format backend code with Prettier
	npm run format

test: ## Run backend unit tests
	npm run test

help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-18s\033[0m %s\n", $$1, $$2}'
