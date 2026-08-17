import { describe, expect, it, vi } from "vitest";
import { hentPersonkort } from "./personkortApi";

describe("hentPersonkort", () => {
  it("returnerer data ved 200-respons", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          fnrMaskert: "******8910",
          navn: "Kari Nordmann",
          kontonummerMaskert: "****56",
          sisteVedtakDato: "2026-06-30",
          status: "AKTIV",
          tekst: "Demooppforing",
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      )
    );

    const data = await hentPersonkort("12345678910");
    expect(data.navn).toBe("Kari Nordmann");
  });

  it("kaster feil ved ikke-ok respons", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(new Response(null, { status: 500 }));
    await expect(hentPersonkort("12345678910")).rejects.toThrow("Kunne ikke hente personkort");
  });
});
