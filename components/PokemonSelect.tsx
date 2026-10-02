"use client";
import { useState } from "react";

import { Pokemon } from "@/lib/pokemon";
import { toKatakana } from "@/lib/kana";
import Image from "next/image";

export default function PokemonSelect({
  pokemonList,
  onSelect,
}: {
  pokemonList: Pokemon[];
  onSelect: (pokemon: Pokemon) => void;
}) {
  const [keyword, setKeyword] = useState("");
  const [selectPokemon, setSelectPokemon] = useState<Pokemon | null>(null);

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    setSelectPokemon(null);
  };

  const handlePokemonSelect = (pokemon: Pokemon) => {
    setSelectPokemon(pokemon);
    setKeyword(pokemon.name_ja);
    onSelect(pokemon);
  };

  const filteredPokemonList = pokemonList.filter((pokemon) =>
    pokemon.name_ja.includes(toKatakana(keyword)),
  );

  return (
    <div>
      <label>
        選択ポケモン
        <input
          className="border border-gray-300 rounded-md p-2 w-24"
          type="text"
          value={keyword}
          onChange={(e) => handleKeywordChange(e)}
          placeholder="ポケモン"
        />
      </label>
      {keyword && !selectPokemon && (
        <ul>
          {filteredPokemonList.map((pokemon) => (
            <li key={pokemon.id}>
              <button
                type="button"
                onClick={() => handlePokemonSelect(pokemon)}
              >
                {pokemon.name_ja}
                {pokemon.form_ja && <span> / {pokemon.form_ja}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
      {selectPokemon && selectPokemon.sprite_url && (
        <Image
          src={selectPokemon.sprite_url}
          alt={selectPokemon.name_en}
          width={96}
          height={96}
        />
      )}
    </div>
  );
}
