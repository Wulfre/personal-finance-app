import { defineAction } from "astro:actions"
import { z } from "astro:schema"

export default defineAction({
    accept: "form",
    input: z.object({}),
    handler: async (_input, context) => {
        const sessionId = context.cookies.get("sessionId")?.value ?? null
        const userId = context.cookies.get("userId")?.value ?? null

        if (!sessionId || !userId) {
            return
        }

        context.cookies.delete("sessionId")
        context.cookies.delete("userId")

        await context.locals.runtime.env.KV.delete(
            `user:${userId}:session:${sessionId}`,
        )
    },
})
