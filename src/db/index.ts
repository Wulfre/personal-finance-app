import { drizzle } from "drizzle-orm/libsql"
import { schema } from "./tables"

export const db = drizzle({
    connection: { url: "file:local.db" },
    schema,
})
