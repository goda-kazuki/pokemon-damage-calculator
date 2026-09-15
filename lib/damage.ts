const LEVEL = 50;
const RANDOM_MIN_RATE = 0.85;
const RANDOM_MAX_RATE = 1.0;

export function calculateStat(baseStat: number, ev: number): number {
  /**
   * 種族値と努力値からステータス実数値を計算する。
   * レベル50・個体値31(V確定)・性格補正なしを前提とする。
   *
   * @param baseStat 種族値
   * @param ev 努力値(0~32)
   * @returns ステータス実数値
   */

  // 1. (2×種族値 + 31 + 努力値) × 50 ÷ 100 を計算 → floorする
  const stat = Math.floor(((2 * baseStat + 31 + ev) * 50) / 100);

  // 2. 1の結果に +5 する
  const finalStat = stat + 5;

  // 3. 最終的な数値を return する
  return finalStat;
}

export function calculateDamage(
  power: number, attackStat: number, defenseStat: number): { min: number; max: number } {
    /**
     * 技の威力・攻撃側/防御側の実数値からダメージ範囲を計算する。
     * レベルは固定されていることを前提とし、タイプ相性・STAB・急所・天候などは考慮しない。
     * 乱数(0.85~1.00)による最小値・最大値の範囲を返す。
     *
     * @param power 技の威力
     * @param attackStat 攻撃側の実数値
     * @param defenseStat 防御側の実数値
     * @returns ダメージの最小値・最大値
     */

  const levelFactor = (2 * LEVEL / 5) + 2
  const baseDamage = ((levelFactor * power * attackStat / defenseStat) / 50) + 2
  const minDamage = Math.floor(baseDamage * RANDOM_MIN_RATE)
  const maxDamage = Math.floor(baseDamage * RANDOM_MAX_RATE)
  return { min: minDamage, max: maxDamage }
}
