package no.nav.infotek.personkort.repository

import no.nav.infotek.personkort.model.PersonkortInnslag
import no.nav.infotek.personkort.model.PersonkortResponse
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class PersonkortRepository(
    private val jdbcTemplate: NamedParameterJdbcTemplate,
) {
    fun finnPersonkort(fnr: String): PersonkortResponse? {
        val navn = jdbcTemplate
            .query(
                "select navn from personkort_person where fnr = :fnr",
                mapOf("fnr" to fnr),
            ) { rs, _ -> rs.getString("navn") }
            .firstOrNull() ?: return null

        val innslag = jdbcTemplate.query(
            """
            select status, kontonummer, dato, fom, tom, bevilget_belop, betalt_belop,
                   bevilget_prosent, tekst, dato_sekvens
            from personkort_innslag
            where fnr = :fnr
            order by id
            """.trimIndent(),
            mapOf("fnr" to fnr),
        ) { rs, _ ->
            PersonkortInnslag(
                status = rs.getString("status"),
                kontonummer = rs.getString("kontonummer"),
                dato = rs.getString("dato"),
                fom = rs.getString("fom"),
                tom = rs.getString("tom"),
                bevilgetBelop = rs.getString("bevilget_belop"),
                betaltBelop = rs.getString("betalt_belop"),
                bevilgetProsent = rs.getString("bevilget_prosent"),
                tekst = rs.getString("tekst"),
                datoSekvens = rs.getObject("dato_sekvens") as Int?,
            )
        }

        return PersonkortResponse(fnr = fnr, navn = navn, innslag = innslag)
    }

    @Transactional
    fun lagrePersonkort(personkort: PersonkortResponse) {
        jdbcTemplate.update(
            """
            insert into personkort_person (fnr, navn)
            values (:fnr, :navn)
            on conflict (fnr) do update set navn = excluded.navn, oppdatert = now()
            """.trimIndent(),
            mapOf("fnr" to personkort.fnr, "navn" to personkort.navn),
        )

        jdbcTemplate.update(
            "delete from personkort_innslag where fnr = :fnr",
            mapOf("fnr" to personkort.fnr),
        )

        personkort.innslag.forEach { innslag ->
            jdbcTemplate.update(
                """
                insert into personkort_innslag
                    (fnr, status, kontonummer, dato, fom, tom, bevilget_belop, betalt_belop,
                     bevilget_prosent, tekst, dato_sekvens)
                values
                    (:fnr, :status, :kontonummer, :dato, :fom, :tom, :bevilgetBelop, :betaltBelop,
                     :bevilgetProsent, :tekst, :datoSekvens)
                """.trimIndent(),
                MapSqlParameterSource()
                    .addValue("fnr", personkort.fnr)
                    .addValue("status", innslag.status)
                    .addValue("kontonummer", innslag.kontonummer)
                    .addValue("dato", innslag.dato)
                    .addValue("fom", innslag.fom)
                    .addValue("tom", innslag.tom)
                    .addValue("bevilgetBelop", innslag.bevilgetBelop)
                    .addValue("betaltBelop", innslag.betaltBelop)
                    .addValue("bevilgetProsent", innslag.bevilgetProsent)
                    .addValue("tekst", innslag.tekst)
                    .addValue("datoSekvens", innslag.datoSekvens),
            )
        }
    }
}
