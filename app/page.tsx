'use client';

import { calculateStat, calculateDamage } from "@/lib/damage";
import { useState } from "react";


export default function Home() {
  const [category, setCategory] = useState<"physical" | "special">("physical");

  const [power, setPower] = useState(100);

  const [attackerBase, setAttackerBase] = useState(80);
  const [attackerEv, setAttackerEv] = useState(32);

    const [defenderBase, setDefenderBase] = useState(80);
  const [defenderEv, setDefenderEv] = useState(32);  const [result, setResult] = useState<{ min: number; max: number } | null>(null);

  const handleCalculate = () => {
    const attackStat = calculateStat(attackerBase, attackerEv);
    const defenseStat = calculateStat(defenderBase, defenderEv);
    const damage = calculateDamage(power, attackStat, defenseStat);
    setResult(damage);
  };

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: number) => void
  ) => {
    setter(Number(e.target.value));
  };


  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">

        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <form className="flex flex-col gap-2">
            <div>
              <label>
                <input
                  type="radio"
                  name="category"
                  value="physical"
                  checked={category === "physical"}
                  onChange={() => setCategory("physical")}
                />
                物理
              </label>
              <label>
                <input
                  type="radio"
                  name="category"
                  value="special"
                  checked={category === "special"}
                  onChange={() => setCategory("special")}
                />
                特殊
              </label>
            </div>

            <div>
              <label>
                技の威力
                <input className="border border-gray-300 rounded-md p-2 w-24"
                  type="number"
                  value={power}
                  onChange={(e) => handleNumberChange(e, setPower)}
                  placeholder="技の威力"
                />
              </label>
            </div>

            <div>
              <label>
                攻撃側の種族値
                <input className="border border-gray-300 rounded-md p-2 w-24"
                  type="number"
                  value={attackerBase}
                  onChange={(e) => handleNumberChange(e, setAttackerBase)}
                  placeholder="攻撃側の種族値"
                />
              </label>
            </div>

            <div>
              <label>
                攻撃側の努力値
                <input className="border border-gray-300 rounded-md p-2 w-24"
                  type="number"
                  value={attackerEv}
                  onChange={(e) => handleNumberChange(e, setAttackerEv)}
                  placeholder="攻撃側の努力値"
                />
              </label>
            </div>

            <div>
              <label>
                防御側の種族値
                <input className="border border-gray-300 rounded-md p-2 w-24"
                  type="number"
                  value={defenderBase}
                  onChange={(e) => handleNumberChange(e, setDefenderBase)}
                  placeholder="防御側の種族値"
                />
              </label>
            </div>

            <div>
              <label>
                防御側の努力値
                <input className="border border-gray-300 rounded-md p-2 w-24"
                  type="number"
                  value={defenderEv}
                  onChange={(e) => handleNumberChange(e, setDefenderEv)}
                  placeholder="防御側の努力値"
                />
              </label>
            </div>


            <div>
              <button className="bg-blue-500 text-white rounded-md p-2 ml-2"
                type="button"
                onClick={handleCalculate}
              >
                計算
              </button>
            </div>
          </form>

          {result && (
            <p>
              ダメージ: {result.min} ~ {result.max}
            </p>
          )}

        </div>
      </main>
    </div>
  );
}
