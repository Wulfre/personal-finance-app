// @ts-check

import cloudflare from "@astrojs/cloudflare"
import tailwind from "@astrojs/tailwind"
import { defineConfig } from "astro/config"

export default defineConfig({
	output: "server",
	adapter: cloudflare({
		platformProxy: {
			enabled: true,
			experimentalJsonConfig: true,
		},
		imageService: "passthrough",
	}),
	integrations: [tailwind()],
})
