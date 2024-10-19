declare namespace App {
    interface Locals {
        session: import("~/middleware/authenticate").LocalSessionData
        user: import("~/middleware/authenticate").LocalUserData
    }
}
