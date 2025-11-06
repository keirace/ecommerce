import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../database/index";

dotenv.config({ path: ".env.local" });

export const db = drizzle(process.env.DATABASE_URL!, { schema });

export const result = await db.execute("select 1");
