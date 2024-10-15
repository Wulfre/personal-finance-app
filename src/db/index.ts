import { drizzle } from "drizzle-orm/connect"
import { schema } from "./tables"

export const db = await drizzle("libsql", {
    connection: "file:local.db",
    schema,
})
