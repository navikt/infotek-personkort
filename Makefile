.PHONY: help install build test backend frontend frontend-test e2e-install e2e-test docker-build docker-up docker-down docker-logs

help: ## Vis kommandoer
	@grep -E '^[a-zA-Z_-]+:.*##' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "}; {printf "%-18s %s\n", $$1, $$2}'

install: ## Installer frontend-avhengigheter
	cd frontend && pnpm install --no-frozen-lockfile

build: backend frontend ## Bygg backend og frontend

backend: ## Bygg backend
	mvn --batch-mode -s .mvn/settings.xml -pl backend -am clean package

frontend: install ## Bygg frontend
	cd frontend && pnpm run build

frontend-test: install ## Kjor frontend unit tester (Vitest)
	cd frontend && pnpm test

e2e-install: ## Installer e2e-avhengigheter
	cd e2e && pnpm install --no-frozen-lockfile

e2e-test: install e2e-install ## Kjor frontend e2e med Playwright (starter backend + frontend)
	cd e2e && pnpm playwright:test

test: frontend-test ## Kjor backend + frontend unit tester
	mvn --batch-mode -s .mvn/settings.xml -pl backend -am test

docker-build: build ## Bygg app + Docker-images lokalt
	docker compose -f compose.yml build

docker-up: ## Start appene lokalt i Docker
	docker compose -f compose.yml up --build

docker-down: ## Stopp appene lokalt i Docker
	docker compose -f compose.yml down

docker-logs: ## Vis Docker-logger
	docker compose -f compose.yml logs -f
