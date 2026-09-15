# シンプルダメージ計算機(フェーズ1) 実装計画

> **この計画の実行について:** このリポジトリでは CLAUDE.md の方針により、
> 実装コードはリポジトリオーナー自身が書く。そのため本計画では、関数の
> インターフェース(型・シグネチャ)とテストケース(期待する入出力)を
> 具体的に示すが、実装本体のコードは意図的に記載しない。各タスクの
> 実装はご自身で書き、完了したらAI(Claude)にレビューを依頼する、という
> 進め方を想定している。

**Goal:** 種族値・努力値・技の威力からダメージの範囲(最小値~最大値)を計算するシンプルな計算機を作る。

**Architecture:** 計算ロジック(`lib/damage.ts`)をUIから独立した純粋関数として実装し、`app/page.tsx` のフォームから呼び出す。

**Tech Stack:** Next.js (App Router) / TypeScript / Vitest(単体テスト用に新規導入)

**Spec:** `docs/superpowers/specs/2026-09-15-damage-calculator-phase1-design.md`

## Global Constraints

- レベルは50固定
- 個体値は31固定(全部V)
- 性格補正はフェーズ1では適用しない
- 努力値は0~32の範囲(個体値と同じ枠でそのまま加算する)
- タイプ相性・STAB・急所・天候・特性・持ち物は対象外

---

### Task 1: テスト環境のセットアップとステータス計算関数

**Files:**

- Create: `lib/damage.ts`
- Create: `lib/damage.test.ts`
- Modify: `package.json`

**Interfaces:**

- Produces: `calculateStat(baseStat: number, ev: number): number`(`lib/damage.ts` からエクスポート。Task 3のUIから呼び出される)

- [x] **Step 1: Vitest を導入する**

Run: `npm install -D vitest`

- [x] **Step 2: package.json に test スクリプトを追加する**

`scripts` に以下を追加する。

```json
"test": "vitest run"
```

- [x] **Step 3: 失敗するテストを書く**

`lib/damage.test.ts` に以下のテストを書く(仕様書の式: `floor(floor((2×種族値+31+努力値)×50÷100)+5)`)。

```ts
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
```

- [x] **Step 4: テストを実行し、失敗することを確認する**

Run: `npx vitest run`
Expected: FAIL(`lib/damage.ts` が存在しない、または `calculateStat` が未定義のため)

- [x] **Step 5: `calculateStat` を実装する**

`lib/damage.ts` に、上記の式に基づいて `calculateStat(baseStat, ev)` を実装する(実装はご自身で書いてください)。

- [x] **Step 6: テストを実行し、成功することを確認する**

Run: `npx vitest run`
Expected: PASS

- [x] **Step 7: コミットする**

```bash
git add lib/damage.ts lib/damage.test.ts package.json package-lock.json
git commit -m "ステータス計算関数(calculateStat)を追加"
```

---

### Task 2: ダメージ計算関数

**Files:**

- Modify: `lib/damage.ts`
- Modify: `lib/damage.test.ts`

**Interfaces:**

- Produces: `calculateDamage(power: number, attackStat: number, defenseStat: number): { min: number; max: number }`(`lib/damage.ts` からエクスポート。Task 3のUIから呼び出される)

- [x] **Step 1: 失敗するテストを書く**

`lib/damage.test.ts` に以下を追記する(仕様書の式: `基本ダメージ = (22 × 威力 × 攻撃 ÷ 防御) ÷ 50 + 2`、`最小 = floor(基本ダメージ×0.85)`、`最大 = floor(基本ダメージ×1.00)`)。

```ts
import { calculateDamage } from "./damage";

describe("calculateDamage", () => {
  it("威力100・攻撃100・防御100のとき min:39 max:46 になる", () => {
    expect(calculateDamage(100, 100, 100)).toEqual({ min: 39, max: 46 });
  });

  it("威力80・攻撃120・防御100のとき min:37 max:44 になる", () => {
    expect(calculateDamage(80, 120, 100)).toEqual({ min: 37, max: 44 });
  });
});
```

- [x] **Step 2: テストを実行し、失敗することを確認する**

Run: `npx vitest run`
Expected: FAIL(`calculateDamage` が未定義のため)

- [x] **Step 3: `calculateDamage` を実装する**

`lib/damage.ts` に、上記の式に基づいて `calculateDamage(power, attackStat, defenseStat)` を実装する(実装はご自身で書いてください)。

- [x] **Step 4: テストを実行し、成功することを確認する**

Run: `npx vitest run`
Expected: PASS(Task 1のテストも含め全件成功)

- [x] **Step 5: コミットする**

```bash
git add lib/damage.ts lib/damage.test.ts
git commit -m "ダメージ計算関数(calculateDamage)を追加"
```

---

### Task 3: 入力フォームと結果表示のUI実装

**Files:**

- Modify: `app/page.tsx`

**Interfaces:**

- Consumes: `calculateStat(baseStat: number, ev: number): number`、`calculateDamage(power: number, attackStat: number, defenseStat: number): { min: number; max: number }`(いずれも `lib/damage.ts` からimport)

**フォームで管理する状態(イメージ)**

```ts
type MoveCategory = "physical" | "special";

// useStateなどで保持する値の例
// - category: MoveCategory
// - power: number
// - attackerBase: number
// - attackerEv: number
// - defenderBase: number
// - defenderEv: number
// - result: { min: number; max: number } | null
```

**画面仕様**

- 技のカテゴリ(物理/特殊)を選択する項目
- 技の威力・攻撃側の種族値/努力値・防御側の種族値/努力値の入力欄(いずれも数値)
- 「計算する」ボタン
- ボタン押下時に、`calculateStat` で攻撃側・防御側のステータスをそれぞれ計算し、その結果を `calculateDamage` に渡してダメージ範囲を算出、結果を画面に表示する
- カテゴリは実際の計算式には影響しない(攻撃/とくこう、防御/とくぼうの区別はフェーズ1では入力欄のラベル切り替えのみでよい。将来フェーズでタイプ相性などを扱う際に区別が必要になる)

- [x] **Step 1: フォームのUIを実装する**

`app/page.tsx` に、上記の入力欄と「計算する」ボタンを実装する(実装はご自身で書いてください)。

- [x] **Step 2: 計算結果の表示を実装する**

ボタン押下時に `calculateStat` → `calculateDamage` を呼び出し、結果(最小値~最大値)を画面に表示する処理を実装する(実装はご自身で書いてください)。

- [x] **Step 3: 手動で動作確認する**

Run: `npm run dev`

`http://localhost:3000` で以下を入力し、結果が一致することを確認する。

| 入力          | 値   |
| ------------- | ---- |
| カテゴリ      | 物理 |
| 威力          | 80   |
| 攻撃側 種族値 | 100  |
| 攻撃側 努力値 | 32   |
| 防御側 種族値 | 100  |
| 防御側 努力値 | 0    |

期待結果: 攻撃側ステータス136、防御側ステータス120 → `calculateDamage(80, 136, 120)` の結果、最小35・最大41が画面に表示される

- [x] **Step 4: コミットする**

```bash
git add app/page.tsx
git commit -m "ダメージ計算フォームのUIを実装"
```

---

## この計画に含まれないもの(フェーズ2以降)

- PokeAPI連携、DB(SQLite/PostgreSQL)
- 複数体のパーティ登録・持ち物設定
- ポケモンの画像表示
- タイプ相性・STAB・急所・天候・特性・性格補正
