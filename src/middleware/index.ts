import { sequence } from "astro:middleware"
import authenticate from "./authenticate"

export const onRequest = sequence(authenticate)
