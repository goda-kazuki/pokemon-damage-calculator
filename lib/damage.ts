export function calculateStat(baseStat: number, ev: number): number {
  // 1. (2×種族値 + 31 + 努力値) × 50 ÷ 100 を計算 → floorする
  const stat = Math.floor(((2 * baseStat + 31 + ev) * 50) / 100);

  // 2. 1の結果に +5 する
  const finalStat = stat + 5;

  // 3. 最終的な数値を return する
  return finalStat;
}
