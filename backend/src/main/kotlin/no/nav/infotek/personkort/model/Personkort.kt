package no.nav.infotek.personkort.model

data class Personkort(
    val fnrMaskert: String,
    val navn: String,
    val kontonummerMaskert: String?,
    val sisteVedtakDato: String?,
    val status: String,
    val tekst: String?,
)

