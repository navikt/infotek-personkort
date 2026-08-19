import { describe, expect, it, vi } from "vitest";
import { hentPersonkort } from "./personkortApi";

describe("hentPersonkort", () => {
  it("returnerer data ved 200-respons", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          fnr: "12345678910",
          navn: "Kari Nordmann",
          innslag: [
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
          ],
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      )
    );

    const data = await hentPersonkort("12345678910");
    expect(data.navn).toBe("Kari Nordmann");
    expect(data.innslag).toHaveLength(1);
    expect(globalThis.fetch).toHaveBeenCalledWith("/api/personkort", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ fnr: "12345678910" }),
    });
  });

  it("kaster feil ved ikke-ok respons", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(new Response(null, { status: 500 }));
    await expect(hentPersonkort("12345678910")).rejects.toThrow("Kunne ikke hente personkort");
  });

  it("kaster bruker-ikke-funnet ved 404", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(new Response(null, { status: 404 }));
    await expect(hentPersonkort("12345678910")).rejects.toThrow("Fant ikke bruker");
  });
});
