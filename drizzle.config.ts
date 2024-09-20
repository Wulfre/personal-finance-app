import { defineConfig } from "drizzle-kit"
import wranglerCOnfig from "./wrangler.json" with { type: "json" }

if (!process.env.CLOUDFLARE_TOKEN) {
	throw new Error("CLOUDFLARE_TOKEN env variable is required")
}

const dbConfig = wranglerCOnfig.d1_databases.at(0)

if (!dbConfig) {
	throw new Error("Missing database configuration in wrangler.json")
}

export default defineConfig({
	schema: "./src/lib/db/schema.ts",
	out: "./migrations",
	dialect: "sqlite",
	driver: "d1-http",
	dbCredentials: {
		token: process.env.CLOUDFLARE_TOKEN,
		accountId: wranglerCOnfig.account_id,
		databaseId: dbConfig.database_id,
	},
})
