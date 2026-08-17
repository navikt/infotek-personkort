# infotek-personkort

Oppslagsløsning for IP_90 personkort.

## MVP

- Frontend: TanStack Router + TanStack Query + Aksel
- Backend: Spring Boot 4 + Kotlin med demo-data
- Ingen DB/Kafka i fase 1

## Arkitektur

Frontend og backend er **én Nais-app** (`infotek-personkort`). Backend serverer det
statiske frontend-bygget fra `classpath:/static/` og eksponerer API-et på `/api/**`.

Dette er et bevisst valg: Wonderwall-sidecaren utsteder et access token som ifølge
[Nais-dokumentasjonen](https://docs.nais.io/auth/entra-id/how-to/login/) kun er gyldig for
appens egen client. Med to separate apper måtte vi hatt en BFF som gjorde
on-behalf-of-veksling for å kalle backend. Med én app matcher audience direkte.

## Kommandoer

`nais login` trengs kun for å pulle baseimages fra Nav sitt Artifact Registry — det har
ingenting med innlogging i appen å gjøre:

```bash
nais login
```

Lokalt kjører vi med samme auth som i Nais: Wonderwall og en mock-utgave av Azure AD
startes automatisk av `compose.yml`. Det finnes ingen `noauth`-modus.

Nettleseren må kunne slå opp `host.docker.internal` for å fullføre innlogging.
Legg til i `/etc/hosts` hvis den ikke finnes fra før:

```
127.0.0.1 host.docker.internal
```

```bash
make install
make build
make run
make test
make e2e-test
```

| Tjeneste | URL |
|----------|-----|
| Appen (gjennom Wonderwall) | http://localhost:4000 |
| Innlogging | http://localhost:4000/oauth2/login |
| Mock OIDC | http://localhost:8102 |
| Vite dev-server | http://localhost:3000 |

Vite dev-serveren proxyer `/api` og `/oauth2` til Wonderwall på port 4000, slik at
også hot reload kjører med ekte innlogging.

### Lokal utvikling med `pnpm dev` (anbefalt)

Kjør i to terminaler:

```bash
# terminal 1: Wonderwall + mock-oidc + backend
docker compose -f compose.yml up --build

# terminal 2: frontend med hot reload
cd frontend
pnpm install
pnpm dev
```

- Åpne frontend på `http://localhost:3000`.
- `3000` serverer frontend fra Vite, men proxyer `/oauth2` og `/api` til Wonderwall på `4000`.
- Går du direkte til `http://localhost:4000`, får du backendens statiske frontend-bygg.

### E2E i `tests/`

Repoet bruker en egen `tests/`-mappe for Playwright (samme mønster som i andre repos):

```bash
cd tests
pnpm install --no-frozen-lockfile
pnpm playwright:install
pnpm playwright:test
```

### Lokal backend-utvikling

Når du jobber primært i backend, kan du kjøre backend lokalt uten Docker-image:

```bash
# terminal 1: start mock-oidc
docker compose -f compose.yml up mock-oidc

# terminal 2: start backend lokalt
export AZURE_APP_WELL_KNOWN_URL=http://localhost:8102/azure-mock/.well-known/openid-configuration
export AZURE_APP_CLIENT_ID=infotek-personkort
mvn --batch-mode -s .mvn/settings.xml -pl backend spring-boot:run
```

- Backend kjører da på `http://localhost:8080`.
- Health/prober: `http://localhost:8080/actuator/health/liveness` og `/readiness`.
- API-endepunktene er beskyttet; bruk testene for rask verifisering av auth/adferd:

```bash
mvn --batch-mode -s .mvn/settings.xml -pl backend -Dtest=ApplikasjonIntegrasjonTest,PersonkortServiceTest test
```

## Maven parent

Prosjektet arver fra `no.nav.infotek:infotek-parent`.
For lokal bygging må GitHub Packages-auth for Maven være satt opp i `~/.m2/settings.xml`.

## Framdrift

Se `docs/framdrift.md` for status, milepæler og hva som er utenfor scope i MVP.
