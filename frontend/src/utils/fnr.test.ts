import { describe, expect, it } from "vitest";
import { erGyldigFnrVerdi } from "./fnr";

describe("erGyldigFnrVerdi", () => {
  it("godtar 11 siffer", () => {
    expect(erGyldigFnrVerdi("12345678910")).toBe(true);
  });

  it("avviser verdi som ikke er 11 siffer", () => {
    expect(erGyldigFnrVerdi("12345")).toBe(false);
    expect(erGyldigFnrVerdi("1234567891a")).toBe(false);
  });
});
