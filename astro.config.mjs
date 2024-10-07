// @ts-check

import cloudflare from "@astrojs/cloudflare"
import preact from "@astrojs/preact"
import tailwind from "@tailwindcss/vite"
import { defineConfig } from "astro/config"

export default defineConfig({
    output: "server",
    adapter: cloudflare({
        platformProxy: {
            enabled: true,
        },
    }),
    security: {
        checkOrigin: true,
    },
    integrations: [preact()],
    vite: {
        plugins: [tailwind()],
    },
})
