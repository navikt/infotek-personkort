package no.nav.infotek.personkort.service

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test

class PersonkortServiceTest {
    private val service = PersonkortService()

    @Test
    fun `returns configured demo data for known fnr`() {
        val personkort = requireNotNull(service.hentPersonkort("12345678910"))

        assertEquals("12345678910", personkort.fnr)
        assertEquals("Kari Nordmann", personkort.navn)
        assertEquals(2, personkort.innslag.size)
        assertEquals("AKTIV", personkort.innslag.first().status)
    }

    @Test
    fun `returns null for unknown fnr`() {
        val personkort = service.hentPersonkort("11111111111")

        assertNull(personkort)
    }
}
