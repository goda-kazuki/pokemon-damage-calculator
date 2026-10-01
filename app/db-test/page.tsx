import Image from "next/image";
import { getPokemonList } from "@/lib/pokemon";

export default async function Page() {
  const pokemonList = await getPokemonList();

  return (
    <div>
      <h1>ポケモン</h1>
      <ul>
        {pokemonList.map((pokemon) => (
          <li key={pokemon.id}>
            <p>
              {pokemon.name_ja}
              {pokemon.form_ja && <span> / {pokemon.form_ja}</span>}
            </p>
            <p>
              HP {pokemon.hp} / 攻撃 {pokemon.attack} / 防御 {pokemon.defense} /
              特攻 {pokemon.special_attack} / 特防 {pokemon.special_defense} /
              素早さ {pokemon.speed}
            </p>

            {pokemon.sprite_url && (
              <Image
                src={pokemon.sprite_url}
                alt={pokemon.name_en}
                width={96}
                height={96}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
