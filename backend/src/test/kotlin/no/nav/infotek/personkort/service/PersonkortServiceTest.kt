package no.nav.infotek.personkort.service

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class PersonkortServiceTest {
    private val service = PersonkortService()

    @Test
    fun `returns configured demo data for known fnr`() {
        val personkort = service.hentPersonkort("12345678910")

        assertEquals("******8910", personkort.fnrMaskert)
        assertEquals("Kari Nordmann", personkort.navn)
        assertEquals(2, personkort.innslag.size)
        assertEquals("AKTIV", personkort.innslag.first().status)
    }

    @Test
    fun `returns fallback data for unknown fnr`() {
        val personkort = service.hentPersonkort("11111111111")

        assertEquals("******1111", personkort.fnrMaskert)
        assertEquals("Ukjent bruker", personkort.navn)
        assertEquals(1, personkort.innslag.size)
        assertEquals("UKJENT", personkort.innslag.first().status)
    }
}
