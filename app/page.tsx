import DamageCalculator from "@/components/DamageCalculator";
import { getPokemonList } from "@/lib/pokemon";

export default async function Home() {
  const pokemonList = await getPokemonList();

  return <DamageCalculator pokemonList={pokemonList} />;
}
