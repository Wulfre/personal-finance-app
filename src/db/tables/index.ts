import { userSessionsTable } from "./user-sessions"
import { usersTable } from "./users"

export const schema = {
    users: usersTable,
    userSessions: userSessionsTable,
}
