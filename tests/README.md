# E2E-tester (tests)

Denne mappen inneholder Playwright-tester for lokal utvikling og CI.

## Kjøring lokalt

Start appen først (anbefalt dev-flyt):

```bash
# terminal 1
docker compose -f ../compose.yml up --build

# terminal 2
cd ../frontend
pnpm dev
```

Installer og kjør tester:

```bash
pnpm install --no-frozen-lockfile
pnpm playwright:install
pnpm playwright:test
```

For UI-modus:

```bash
pnpm playwright:test:ui
```
