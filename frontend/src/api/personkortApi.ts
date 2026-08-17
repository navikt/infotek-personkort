export type PersonkortInnslag = {
  status: string;
  kontonummerMaskert: string | null;
  dato: string | null;
  fom: string | null;
  tom: string | null;
  bevilgetBelop: string | null;
  betaltBelop: string | null;
  bevilgetProsent: string | null;
  tekst: string | null;
  datoSekvens: number | null;
};

export type Personkort = {
  fnrMaskert: string;
  navn: string;
  innslag: PersonkortInnslag[];
};

export async function hentPersonkort(fnr: string): Promise<Personkort> {
  const response = await fetch("/api/personkort", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ fnr }),
  });
  if (!response.ok) {
    throw new Error("Kunne ikke hente personkort");
  }
  return response.json() as Promise<Personkort>;
}
