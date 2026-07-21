# Framdriftsplan - infotek-personkort

## Status
- Fase: MVP / Shell
- Datakilder: Mock-data (ingen DB/Kafka ennå)
- Mål: Sette opp frontend + backend med enkel personkort-visning

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
- [ ] `GET /api/personkort/{fnr}` med demo-data
- [ ] Frontend søk på fnr
- [ ] Personkort-side med mock-respons
- [ ] Enkel feilhåndtering i UI
- [ ] Backend tester for demo-data og validering av fnr-format
- [ ] Frontend tester for routing, søkeflyt og visning av personkort

### M3 - Klar for integrasjon
- [ ] Dokumentert API-kontrakt for personkort
- [ ] Avklart AD-grupper og behandlingsnummer
- [ ] Klar plan for GoldenGate/Kafka-fase

## Utenfor scope i MVP
- Oracle sub-DB
- GoldenGate/Kafka
- PostgreSQL/Flyway
- Produksjonsdata

## Testoppsett (MVP)

### Backend (Kotlin + Spring Boot)
- Rammeverk: JUnit 5 + Spring Boot Test
- Testnivå i MVP:
  - Unit: `PersonkortServiceTest` (demo-data/fallback)
  - Web-lag: controller-test for `GET /api/personkort/{fnr}` med gyldig/ugyldig fnr
- Kommando:
  - `mvn --batch-mode -pl backend -am test`

### Frontend (React + TanStack)
- Rammeverk:
  - Unit/integrasjon: Vitest
  - E2E: Playwright
- Testnivå i MVP:
  - Komponent/rute-test for index-side
  - Rute-test for `personkort/$fnr` med mock av API-respons
  - Feiltilstand når API returnerer feil
- Kommandoer:
  - `cd frontend && pnpm test`
  - `cd e2e && pnpm playwright:test`

### Done-kriterium for test i MVP
- [ ] Backend-testene kjører grønt i CI
- [ ] Frontend-testene kjører grønt i CI
- [ ] E2E Playwright kjører grønt i CI
- [ ] Minst én positiv og én negativ test per lag
