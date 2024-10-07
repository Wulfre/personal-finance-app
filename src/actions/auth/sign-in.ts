import { scrypt } from "@noble/hashes/scrypt"
import { bytesToHex } from "@noble/hashes/utils"
import { ulid } from "@std/ulid"
import { defineAction } from "astro:actions"
import { z } from "astro:schema"
import { dequal } from "dequal"
import { reduceDuration } from "~/utils/time"
import type { Auth, UserSession } from "./common"
import { scryptConfig } from "./common"

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
        const originalAuthData = structuredClone(authData)

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
        }

        if (!dequal(authData, originalAuthData)) {
            await context.locals.runtime.env.KV.put(
                `auth:${input.username}`,
                JSON.stringify(authData),
            )
        }

        // create session
        const sessionId = ulid()
        const sessionData = {} satisfies UserSession

        await context.locals.runtime.env.KV.put(
            `user:${authData.userId}:session:${sessionId}`,
            JSON.stringify(sessionData),
            { expirationTtl: reduceDuration({ minutes: 15 }, "seconds") },
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
