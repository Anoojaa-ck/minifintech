import {
  type Transaction,
  getAllTransactions as getStored,
  addTransaction as addStored,
  deleteTransaction as deleteStored,
} from '@/lib/storage'

export function addTransaction(formData: FormData) {
  const amount = parseFloat(formData.get('amount') as string)
  let category = (formData.get('category') as string).trim()
  category = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()

  const type = formData.get('type') as string
  const date = new Date(formData.get('date') as string)
  const note = formData.get('note') as string || null

  addStored({
    id: crypto.randomUUID(),
    amount,
    category,
    type,
    date,
    note,
    createdAt: new Date(),
  })
}

export function deleteTransaction(id: string) {
  deleteStored(id)
}

export function getTransactions(filters: { category?: string; startDate?: string; endDate?: string } = {}) {
  const { category, startDate, endDate } = filters
  let transactions = getStored()

  if (category && category !== 'All') {
    transactions = transactions.filter((t) => t.category === category)
  }

  if (startDate) {
    const start = new Date(startDate)
    transactions = transactions.filter((t) => t.date >= start)
  }

  if (endDate) {
    const end = new Date(endDate + 'T23:59:59')
    transactions = transactions.filter((t) => t.date <= end)
  }

  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime())
}

export function getSummary() {
  const transactions = getStored()

  let totalIncome = 0
  let totalExpense = 0
  const categoryMap: Record<string, number> = {}

  for (const t of transactions) {
    if (t.type === 'INCOME') {
      totalIncome += t.amount
    } else {
      totalExpense += t.amount
      const normalizedCat = t.category.charAt(0).toUpperCase() + t.category.slice(1).toLowerCase()
      categoryMap[normalizedCat] = (categoryMap[normalizedCat] || 0) + t.amount
    }
  }

  let topCategory = 'None'
  let maxSpend = 0

  for (const [cat, spend] of Object.entries(categoryMap)) {
    if (spend > maxSpend) {
      maxSpend = spend
      topCategory = cat
    }
  }

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    topCategory,
    categoryBreakdown: categoryMap,
  }
}
