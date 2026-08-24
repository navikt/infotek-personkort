package no.nav.infotek.personkort.service

import no.nav.infotek.personkort.model.PersonkortResponse
import no.nav.infotek.personkort.repository.PersonkortRepository
import org.springframework.stereotype.Service

@Service
class PersonkortService(
    private val personkortRepository: PersonkortRepository,
) {
    fun hentPersonkort(fnr: String): PersonkortResponse? = personkortRepository.finnPersonkort(fnr)
}
