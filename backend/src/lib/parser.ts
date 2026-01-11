type ParsedTransaction = {
    description: string
    amount: number
    currency: string
    date: Date
    confidence: number
  }
  
  export function parseTransaction(text: string): ParsedTransaction {
    const cleanText = text.trim()
  
    // Patterns
    const amountMatch =
      cleanText.match(/₹\s?([\d,]+)/) ||
      cleanText.match(/INR\s?([\d,]+)/)
  
    const dateMatch =
      cleanText.match(/\d{4}-\d{2}-\d{2}/) ||
      cleanText.match(/\d{2}\/\d{2}\/\d{4}/) ||
      cleanText.match(/\d{1,2}\s[A-Za-z]{3}\s\d{4}/)
  
    const amount = amountMatch
      ? Number(amountMatch[1].replace(/,/g, ""))
      : 0
  
    let parsedDate = new Date()
    if (dateMatch) {
      parsedDate = new Date(dateMatch[0])
    }
  
    // Remove amount + date to get description
    let description = cleanText
      .replace(/₹\s?[\d,]+/, "")
      .replace(/INR\s?[\d,]+/, "")
      .replace(/on\s.+/, "")
      .replace(/-\s.+/, "")
      .trim()
  
    return {
      description: description || "Unknown Transaction",
      amount,
      currency: "INR",
      date: parsedDate,
      confidence: amount && dateMatch ? 0.9 : 0.6,
    }
  }
  