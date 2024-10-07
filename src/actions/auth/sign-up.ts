import { scrypt } from "@noble/hashes/scrypt"
import { bytesToHex, randomBytes } from "@noble/hashes/utils"
import { ulid } from "@std/ulid"
import { defineAction } from "astro:actions"
import { z } from "astro:schema"
import type { Auth } from "./common"
import { scryptConfig } from "./common"

export default defineAction({
    accept: "form",
    input: z.object({
        username: z.string(),
        password: z.string(),
        confirmPassword: z.string(),
    }),
    handler: async (input, context) => {
        if (input.password !== input.confirmPassword) {
            throw new Error("passwords do not match")
        }

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
    },
})
