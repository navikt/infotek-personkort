package no.nav.infotek.personkort

import no.nav.security.mock.oauth2.MockOAuth2Server
import no.nav.security.mock.oauth2.token.DefaultOAuth2TokenCallback
import no.nav.security.token.support.spring.test.EnableMockOAuth2Server
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.assertj.MockMvcTester
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@SpringBootTest(
    properties = [
        "AZURE_APP_WELL_KNOWN_URL=http://localhost:\${mock-oauth2-server.port}/azure/.well-known/openid-configuration",
        "AZURE_APP_CLIENT_ID=infotek-personkort"
    ]
)
@AutoConfigureMockMvc
@EnableMockOAuth2Server
class ApplikasjonIntegrasjonTest(
    @Autowired private val mockMvc: MockMvc,
    @Autowired private val mockOAuth2Server: MockOAuth2Server,
) {
    private val tester by lazy { MockMvcTester.create(mockMvc) }

    @Test
    fun `api krever token`() {
        mockMvc
            .perform(
                post("/api/personkort")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"fnr":"12345678910"}""")
            ).andExpect(status().isUnauthorized)
    }

    @Test
    fun `api svarer med token som har riktig audience`() {
        mockMvc
            .perform(
                post("/api/personkort")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"fnr":"12345678910"}""")
                    .header("Authorization", "Bearer ${token()}")
            ).andExpect(status().isOk)
    }

    @Test
    fun `api avviser token med feil audience`() {
        mockMvc
            .perform(
                post("/api/personkort")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"fnr":"12345678910"}""")
                    .header("Authorization", "Bearer ${token("en-annen-app")}")
            ).andExpect(status().isUnauthorized)
    }

    @Test
    fun `api avviser ugyldig fnr med 400`() {
        mockMvc
            .perform(
                post("/api/personkort")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"fnr":"123"}""")
                    .header("Authorization", "Bearer ${token()}")
            ).andExpect(status().isBadRequest)
    }

    @Test
    fun `klientside-rute faller tilbake til index-html`() {
        assertThat(tester.get().uri("/personkort"))
            .hasStatus(200)
            .bodyText()
            .contains("<div id=\"root\">")
    }

    @Test
    fun `ukjent api-rute gir ikke index-html`() {
        assertThat(tester.get().uri("/api/finnes-ikke"))
            .hasStatus(404)
    }

    @Test
    fun `nais-probene er åpne og skygges ikke av spa-fallback`() {
        assertThat(tester.get().uri("/actuator/health/liveness")).hasStatus(200)
        assertThat(tester.get().uri("/actuator/health/readiness")).hasStatus(200)
    }

    private fun token(audience: String = "infotek-personkort"): String =
        mockOAuth2Server
            .issueToken(
                issuerId = "azure",
                clientId = "infotek-personkort",
                tokenCallback =
                    DefaultOAuth2TokenCallback(
                        issuerId = "azure",
                        subject = "demo-saksbehandler",
                        audience = listOf(audience),
                        claims = mapOf("NAVident" to "MOCK-OIDC-1234")
                    )
            ).serialize()
}
