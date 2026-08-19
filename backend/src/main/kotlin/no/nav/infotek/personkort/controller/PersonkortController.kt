package no.nav.infotek.personkort.controller

import no.nav.infotek.personkort.model.PersonkortResponse
import no.nav.infotek.personkort.service.PersonkortService
import no.nav.security.token.support.core.api.Protected
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException

@Protected
@RestController
@RequestMapping("/api/personkort")
class PersonkortController(
    private val personkortService: PersonkortService,
) {
    @PostMapping
    fun hentPersonkort(@RequestBody request: PersonkortOppslagRequest): PersonkortResponse {
        if (!request.fnr.matches(Regex("\\d{11}"))) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Ugyldig ident")
        }

        return personkortService.hentPersonkort(request.fnr)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Fant ikke bruker")
    }
}

data class PersonkortOppslagRequest(
    val fnr: String,
)
