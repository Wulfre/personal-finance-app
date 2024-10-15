import { defineConfig } from "drizzle-kit"

export default defineConfig({
    out: "./drizzle",
    schema: "./src/db/tables",
    dialect: "sqlite",
    dbCredentials: {
        url: "file:local.db",
    },
})
