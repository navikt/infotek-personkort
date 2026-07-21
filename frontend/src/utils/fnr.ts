export function erGyldigFnrVerdi(fnr: string): boolean {
  return /^\d{11}$/.test(fnr);
}

