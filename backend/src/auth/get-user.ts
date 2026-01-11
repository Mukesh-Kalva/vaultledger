// src/auth/get-user.ts
import type { Context, Next } from "hono"
import { auth } from "./better-auth"

export type AuthUser = {
  id: string
  email: string
}

export async function requireAuth(c: Context, next: Next) {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session || !session.user) {
    return c.json({ error: "Unauthorized" }, 401)
  }

  // attach user to context
  c.set("user", session.user as AuthUser)

  await next()
}
