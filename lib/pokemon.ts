import "server-only";

import { z } from "zod";
import db from "@/lib/db";

const pokemonSchema = z.object({
  id: z.number(),
  name_en: z.string(),
  name_ja: z.string(),
  form_ja: z.string().nullable(),
  sprite_url: z.string().nullable(),
  hp: z.number(),
  attack: z.number(),
  defense: z.number(),
  special_attack: z.number(),
  special_defense: z.number(),
  speed: z.number(),
});

export type Pokemon = z.infer<typeof pokemonSchema>;

const pokemonListSchema = z.array(pokemonSchema);

export async function getPokemonList(): Promise<Pokemon[]> {
  const connect = db();

  const result = await connect.query(
    `SELECT DISTINCT ON (p.id) p.id, p.name AS name_en, speciesname.name AS name_ja, formname.name AS form_ja, sp.sprites->>'front_default' AS sprite_url,
      stats.hp, stats.attack, stats.defense, stats.special_attack, stats.special_defense, stats.speed
    FROM pokemon_v2_pokemon p
    JOIN pokemon_v2_pokemonspeciesname speciesname
      ON speciesname.pokemon_species_id = p.pokemon_species_id
    JOIN pokemon_v2_pokemonsprites sp
      ON sp.pokemon_id = p.id
    JOIN (
      SELECT
        ps.pokemon_id,
        MAX(ps.base_stat) FILTER (WHERE s.name = 'hp') AS hp,
        MAX(ps.base_stat) FILTER (WHERE s.name = 'attack') AS attack,
        MAX(ps.base_stat) FILTER (WHERE s.name = 'defense') AS defense,
        MAX(ps.base_stat) FILTER (WHERE s.name = 'special-attack') AS special_attack,
        MAX(ps.base_stat) FILTER (WHERE s.name = 'special-defense') AS special_defense,
        MAX(ps.base_stat) FILTER (WHERE s.name = 'speed') AS speed
      FROM pokemon_v2_pokemonstat ps
      JOIN pokemon_v2_stat s
        ON s.id = ps.stat_id
      GROUP BY ps.pokemon_id
    ) stats
      ON stats.pokemon_id = p.id
    LEFT JOIN pokemon_v2_pokemonform form
      ON form.pokemon_id = p.id
    LEFT JOIN pokemon_v2_pokemonformname formname
      ON formname.pokemon_form_id = form.id
      AND formname.language_id = 11
      AND formname.name <> ''
    WHERE speciesname.language_id = 11
    ORDER BY p.id, form.is_default DESC NULLS LAST, form.id
    `,
  );

  return pokemonListSchema.parse(result);
}
