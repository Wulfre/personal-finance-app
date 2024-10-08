import { defineMiddleware } from "astro:middleware"
import type { UserSession } from "~/actions/auth/sign-in"
import { sessionTtlSecs } from "~/actions/auth/sign-in"

export default defineMiddleware(async (context, next) => {
    const sessionId = context.cookies.get("sessionId")?.value ?? null
    const userId = context.cookies.get("userId")?.value ?? null

    const clearSession = () => {
        context.cookies.delete("sessionId")
        context.cookies.delete("userId")
        context.locals.session = null
    }

    if (!sessionId || !userId) {
        clearSession()
        return next()
    }

    const serializedSessionData = await context.locals.runtime.env.KV.get(
        `user:${userId}:session:${sessionId}`,
    )

    if (!serializedSessionData) {
        clearSession()
        return next()
    }

    const sessionData = JSON.parse(serializedSessionData) as UserSession

    if (
        sessionData.lastRefreshTimestamp &&
        Date.now() - sessionData.lastRefreshTimestamp >
            1000 * sessionTtlSecs * 0.5
    ) {
        sessionData.lastRefreshTimestamp = Date.now()

        await context.locals.runtime.env.KV.put(
            `user:${userId}:session:${sessionId}`,
            JSON.stringify(sessionData),
            { expirationTtl: sessionTtlSecs },
        )
    }

    context.locals.session = sessionData
    return next()
})
