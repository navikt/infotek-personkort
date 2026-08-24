import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PersonkortDatagrid } from "./PersonkortDatagrid";

describe("PersonkortDatagrid", () => {
  it("viser kolonner i samme rekkefølge som referansebildet", () => {
    const markup = renderToStaticMarkup(
      <PersonkortDatagrid
        innslag={[
          {
            status: "AKTIV",
            kontonummer: "51223001234",
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

    expect(markup.indexOf("Dato")).toBeLessThan(markup.indexOf("Kontonr"));
    expect(markup.indexOf("Kontonr")).toBeLessThan(markup.indexOf("Beløp"));
    expect(markup.indexOf("Beløp")).toBeLessThan(markup.indexOf("FOM"));
    expect(markup.indexOf("FOM")).toBeLessThan(markup.indexOf("TOM"));
    expect(markup.indexOf("TOM")).toBeLessThan(markup.indexOf("Tekst"));
    expect(markup).toContain("51223001234");
    expect(markup).toContain("345,67");
    expect(markup).toContain("Demooppføring");
  });

  it("viser bindestrek for tomme felt", () => {
    const markup = renderToStaticMarkup(
      <PersonkortDatagrid
        innslag={[
          {
            status: "UKJENT",
            kontonummer: null,
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

    expect((markup.match(/>-</g) ?? []).length).toBeGreaterThanOrEqual(5);
  });
});
