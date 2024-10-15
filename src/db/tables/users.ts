import { ulid } from "@std/ulid"
import * as o from "drizzle-orm/sqlite-core"

export const usersTable = o.sqliteTable("users", {
    id: o.text().primaryKey().$default(ulid),
    username: o.text().unique().notNull(),
    passwordHash: o.text().notNull(),
})
export type User = typeof usersTable.$inferSelect
export type InsertableUser = typeof usersTable.$inferInsert
