package no.nav.infotek.personkort.config

import no.nav.infotek.personkort.Profiles
import no.nav.security.token.support.spring.api.EnableJwtTokenValidation
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile

@EnableJwtTokenValidation(ignore = ["org.springframework"])
@Profile("!${Profiles.NOAUTH}")
@Configuration
class SecurityConfiguration

