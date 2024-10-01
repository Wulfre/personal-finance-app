// @ts-check

import cloudflare from "@astrojs/cloudflare"
import tailwind from "@tailwindcss/vite"
import { defineConfig } from "astro/config"

export default defineConfig({
	output: "server",
	adapter: cloudflare({
		platformProxy: {
			enabled: true,
			experimentalJsonConfig: true,
		},
	}),
	vite: {
		plugins: [tailwind()],
	},
})
