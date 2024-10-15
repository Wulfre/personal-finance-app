import { ulid } from "@std/ulid"
import * as o from "drizzle-orm/sqlite-core"
import { usersTable } from "./users"

export const userSessionsTable = o.sqliteTable("userSessions", {
    id: o.text().primaryKey().$default(ulid),
    lastRefreshTimestamp: o
        .integer({ mode: "timestamp_ms" })
        .notNull()
        .$default(() => new Date()),
    expirationTimestamp: o.integer({ mode: "timestamp_ms" }).notNull(),
    userId: o
        .text()
        .references(() => usersTable.id)
        .notNull(),
})
export type UserSession = typeof userSessionsTable.$inferSelect
export type InsertableUserSession = typeof userSessionsTable.$inferInsert
