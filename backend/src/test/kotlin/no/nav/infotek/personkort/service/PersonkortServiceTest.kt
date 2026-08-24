package no.nav.infotek.personkort.service

import io.mockk.every
import io.mockk.mockk
import no.nav.infotek.personkort.model.PersonkortResponse
import no.nav.infotek.personkort.repository.PersonkortRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test

class PersonkortServiceTest {
    private val personkortRepository = mockk<PersonkortRepository>()
    private val service = PersonkortService(personkortRepository)

    @Test
    fun `henter personkort fra repository`() {
        val forventet = PersonkortResponse(
            fnr = "12345678910",
            navn = "Kari Nordmann",
            innslag = emptyList(),
        )
        every { personkortRepository.finnPersonkort(forventet.fnr) } returns forventet

        assertEquals(forventet, service.hentPersonkort(forventet.fnr))
    }

    @Test
    fun `returnerer null når repository ikke finner personkort`() {
        every { personkortRepository.finnPersonkort("11111111111") } returns null

        val personkort = service.hentPersonkort("11111111111")

        assertNull(personkort)
    }
}
