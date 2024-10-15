import { defineAction } from "astro:actions"
import { z } from "astro:schema"
import { hash as createHash, verify as verifyHash } from "@node-rs/argon2"
import { ulid } from "@std/ulid"
import { db } from "~/db"
import type { InsertableUserSession } from "~/db/tables/user-sessions"
import type { InsertableUser } from "~/db/tables/users"

export const sessionTtlMs = 60 * 15 * 1000

export default defineAction({
    accept: "form",
    input: z.object({
        username: z.string(),
        password: z.string(),
        action: z.string(),
    }),
    handler: async (input, context) => {
        if (input.action === "register") {
            const existingAuthData = await db.query.users.findFirst({
                where: (table, d) => d.eq(table.username, input.username),
            })

            if (existingAuthData) {
                throw new Error("username already exists")
            }

            const hash = await createHash(input.password)

            const userData = {
                username: input.username,
                passwordHash: hash,
            } satisfies InsertableUser

            await db.insert(db._.fullSchema.users).values(userData)
        }

        // sign in logic starts here

        const authData = await db.query.users.findFirst({
            where: (table, d) => d.eq(table.username, input.username),
        })

        if (!authData) {
            throw new Error("invalid username")
        }

        const isValid = verifyHash(authData.passwordHash, input.password)

        if (!isValid) {
            throw new Error("invalid password")
        }

        const sessionData = {
            id: ulid(),
            expirationTimestamp: new Date(Date.now() + sessionTtlMs),
            userId: authData.id,
        } satisfies InsertableUserSession

        await db.insert(db._.fullSchema.userSessions).values(sessionData)

        context.cookies.set("userId", authData.id, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
        })

        context.cookies.set("sessionId", sessionData.id, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
        })
    },
})
