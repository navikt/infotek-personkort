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
# Bygger, starter Postgres, mock-oidc, Wonderwall og appen, og seeder demo-data.
make dev
```

- Appen er tilgjengelig gjennom Wonderwall på `http://localhost:4000`.
- Testdata kan seedes på nytt uten å starte resten av miljøet med `make test-data`.
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

## Demo-data / testpersoner

Personkort-oppslag bruker data fra PostgreSQL. Det syntetiske datasettet ligger i
`backend/src/test/resources/personkort-demodata.json` og seedes idempotent med
`make test-data`; det pakkes ikke inn i produksjonsapplikasjonen.
Bruk disse fødselsnumrene for å søke opp testpersoner lokalt:

| Fnr | Navn | Antall innslag | Merknad |
|-----|------|-----------------|---------|
| `12345678910` | Kari Nordmann | 20 | Standard demo-person; første 3 rader er stabile (aktiv, aktiv, avsluttet) |
| `10987654321` | Ola Nordmann | 20 | Første rad er stabil (inaktiv/avsluttet ytelse) |
| `12030456789` | Test Person | 20 | Første 2 rader er stabile: løpende periode uten TOM med lang tekst, og en rad med kun tomme felt |
| `10000000000`–`10000000016` | Syntetiske testpersoner (17 stk.) | 20–30 hver | Genererte navn med variasjon i status, kontonummer, beløp, tomme felt og tekstlengde |
| `10000000100` | Gudrun Fjellheim | 320 | «Veteran»-person med lang livshistorie (ca. kvartalsvise innslag over ~80 år) |
| `10000000101` | Alf Kristiansen | 420 | «Veteran»-person med lang livshistorie |
| `10000000102` | Ruth Amundsen | 540 | «Veteran»-person med lang livshistorie |

Alle fødselsnumre er fiktive og finnes kun i demo-datasettet. Fnr som ikke finnes i
datasettet (f.eks. `11111111111`) gir 404 fra `/api/personkort`.
