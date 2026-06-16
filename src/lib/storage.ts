export interface Transaction {
  id: string
  amount: number
  category: string
  type: string
  date: Date
  note: string | null
  createdAt: Date
}

const STORAGE_KEY = 'transactions'

function read(): Transaction[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return parsed.map((t: Record<string, string | number>) => ({
      ...t,
      date: new Date(t.date as string),
      createdAt: new Date(t.createdAt as string),
    }))
  } catch {
    return []
  }
}

function write(transactions: Transaction[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
}

export function getAllTransactions(): Transaction[] {
  return read()
}

export function addTransaction(transaction: Transaction): void {
  const transactions = read()
  transactions.push(transaction)
  write(transactions)
}

export function deleteTransaction(id: string): void {
  const transactions = read().filter((t) => t.id !== id)
  write(transactions)
}
