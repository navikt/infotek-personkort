package no.nav.infotek.personkort.controller

import no.nav.infotek.personkort.model.Personkort
import no.nav.infotek.personkort.service.PersonkortService
import no.nav.security.token.support.core.api.Protected
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException

@Protected
@RestController
@RequestMapping("/api/personkort")
class PersonkortController(
    private val personkortService: PersonkortService,
) {
    @GetMapping("/{fnr}")
    fun hentPersonkort(@PathVariable fnr: String): Personkort {
        if (!fnr.matches(Regex("\\d{11}"))) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Ugyldig ident")
        }

        return personkortService.hentPersonkort(fnr)
    }
}

