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

## Maven parent

Prosjektet arver fra `no.nav.infotek:infotek-parent`.
For lokal bygging ma GitHub Packages-auth for Maven vaere satt opp i `~/.m2/settings.xml`.

## Framdrift

Se `docs/framdrift.md` for status, milepæler og hva som er utenfor scope i MVP.
