declare namespace App {
    interface Locals {
        session: import("~/actions/auth/sign-in").UserSession | null
    }
}
