# Copilot-instruksjoner for infotek-personkort

## Retning
- Hold kode og struktur tett pa `historisk-superhelt` for frontend.
- Bruk `historisk-helsetjenester` som domenereferanse for GE-PP/IP90 i senere faser.

## MVP-regler
- Ingen database eller Kafka i fase 1.
- Bruk demo-data fra backend for personkort-oppslag.
- Ikke bruk eirslett frontend-maven-plugin.
- Frontend bygges med pnpm og deployes som egen Nais-app.

## Sikkerhet
- Ikke logg PII (fnr, navn, adresse).
- Bruk Azure AD/Wonderwall for saksbehandler-tilgang.

