package no.nav.infotek.personkort.config

import org.springframework.context.annotation.Configuration
import org.springframework.core.io.ClassPathResource
import org.springframework.core.io.Resource
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import org.springframework.web.servlet.resource.PathResourceResolver

/**
 * Serverer det innebygde frontend-bygget og lar klientside-ruter falle tilbake til index.html.
 */
@Configuration
class SpaConfiguration : WebMvcConfigurer {
    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        registry
            .addResourceHandler("/**")
            .addResourceLocations(STATIC_ROOT)
            .resourceChain(true)
            .addResolver(
                object : PathResourceResolver() {
                    override fun getResource(
                        resourcePath: String,
                        location: Resource
                    ): Resource? {
                        val fil = location.createRelative(resourcePath)
                        if (fil.exists() && fil.isReadable) {
                            return fil
                        }
                        if (API_PREFIKSER.any { resourcePath.startsWith(it) }) {
                            return null
                        }
                        return ClassPathResource("static/index.html").takeIf { it.exists() }
                    }
                }
            )
    }

    private companion object {
        const val STATIC_ROOT = "classpath:/static/"
        val API_PREFIKSER = listOf("api/", "actuator/", "oauth2/")
    }
}
