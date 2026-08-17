import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PersonkortDatagrid } from "./PersonkortDatagrid";

describe("PersonkortDatagrid", () => {
  it("viser tabellhoder og rader", () => {
    const markup = renderToStaticMarkup(
      <PersonkortDatagrid
        innslag={[
          {
            status: "AKTIV",
            kontonummerMaskert: "****56",
            dato: "2026-06-30",
            fom: "2026-01-01",
            tom: "2026-06-30",
            bevilgetBelop: "12345.67",
            betaltBelop: "11800.00",
            bevilgetProsent: "100.00",
            tekst: "Demooppføring",
            datoSekvens: 1,
          },
        ]}
      />
    );

    expect(markup).toContain("Bevilget beløp");
    expect(markup).toContain("345,67");
    expect(markup).toContain("Demooppføring");
  });

  it("viser bindestrek for tomme felt", () => {
    const markup = renderToStaticMarkup(
      <PersonkortDatagrid
        innslag={[
          {
            status: "UKJENT",
            kontonummerMaskert: null,
            dato: null,
            fom: null,
            tom: null,
            bevilgetBelop: null,
            betaltBelop: null,
            bevilgetProsent: null,
            tekst: null,
            datoSekvens: null,
          },
        ]}
      />
    );

    expect(markup).toContain("UKJENT");
    expect((markup.match(/>-</g) ?? []).length).toBeGreaterThanOrEqual(6);
  });
});
