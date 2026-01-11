export type ParsedTransaction = {
    description: string
    amount: number
    currency: string
    date: Date
    confidence: number
  }
  
  export function parseTransaction(rawText: string): ParsedTransaction {
    const text = rawText ?? ""
  
    let confidence = 0
    let description = "Unknown"
    let amount = 0
    let currency = "INR"
    let date = new Date()
  
    // ---------- DATE ----------
    const datePatterns = [
      /\b\d{2}\s[A-Za-z]{3}\s\d{4}\b/, // 11 Dec 2025
      /\b\d{2}\/\d{2}\/\d{4}\b/,       // 12/11/2025
      /\b\d{4}-\d{2}-\d{2}\b/,         // 2025-12-10
    ]
  
    for (const pattern of datePatterns) {
      const match = text.match(pattern)
      if (match) {
        date = new Date(match[0])
        confidence += 0.25
        break
      }
    }
  
    // ---------- AMOUNT ----------
    const amountMatch = text.match(/₹?\s*(-?\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/)
    if (amountMatch) {
      amount = Number(amountMatch[1].replace(/,/g, ""))
      confidence += 0.25
    }
  
    // ---------- DESCRIPTION ----------
    const descriptionPatterns = [
      /Description:\s*(.+)/i,
      /(STARBUCKS.+)/i,
      /(Uber Ride.+)/i,
      /(Amazon\.in.+Order)/i,
    ]
  
    for (const pattern of descriptionPatterns) {
      const match = text.match(pattern)
      if (match) {
        description = match[1].trim()
        confidence += 0.25
        break
      }
    }
  
    // ---------- CURRENCY ----------
    if (text.includes("₹")) {
      currency = "INR"
      confidence += 0.25
    }
  
    return {
      description,
      amount,
      currency,
      date,
      confidence: Math.min(confidence, 1),
    }
  }
  