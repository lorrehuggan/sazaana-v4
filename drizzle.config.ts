import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default {
  schema: "./db/schema/*",
  out: "./db/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DB_URL ?? "",
  }
} satisfies Config;
