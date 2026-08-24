package no.nav.infotek.personkort

import no.nav.infotek.personkort.repository.PersonkortRepository
import no.nav.security.token.support.spring.test.EnableMockOAuth2Server
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.test.context.ActiveProfiles

@SpringBootTest(
    properties = [
        "AZURE_APP_WELL_KNOWN_URL=http://localhost:\${mock-oauth2-server.port}/azure/.well-known/openid-configuration",
        "AZURE_APP_CLIENT_ID=infotek-personkort",
    ],
)
@ActiveProfiles("demo-data")
@Import(PostgresTestcontainersConfiguration::class)
@EnableMockOAuth2Server
class DemoDataTest(
    @Autowired private val personkortRepository: PersonkortRepository,
) {
    @Test
    fun `seeder lagrer omfattende syntetisk personkortdata i Postgres`() {
        assertEquals(20, requireNotNull(personkortRepository.finnPersonkort("12345678910")).innslag.size)
        assertEquals(320, requireNotNull(personkortRepository.finnPersonkort("10000000100")).innslag.size)
        assertEquals(420, requireNotNull(personkortRepository.finnPersonkort("10000000101")).innslag.size)
        assertEquals(540, requireNotNull(personkortRepository.finnPersonkort("10000000102")).innslag.size)
    }
}
