import { scrypt } from "@noble/hashes/scrypt"
import { bytesToHex } from "@noble/hashes/utils"
import { ulid } from "@std/ulid"
import { defineAction } from "astro:actions"
import { z } from "astro:schema"
import type { Auth, UserSession } from "./common"
import { scryptConfig, sessionTtlSecs } from "./common"

export default defineAction({
    accept: "form",
    input: z.object({
        username: z.string(),
        password: z.string(),
    }),
    handler: async (input, context) => {
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
        })

        context.cookies.set("sessionId", sessionId, {
            httpOnly: true,
            sameSite: "lax",
        })
    },
})
