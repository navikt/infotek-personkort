package no.nav.infotek.personkort.service

import no.nav.infotek.personkort.model.Personkort
import org.springframework.stereotype.Service

@Service
class PersonkortService {
    private val demoData = mapOf(
        "12345678910" to Personkort(
            fnrMaskert = "******8910",
            navn = "Kari Nordmann",
            kontonummerMaskert = "****56",
            sisteVedtakDato = "2026-06-30",
            status = "AKTIV",
            tekst = "Demooppforing fra IP_90 personkort",
        ),
        "10987654321" to Personkort(
            fnrMaskert = "******4321",
            navn = "Ola Nordmann",
            kontonummerMaskert = "****21",
            sisteVedtakDato = "2025-12-01",
            status = "INAKTIV",
            tekst = "Demooppforing med avsluttet ytelse",
        ),
    )

    fun hentPersonkort(fnr: String): Personkort =
        demoData[fnr] ?: Personkort(
            fnrMaskert = "******${fnr.takeLast(4)}",
            navn = "Ukjent bruker",
            kontonummerMaskert = null,
            sisteVedtakDato = null,
            status = "UKJENT",
            tekst = "Ingen demo-data funnet for oppgitt ident",
        )
}

