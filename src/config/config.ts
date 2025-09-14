import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),
  GOOGLE_API_KEY: z.string().min(1, "GOOGLE_API_KEY is required"),
  NASA_API_KEY: z.string().min(1, "NASA_API_KEY is required"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  process.exit(1);
}

export const config = parsedEnv.data;
