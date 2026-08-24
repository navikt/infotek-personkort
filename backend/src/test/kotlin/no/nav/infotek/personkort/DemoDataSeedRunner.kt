package no.nav.infotek.personkort

import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import no.nav.security.token.support.spring.test.EnableMockOAuth2Server
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles

@SpringBootTest(
    properties = [
        "AZURE_APP_WELL_KNOWN_URL=http://localhost:\${mock-oauth2-server.port}/azure/.well-known/openid-configuration",
        "AZURE_APP_CLIENT_ID=infotek-personkort",
    ],
)
@ActiveProfiles("demo-data")
@EnableMockOAuth2Server
class DemoDataSeedRunner {
    @Test
    fun `seeder fullfores`() {
        assertTrue(true)
    }
}
