.PHONY: help install build test backend frontend frontend-test e2e-install e2e-test docker-build docker-up docker-down docker-logs run

help: ## Vis kommandoer
	@grep -E '^[a-zA-Z0-9_-]+:.*##' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "}; {printf "%-18s %s\n", $$1, $$2}'

install: ## Installer frontend-avhengigheter
	cd frontend && pnpm install --no-frozen-lockfile

build: backend ## Bygg frontend og backend (frontend-bygget pakkes inn i backend-jaren)

backend: frontend ## Bygg backend med innebygd frontend
	mvn --batch-mode -s .mvn/settings.xml -pl backend -am clean package

frontend: install ## Bygg frontend
	cd frontend && pnpm run build

frontend-test: install ## Kjor frontend unit tester (Vitest)
	cd frontend && pnpm test

e2e-install: ## Installer e2e-avhengigheter
	cd tests && pnpm install --no-frozen-lockfile

e2e-test: install e2e-install ## Kjor frontend e2e med Playwright (starter backend + frontend)
	cd tests && pnpm playwright:test

test: frontend frontend-test ## Kjor backend + frontend unit tester
	mvn --batch-mode -s .mvn/settings.xml -pl backend -am test

docker-build: build ## Bygg app + Docker-images lokalt
	docker compose -f compose.yml build

docker-up: ## Start appene lokalt i Docker
	docker compose -f compose.yml up --build

docker-down: ## Stopp appene lokalt i Docker
	docker compose -f compose.yml down

docker-logs: ## Vis Docker-logger
	docker compose -f compose.yml logs -f

run: build ## Bygg og start appene lokalt
	docker compose -f compose.yml up --build
