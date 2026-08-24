-- Skjema for personkort. Kun struktur - ingen data. Testdata seedes via
-- JUnit-basert seeder (se backend/src/test/kotlin/.../testutil/demodata),
-- ikke via Flyway.
--
-- Dato/beløp-feltene lagres foreløpig som tekst for å speile
-- PersonkortInnslag-modellen 1:1. Når ekte Infotrygd-format er kjent
-- (via GoldenGate/Kafka-integrasjonen) kan disse strammes til DATE/NUMERIC
-- i en senere migrasjon.

CREATE TABLE personkort_person
(
    fnr       VARCHAR(11) PRIMARY KEY,
    navn      VARCHAR(200) NOT NULL,
    opprettet TIMESTAMP    NOT NULL DEFAULT NOW(),
    oppdatert TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE personkort_innslag
(
    id               BIGSERIAL PRIMARY KEY,
    fnr              VARCHAR(11) NOT NULL REFERENCES personkort_person (fnr) ON DELETE CASCADE,
    status           VARCHAR(50) NOT NULL,
    kontonummer      VARCHAR(20),
    dato             VARCHAR(20),
    fom              VARCHAR(20),
    tom              VARCHAR(20),
    bevilget_belop   VARCHAR(20),
    betalt_belop     VARCHAR(20),
    bevilget_prosent VARCHAR(20),
    tekst            VARCHAR(500),
    dato_sekvens     INTEGER,
    opprettet        TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_personkort_innslag_fnr ON personkort_innslag (fnr);
CREATE INDEX idx_personkort_innslag_fnr_dato_sekvens ON personkort_innslag (fnr, dato_sekvens);
