package no.nav.infotek.personkort.testutil.demodata

import jakarta.annotation.PostConstruct
import no.nav.infotek.personkort.model.PersonkortResponse
import no.nav.infotek.personkort.repository.PersonkortRepository
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Component
import tools.jackson.databind.ObjectMapper
import tools.jackson.module.kotlin.readValue

@Component
@Profile("demo-data")
class DemoDataSeeder(
    private val personkortRepository: PersonkortRepository,
    private val objectMapper: ObjectMapper,
) {
    @PostConstruct
    fun seed() {
        val demodataResource = requireNotNull(
            javaClass.getResourceAsStream("/personkort-demodata.json"),
        ) { "Fant ikke personkort-demodata.json på test-classpath" }

        demodataResource.use { stream ->
            objectMapper.readValue<List<PersonkortResponse>>(stream)
                .forEach(personkortRepository::lagrePersonkort)
        }
    }
}
