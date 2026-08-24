# Framdriftsplan - infotek-personkort

## Status
- Fase: MVP - database innført
- Datakilder: Syntetisk testdata (seedet til PostgreSQL via JUnit, ikke Flyway)
- Mål: Sette opp frontend + backend med personkort-visning på ekte database,
  klar for senere GoldenGate/Kafka-integrasjon mot Infotrygd

## Referanser vi aktivt bruker
- `eksempel-repos/historisk-helsetjenester` (GE-PP/IP90-fagflyt og domene)
- `eksempel-repos/historisk-superhelt` (TanStack Router/Query-oppsett og frontend-struktur)

## Milepæler

### M1 - Repo og grunnstruktur
- [ ] Backend modul (Spring Boot 4 + Kotlin)
- [ ] Frontend app (TanStack Router + Query + Aksel)
- [ ] Nais-manifest (frontend + backend)
- [ ] GitHub Actions (build/deploy)
- [ ] Gå gjennom `historisk-helsetjenester` og `historisk-superhelt` og dokumentere hva som gjenbrukes i MVP

### M2 - MVP funksjonelt skall
- [ ] `POST /api/personkort` med demo-data
- [ ] Frontend søk på fnr
- [ ] Personkort-side med mock-respons
- [ ] Enkel feilhåndtering i UI
- [ ] Backend tester for demo-data og validering av fnr-format
- [ ] Frontend tester for routing, søkeflyt og visning av personkort

### M2.5 - PostgreSQL innført (se `docs/plan-mvp.md` for full plan)
- [ ] Flyway-skjemamigrasjon for personkort-tabell (kun skjema, ingen data)
- [ ] Nais-ressurs for PostgreSQL (GCP)
- [ ] Repository-lag erstatter JSON-basert demo-data i `PersonkortService`
- [ ] JUnit-basert seeder for testdata (gjenbruker
      `personkort-demodata.json` som kildedata)
- [ ] `make test-data` og oppdatert `make dev` for lokal seeding
- [ ] Ingen fallback ved DB nede - feiler likt i alle miljøer
- [ ] Testcontainers-basert repository-/integrasjonstest

## Kolonneoppsett for personkort-tabell (MVP)

Personkort-visning i frontend skal være tabell/datagrid med flere innslag per person.

### Primærkolonner i MVP
- Dato
- Kontonr
- Beløp
- FOM
- TOM
- Tekst

`Beløp` viser foreløpig `bevilgetBelop`. `status`, `betaltBelop` og
`bevilgetProsent` beholdes i demo-/responsmodellen for videre domenearbeid,
men vises ikke som egne kolonner i MVP.

Kodefeltene `IP90_GRUPPE`, `IP90_EIENDOM`, `IP90_EIENDOM_KODE` og
`IP90_OPPDAT_KODE` skjules i MVP og tas inn senere ved behov.

### M3 - Klar for integrasjon
- [ ] Dokumentert API-kontrakt for personkort
- [ ] Avklart AD-grupper og behandlingsnummer
- [ ] Klar plan for GoldenGate/Kafka-fase

## Utenfor scope i MVP
- Oracle sub-DB (kobling til Infotrygd/kildesystemet)
- GoldenGate-kobling og reelt Kafka-forbruk på infotek-siden
- Produksjonsdata / ekte Infotrygd-integrasjon
- AD-gruppe-restriksjon utover dagens `allowAllUsers: true`
- Endelig avklaring av personvernklassifisering for helseopplysninger

Se `docs/plan-mvp.md` for full sjekkliste over hva som må være løst før
produksjonssetting med ekte data.

## Testoppsett (MVP)

### Backend (Kotlin + Spring Boot)
- Rammeverk: JUnit 5 + Spring Boot Test
- Testnivå i MVP:
  - Unit: `PersonkortServiceTest` (demo-data/fallback)
  - Web-lag: controller-test for `POST /api/personkort` med gyldig/ugyldig fnr
  - Repository/integrasjon: Testcontainers PostgreSQL + Flyway-migrasjon
  - Seeder: JUnit-basert testdata-seeder (kjøres via `make test-data`, ikke
    en del av vanlig `mvn test`-kjøring i CI)
- Kommando:
  - `mvn --batch-mode -pl backend -am test`

### Frontend (React + TanStack)
- Rammeverk:
  - Unit/integrasjon: Vitest
  - E2E: Playwright
- Testnivå i MVP:
  - Komponent/rute-test for index-side
  - Rute-test for `personkort` med mock av API-respons
  - Feiltilstand når API returnerer feil
- Kommandoer:
  - `cd frontend && pnpm test`
  - `cd tests && pnpm playwright:test`

### Done-kriterium for test i MVP
- [ ] Backend-testene kjører grønt i CI
- [ ] Frontend-testene kjører grønt i CI
- [ ] E2E Playwright kjører grønt i CI
- [ ] Minst én positiv og én negativ test per lag
