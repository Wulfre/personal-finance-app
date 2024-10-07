import type { ScryptOpts } from "@noble/hashes/scrypt"
import type { Nullable } from "~/utils/types"

export type Auth = Nullable<{
    passwordHash: string
    passwordSalt: string
    userId: string
}>

export type UserSession = Nullable<{
    lastRefreshTimestamp: number
}>

export const scryptConfig = {
    N: 2 ** 16,
    r: 8,
    p: 1,
    dkLen: 32,
} satisfies ScryptOpts

export const sessionTtlSecs = 60 * 15
