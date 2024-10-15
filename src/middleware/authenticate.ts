import { defineMiddleware } from "astro:middleware"
import { sessionTtlMs } from "~/actions/auth/sign-in"
import { db } from "~/db"

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

    const sessionData = await db.query.userSessions.findFirst({
        where: (table, d) => d.eq(table.id, sessionId),
    })

    if (!sessionData) {
        clearSession()
        return next()
    }

    if (
        sessionData.lastRefreshTimestamp &&
        Date.now() - sessionData.lastRefreshTimestamp.getDate() >
            sessionTtlMs * 0.5
    ) {
        sessionData.lastRefreshTimestamp = new Date()
        sessionData.expirationTimestamp = new Date(Date.now() + sessionTtlMs)

        await db
            .insert(db._.fullSchema.userSessions)
            .values(sessionData)
            .onConflictDoUpdate({
                target: db._.fullSchema.userSessions.id,
                set: sessionData,
            })
    }

    context.locals.session = sessionData
    return next()
})
