export type Personkort = {
  fnrMaskert: string;
  navn: string;
  kontonummerMaskert: string | null;
  sisteVedtakDato: string | null;
  status: string;
  tekst: string | null;
};

export async function hentPersonkort(fnr: string): Promise<Personkort> {
  const response = await fetch(`/api/personkort/${fnr}`);
  if (!response.ok) {
    throw new Error("Kunne ikke hente personkort");
  }
  return response.json() as Promise<Personkort>;
}

