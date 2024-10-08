/// <reference path="../.astro/types.d.ts" />

type Runtime = import("@astrojs/cloudflare").Runtime<Env>

declare namespace App {
    interface Locals extends Runtime {
        session: import("~/actions/auth/sign-in").UserSession | null | undefined
    }
}
