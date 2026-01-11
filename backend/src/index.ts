// src/index.ts
import { Hono } from "hono"
import { serve } from "@hono/node-server"
import "dotenv/config"

import { authRoutes } from "./auth/routes"
import { transactionsRoute } from "./routes/transactions"

const app = new Hono()

app.get("/", (c) =>
  c.json({ message: "VaultLedger backend running 🚀" })
)

app.route("/api/auth", authRoutes)
app.route("/api/transactions", transactionsRoute)

serve({
  fetch: app.fetch,
  port: 3001,
})
