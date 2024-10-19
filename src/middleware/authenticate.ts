import { defineMiddleware } from "astro:middleware"
import { sessionTtlMs } from "~/actions/auth/sign-in"
import { db } from "~/db"

const getSessionData = async (sessionId: string) =>
    db.query.userSessions.findFirst({
        where: (table, d) => d.eq(table.id, sessionId),
    })
export type LocalSessionData = Awaited<ReturnType<typeof getSessionData>>

const getUserData = async (userId: string) =>
    db.query.users.findFirst({
        columns: { passwordHash: false },
        where: (table, d) => d.eq(table.id, userId),
    })
export type LocalUserData = Awaited<ReturnType<typeof getUserData>>

export default defineMiddleware(async (context, next) => {
    const clearSession = () => {
        context.cookies.delete("sessionId")
        context.cookies.delete("userId")
        context.locals.session = undefined
        context.locals.user = undefined
    }

    const sessionId = context.cookies.get("sessionId")?.value
    const userId = context.cookies.get("userId")?.value

    if (!sessionId || !userId) {
        clearSession()
        return next()
    }

    const sessionData = await getSessionData(sessionId)
    const userData = await getUserData(userId)

    if (!sessionData || !userData) {
        clearSession()
        return next()
    }

    // TODO: check if session is expired

    if (
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
    context.locals.user = userData
    return next()
})
