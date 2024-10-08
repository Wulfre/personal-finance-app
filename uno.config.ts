import {
    defineConfig,
    presetUno,
    presetIcons,
    presetWebFonts,
    transformerVariantGroup,
} from "unocss"

export default defineConfig({
    presets: [
        presetUno(),
        presetIcons(),
        presetWebFonts({
            fonts: {
                sans: "Atkinson Hyperlegible",
                mono: "Source Code Pro",
            },
        }),
    ],
    transformers: [transformerVariantGroup()],
    theme: {
        colors: {
            "paper-neutral": "hsl(35, 8%, 35%)",
            "paper-neutral-muted": "hsl(35, 15%, 50%)",
            "paper-neutral-bg": "hsl(35, 36%, 95%)",
            "paper-orange": "hsl(35, 15%, 31%)",
            "paper-orange-muted": "hsl(35, 22%, 48%)",
            "paper-orange-bg": "hsla(35, 100%, 47%, 0.18)",
            "paper-green": "hsl(71, 12%, 30%)",
            "paper-green-muted": "hsl(71, 19%, 45%)",
            "paper-green-bg": "hsla(78, 100%, 37%, 0.19)",
            "paper-teal": "hsl(161, 12%, 31%)",
            "paper-teal-muted": "hsl(161, 19%, 46%)",
            "paper-teal-bg": "hsla(172, 100%, 37%, 0.15)",
            "paper-blue": "hsl(220, 12%, 34%)",
            "paper-blue-muted": "hsl(220, 19%, 54%)",
            "paper-blue-bg": "hsla(220, 100%, 73%, 0.2)",
            "paper-purple": "hsl(300, 12%, 34%)",
            "paper-purple-muted": "hsl(300, 17%, 53%)",
            "paper-purple-bg": "hsla(282, 100%, 68%, 0.15)",
        },
    },
})
