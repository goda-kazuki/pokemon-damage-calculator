import { describe, it, expect } from "vitest";
import { calculateStat } from "./damage";
import { calculateDamage } from "./damage";

describe("calculateStat", () => {
  it("種族値100・努力値0のとき120になる", () => {
    expect(calculateStat(100, 0)).toBe(120);
  });

  it("種族値100・努力値32のとき136になる", () => {
    expect(calculateStat(100, 32)).toBe(136);
  });
});

describe("calculateDamage", () => {
  it("威力100・攻撃100・防御100のとき min:39 max:46 になる", () => {
    expect(calculateDamage(100, 100, 100)).toEqual({ min: 39, max: 46 });
  });

  it("威力80・攻撃120・防御100のとき min:37 max:44 になる", () => {
    expect(calculateDamage(80, 120, 100)).toEqual({ min: 37, max: 44 });
  });
});
