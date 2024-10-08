import { defineAction } from "astro:actions"
import { z } from "astro:schema"
import type { ScryptOpts } from "@noble/hashes/scrypt"
import { scrypt } from "@noble/hashes/scrypt"
import { bytesToHex, randomBytes } from "@noble/hashes/utils"
import { ulid } from "@std/ulid"
import type { Nullable } from "~/utils/types"

type Auth = Nullable<{
    passwordHash: string
    passwordSalt: string
    userId: string
}>

export type UserSession = Nullable<{
    lastRefreshTimestamp: number
}>

const scryptConfig = {
    N: 2 ** 16,
    r: 8,
    p: 1,
    dkLen: 32,
} satisfies ScryptOpts

export const sessionTtlSecs = 60 * 15

export default defineAction({
    accept: "form",
    input: z.object({
        username: z.string(),
        password: z.string(),
        action: z.string(),
    }),
    handler: async (input, context) => {
        if (input.action === "register") {
            const existingAuthData = await context.locals.runtime.env.KV.get(
                `auth:${input.username}`,
            )

            if (existingAuthData) {
                throw new Error("username already exists")
            }

            const salt = bytesToHex(randomBytes(16))
            const hash = bytesToHex(scrypt(input.password, salt, scryptConfig))

            const authData = {
                passwordHash: hash,
                passwordSalt: salt,
                userId: ulid(),
            } satisfies Auth

            await context.locals.runtime.env.KV.put(
                `auth:${input.username}`,
                JSON.stringify(authData),
            )
        }

        // sign in logic starts here

        const serialAuthData = await context.locals.runtime.env.KV.get(
            `auth:${input.username}`,
        )

        if (!serialAuthData) {
            throw new Error("invalid username")
        }

        const authData = JSON.parse(serialAuthData) as Auth

        if (!authData.passwordHash || !authData.passwordSalt) {
            throw new Error("invalid user")
        }

        const isValid =
            bytesToHex(
                scrypt(input.password, authData.passwordSalt, scryptConfig),
            ) === authData.passwordHash

        if (!isValid) {
            throw new Error("invalid password")
        }

        if (!authData.userId) {
            authData.userId = ulid()

            await context.locals.runtime.env.KV.put(
                `auth:${input.username}`,
                JSON.stringify(authData),
            )
        }

        const sessionId = ulid()
        const sessionData = {
            lastRefreshTimestamp: Date.now(),
        } satisfies UserSession

        await context.locals.runtime.env.KV.put(
            `user:${authData.userId}:session:${sessionId}`,
            JSON.stringify(sessionData),
            { expirationTtl: sessionTtlSecs },
        )

        context.cookies.set("userId", authData.userId, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
        })

        context.cookies.set("sessionId", sessionId, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
        })
    },
})
