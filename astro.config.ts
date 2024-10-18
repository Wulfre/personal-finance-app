import node from "@astrojs/node"
import preact from "@astrojs/preact"
import unocss from "@unocss/astro"
import { defineConfig } from "astro/config"

export default defineConfig({
    output: "server",
    adapter: node({ mode: "standalone" }),
    integrations: [preact(), unocss({ injectReset: true })],
})
