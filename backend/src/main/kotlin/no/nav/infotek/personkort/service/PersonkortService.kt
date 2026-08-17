package no.nav.infotek.personkort.service

import no.nav.infotek.personkort.model.PersonkortInnslag
import no.nav.infotek.personkort.model.PersonkortResponse
import org.springframework.stereotype.Service

@Service
class PersonkortService {
    private val demoData = mapOf(
        "12345678910" to PersonkortResponse(
            fnrMaskert = "******8910",
            navn = "Kari Nordmann",
            innslag = listOf(
                PersonkortInnslag(
                    status = "AKTIV",
                    kontonummerMaskert = "****56",
                    dato = "2026-06-30",
                    fom = "2026-01-01",
                    tom = "2026-06-30",
                    bevilgetBelop = "12345.67",
                    betaltBelop = "11800.00",
                    bevilgetProsent = "100.00",
                    tekst = "Demooppføring fra IP_90 personkort",
                    datoSekvens = 1,
                ),
                PersonkortInnslag(
                    status = "AKTIV",
                    kontonummerMaskert = "****56",
                    dato = "2025-12-31",
                    fom = "2025-07-01",
                    tom = "2025-12-31",
                    bevilgetBelop = "11500.00",
                    betaltBelop = "11200.00",
                    bevilgetProsent = "100.00",
                    tekst = "Forrige halvårsperiode",
                    datoSekvens = 2,
                ),
            ),
        ),
        "10987654321" to PersonkortResponse(
            fnrMaskert = "******4321",
            navn = "Ola Nordmann",
            innslag = listOf(
                PersonkortInnslag(
                    status = "INAKTIV",
                    kontonummerMaskert = "****21",
                    dato = "2025-12-01",
                    fom = "2025-01-01",
                    tom = "2025-12-01",
                    bevilgetBelop = "9000.00",
                    betaltBelop = "9000.00",
                    bevilgetProsent = "100.00",
                    tekst = "Demooppføring med avsluttet ytelse",
                    datoSekvens = 1,
                ),
            ),
        ),
    )

    fun hentPersonkort(fnr: String): PersonkortResponse =
        demoData[fnr] ?: PersonkortResponse(
            fnrMaskert = "******${fnr.takeLast(4)}",
            navn = "Ukjent bruker",
            innslag = listOf(
                PersonkortInnslag(
                    status = "UKJENT",
                    kontonummerMaskert = null,
                    dato = null,
                    fom = null,
                    tom = null,
                    bevilgetBelop = null,
                    betaltBelop = null,
                    bevilgetProsent = null,
                    tekst = "Ingen demo-data funnet for oppgitt ident",
                    datoSekvens = null,
                ),
            ),
        )
}
