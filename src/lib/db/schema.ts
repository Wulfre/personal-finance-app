import { sqliteTable } from "drizzle-orm/sqlite-core"

export const usersTable = sqliteTable("users", {})

export type User = typeof usersTable.$inferSelect
export type InsertUser = typeof usersTable.$inferInsert
