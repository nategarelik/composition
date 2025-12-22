import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

// Use DATABASE_URL from environment, with a placeholder for builds without DB access
const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://placeholder:placeholder@localhost:5432/placeholder";

export default defineConfig({
  schema: path.join(__dirname, "prisma/schema.prisma"),
  migrations: {
    path: path.join(__dirname, "prisma/migrations"),
  },
  datasource: {
    url: databaseUrl,
  },
});
