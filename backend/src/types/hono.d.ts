import type { User } from "@prisma/client"

declare module "hono" {
  interface ContextVariableMap {
    user: Pick<User, "id" | "email">
  }
}
