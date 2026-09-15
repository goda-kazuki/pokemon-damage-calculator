import { describe, it, expect } from "vitest";
import { calculateStat } from "./damage";

describe("calculateStat", () => {
  it("種族値100・努力値0のとき120になる", () => {
    expect(calculateStat(100, 0)).toBe(120);
  });

  it("種族値100・努力値32のとき136になる", () => {
    expect(calculateStat(100, 32)).toBe(136);
  });
});
