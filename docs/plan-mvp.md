# MVP-plan - infotek-personkort

> Sist revidert: lagt til PostgreSQL i scope, uendret auth, og en egen
> sjekkliste for hva som kreves før produksjonssetting med ekte data.

## Scope nå

- Frontend shell med TanStack Router + TanStack Query
- Backend shell med personkort-oppslag
- Én Nais-app: backend serverer frontend-bygget og eksponerer API-et
- **PostgreSQL + Flyway** for skjema (kun skjema, ingen data i migrasjoner)
- Fortsatt kun syntetisk testdata - ingen ekte Infotrygd-integrasjon

## Arkitekturbeslutninger (avklart)

### Auth / tilgang

- **Uendret**: Azure AD + Wonderwall for saksbehandlere, som i dag
  (`azure.application.allowAllUsers: true` i `nais/app/app.yaml`).
- AD-gruppe-restriksjon for IP_90-personkort er **ikke** løst nå.
  Dette er et eksplisitt punkt som **må** løses før ekte data kobles på
  (se sjekkliste for prodsetting under).

### Personvern / dataklassifisering

- IP_90-personkortet inneholder yrkesskadekoder og ytelsesdata som kan
  regnes som helseopplysninger (særlig kategori, GDPR art. 9).
- Beslutning om klassifisering **avventes** til ekte Infotrygd-data kobles
  på - inntil da er alt data syntetisk og feltene har ingen reell
  personvern-konsekvens.
- Dette er et åpent punkt som må avklares før produksjonssetting.

### Database

- **PostgreSQL** provisjoneres som Nais-ressurs (GCP), én database for
  `infotek-personkort`.
- **Flyway** brukes kun til skjemamigrasjoner (tabellstruktur, indekser).
  Migrasjonene skal være **identiske i alle miljøer** - ingen testdata,
  ingen miljøspesifikke seed-rader i Flyway-skript.
- Begrunnelse: unngår konfigurasjonsforskjeller mellom prod og test/dev,
  og holder Flyway-historikken ren og reproduserbar overalt.
- HikariCP skal eksplisitt konfigureres med `maximumPoolSize=3`,
  `idleTimeout=300000` og `maxLifetime=1800000` (ikke Spring Boot-default
  på 10 tilkoblinger) - påkrevd i Nais-miljø.

### Testdata / demo-data

- Testdata skal **ikke** ligge i Flyway-migrasjoner.
- Testdata populeres via en **JUnit-basert seeder** (tilsvarende
  `DemoData.kt`-mønsteret i
  `eksempel-repos/historisk-helsetjenester/backend/infotrygd-historikk/src/test/kotlin/no/nav/historisk/innsyn/testutil/demodata/DemoData.kt`),
  som skriver rader via repository-laget - samme kodevei som i prod.
- Nye Makefile-kommandoer:
  - `make test-data` - kjører seederen mot lokal Postgres (idempotent,
    trygg å kjøre flere ganger).
  - `make dev` - starter opp lokalt miljø (compose + backend) og seeder
    testdata automatisk, slik at man har noe å søke på med en gang.
- Datasettet som allerede finnes i
  `backend/src/main/resources/personkort-demodata.json` gjenbrukes som
  kildedata for seederen, i stedet for å bli lest direkte av appen ved
  oppstart.
- Repository-/integrasjonstest med **Testcontainers PostgreSQL** er en
  obligatorisk del av leveransen (ikke bare enhetstest på seederen),
  for å verifisere at Flyway-migrasjonen og repository-laget faktisk
  fungerer mot en ekte Postgres.

### Feilhåndtering

- **Ingen fallback** hvis databasen er nede - samme oppførsel i alle
  miljøer (dev/test/prod). Appen skal feile hardt (503/500 via Spring Boot
  sine liveness/readiness-proben og standard feilhåndtering), ikke
  degradere stille til gammel JSON-basert demo-data.

### Kilde-/eierskap for ekte data (senere, ikke nå)

- Kildesystemet (Infotrygd) har allerede GoldenGate-oppsett for uttrekk.
- **Kafka-topic og consumer på infotek-siden må vi bygge selv** - dette er
  eksplisitt **utenfor scope nå** og planlegges som eget arbeid etter at
  Postgres-laget er på plass.
- Oracle sub-DB, GoldenGate-kobling og reelt Kafka-forbruk er altså fortsatt
  ikke en del av denne fasen.

### Nedbygging av gammelt bilde

- Det gamle "0312 REG PERSONKORT"-bildet i Infotrygd
  (`docs/GE PP test.png`) **skal fjernes/dekommisjoneres** når
  `infotek-personkort` er ferdig og dekker samme funksjonalitet med ekte
  data. Tidspunkt er ikke fastsatt ennå - avhenger av når
  GoldenGate/Kafka-integrasjonen er ferdig.

## Ikke i scope nå

- Oracle sub-DB (kobling til kildesystemet)
- GoldenGate-kobling og reelt Kafka-forbruk på infotek-siden
- Ekte produksjonsdata / ekte Infotrygd-integrasjon
- AD-gruppe-restriksjon utover dagens `allowAllUsers: true`
- Endelig avklaring av personvern-/datakategorisering for helseopplysninger

## Sjekkliste før produksjonssetting med ekte data

Disse punktene må være løst før `infotek-personkort` kan erstatte det
virkelige "0312 REG PERSONKORT"-bildet i Infotrygd:

- [ ] Avklar personvernklassifisering (særlig kategori/helseopplysninger?)
      og oppdater logging/tilgangskontroll deretter
- [ ] AD-gruppe-restriksjon for hvem som kan søke opp IP_90-personkort
      (erstatte `allowAllUsers: true`)
- [ ] Kafka-topic og consumer bygget og driftet av infotek-teamet
- [ ] Verifisert GoldenGate-uttrekk fra Infotrygd inn i Kafka
- [ ] Ende-til-ende-test med ekte (eller produksjonslike) data i dev-miljø
- [ ] Overvåking/metrikker for ingest-pipeline (lag, feilrate, volum)
- [ ] Sikkerhetsgjennomgang av hele kjeden (Infotrygd → GoldenGate → Kafka
      → Postgres → API) før ekte persondata behandles
- [ ] Plan og dato for dekommisjonering av det gamle Infotrygd-bildet
- [ ] Bekreftet rollback-/beredskapsplan dersom ingest-pipeline feiler

## Referanser

- `eksempel-repos/historisk-superhelt` for frontend-oppsett
- `eksempel-repos/historisk-helsetjenester` for GE-PP/IP90-domenet,
  Flyway-skjema (`V1.002__ip90_personkort.sql` m.fl.) og
  GoldenGate/Exodus-mock-mønsteret som forbilde for senere integrasjon
