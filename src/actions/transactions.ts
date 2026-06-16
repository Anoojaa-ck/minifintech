'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

export async function addTransaction(formData: FormData) {
  const amount = parseFloat(formData.get('amount') as string)
  let category = (formData.get('category') as string).trim()
  // Normalize to Title Case (e.g., "food" -> "Food")
  category = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
  
  const type = formData.get('type') as string
  const date = new Date(formData.get('date') as string)
  const note = formData.get('note') as string || null

  await prisma.transaction.create({
    data: {
      amount,
      category,
      type,
      date,
      note,
    },
  })

  revalidatePath('/')
}

export async function deleteTransaction(id: string) {
  await prisma.transaction.delete({
    where: { id },
  })
  revalidatePath('/')
}

export async function getTransactions(filters: { category?: string, startDate?: string, endDate?: string } = {}) {
  const { category, startDate, endDate } = filters
  
  const where: Prisma.TransactionWhereInput = {}
  
  if (category && category !== 'All') {
    // Casing is handled by Title Case normalization in addTransaction
    where.category = category
  }
  
  if (startDate || endDate) {
    const dateFilter: Prisma.DateTimeFilter = {}
    if (startDate) dateFilter.gte = new Date(startDate)
    if (endDate) dateFilter.lte = new Date(endDate)
    where.date = dateFilter
  }

  return await prisma.transaction.findMany({
    where,
    orderBy: {
      date: 'desc',
    },
  })
}

export async function getSummary() {
  const transactions = await prisma.transaction.findMany()
  
  let totalIncome = 0
  let totalExpense = 0
  const categoryMap: Record<string, number> = {}

  transactions.forEach((t) => {
    if (t.type === 'INCOME') {
      totalIncome += t.amount
    } else {
      totalExpense += t.amount
      // Ensure existing data is grouped correctly regardless of initial casing
      const normalizedCat = t.category.charAt(0).toUpperCase() + t.category.slice(1).toLowerCase()
      categoryMap[normalizedCat] = (categoryMap[normalizedCat] || 0) + t.amount
    }
  })

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
