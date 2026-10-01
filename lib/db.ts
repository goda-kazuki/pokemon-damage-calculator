import "server-only";
import { neon } from "@neondatabase/serverless";

export default function db() {
  const url = process.env.DATABASE_URL;

  if (url === undefined) {
    throw new Error("DATABASE_URL is not defined");
  }
  return neon(url);
}
