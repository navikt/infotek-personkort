# infotek-personkort

Oppslagsløsning for IP_90 personkort.

## MVP

- Frontend: TanStack Router + TanStack Query + Aksel
- Backend: Spring Boot 4 + Kotlin med demo-data
- Ingen DB/Kafka i fase 1

## Kommandoer

```bash
make install
make build
make test
make e2e-test
```

## Maven parent

Prosjektet arver fra `no.nav.infotek:infotek-parent`.
For lokal bygging ma GitHub Packages-auth for Maven vaere satt opp i `~/.m2/settings.xml`.

## Framdrift

Se `docs/framdrift.md` for status, milepæler og hva som er utenfor scope i MVP.
