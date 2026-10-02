import { describe, it, expect } from "vitest";
import { toKatakana } from "./kana";

describe("toKatakana", () => {
  it("ひらがなをカタカナに変換する", () => {
    expect(toKatakana("あいうえお")).toBe("アイウエオ");
  });

  it("カタカナはそのまま返す", () => {
    expect(toKatakana("アイウエオ")).toBe("アイウエオ");
  });

  it("ひらがなとカタカナが混ざっている場合、ひらがなをカタカナに変換する", () => {
    expect(toKatakana("あいうえおアイウエオ")).toBe("アイウエオアイウエオ");
  });

  it("ひらがな・カタカナ以外の文字はそのまま返す", () => {
    expect(toKatakana("abc123")).toBe("abc123");
    expect(toKatakana("漢字")).toBe("漢字");
    expect(toKatakana("ー-")).toBe("ー-");
  });
});
