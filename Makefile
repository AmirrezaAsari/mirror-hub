.PHONY: up down build logs restart clean shell migrate dev install lint format test

COMPOSE := docker compose

up: ## Start all services in detached mode
	$(COMPOSE) up -d --build

down: ## Stop and remove containers
	$(COMPOSE) down

build: ## Build Docker images
	$(COMPOSE) build

logs: ## Follow application logs
	$(COMPOSE) logs -f app

restart: ## Restart all services
	$(COMPOSE) restart

clean: ## Stop containers and remove volumes
	$(COMPOSE) down -v

shell: ## Open a shell in the app container
	$(COMPOSE) exec app sh

migrate: ## Run Prisma migrations in the app container
	$(COMPOSE) exec app npx prisma migrate deploy

dev: ## Start the app locally in development mode
	npm run start:dev

install: ## Install npm dependencies
	npm install

lint: ## Run ESLint
	npm run lint

format: ## Format code with Prettier
	npm run format

test: ## Run unit tests
	npm run test

help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'
