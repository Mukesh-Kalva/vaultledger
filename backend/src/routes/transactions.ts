import { Hono } from "hono"
import { requireAuth } from "../auth/get-user"
import { parseTransaction } from "../lib/parser"
import { prisma } from "../lib/prisma"

export const transactionsRoute = new Hono()

/**
 * POST /api/transactions/extract
 */
transactionsRoute.post("/extract", requireAuth, async (c) => {
  const user = c.get("user")

  const body = await c.req.json<{ text?: string }>()

  // ✅ Validate request body
  if (!body.text || body.text.trim().length === 0) {
    return c.json(
      { error: "text is required" },
      400
    )
  }

  // ✅ Parse transaction safely
  const parsed = parseTransaction(body.text)

  // ✅ Save to DB
  const transaction = await prisma.transaction.create({
    data: {
      description: parsed.description,
      amount: parsed.amount,
      currency: parsed.currency,
      date: parsed.date,
      confidence: parsed.confidence,
      rawText: body.text,
      user: {
        connect: { id: user.id },
      },
    },
  })

  return c.json(transaction)
})

/**
 * GET /api/transactions
 */
transactionsRoute.get("/", requireAuth, async (c) => {
  const user = c.get("user")

  const transactions = await prisma.transaction.findMany({
    where: {
      user: {
        id: user.id,
      },
    },
    orderBy: { date: "desc" },
  })

  return c.json(transactions)
})
