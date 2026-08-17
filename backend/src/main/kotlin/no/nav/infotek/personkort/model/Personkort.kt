package no.nav.infotek.personkort.model

data class PersonkortResponse(
    val fnrMaskert: String,
    val navn: String,
    val innslag: List<PersonkortInnslag>,
)

data class PersonkortInnslag(
    val status: String,
    val kontonummerMaskert: String?,
    val dato: String?,
    val fom: String?,
    val tom: String?,
    val bevilgetBelop: String?,
    val betaltBelop: String?,
    val bevilgetProsent: String?,
    val tekst: String?,
    val datoSekvens: Int?,
)
