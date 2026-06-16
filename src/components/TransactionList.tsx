'use client'

import { useState } from 'react'
import { Calendar, Tag, Trash2, Download, ChevronDown, ChevronRight } from 'lucide-react'
import { deleteTransaction } from '@/actions/transactions'

interface Transaction {
  id: string
  amount: number
  category: string
  type: string
  date: Date
  note: string | null
}

interface ListProps {
  transactions: Transaction[]
  onAction?: () => void
}

export default function TransactionList({ transactions, onAction }: ListProps) {
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showTransactions, setShowTransactions] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const categories = ['All', ...Array.from(new Set(transactions.map(t => t.category)))]

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return
    setIsDeleting(id)
    try {
      deleteTransaction(id)
      onAction?.()
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Failed to delete transaction.')
    } finally {
      setIsDeleting(null)
    }
  }

  const filteredTransactions = transactions.filter(t => {
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter
    const tDate = new Date(t.date)
    const matchesStartDate = !startDate || tDate >= new Date(startDate + 'T00:00:00')
    const matchesEndDate = !endDate || tDate <= new Date(endDate + 'T23:59:59')
    return matchesCategory && matchesStartDate && matchesEndDate
  })

  const downloadCSV = () => {
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Note']
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        t.type,
        t.category,
        t.amount,
        `"${(t.note || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <div 
        onClick={() => setShowTransactions(!showTransactions)}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {showTransactions ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Recent Transactions</h3>
        </div>
      </div>

      {showTransactions && (
        <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            onClick={downloadCSV}
            className="btn btn-outline"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}
            title="Download CSV"
          >
            <Download size={16} />
            <span>Export</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--background)', padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <Tag size={16} color="var(--text-secondary)" />
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.875rem', cursor: 'pointer', color: 'var(--text-primary)' }}
            >
              {categories.map(cat => <option key={cat} value={cat} style={{ background: 'var(--surface)' }}>{cat}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--background)', padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <Calendar size={16} color="var(--text-secondary)" />
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.875rem' }}
            />
            <span style={{ color: 'var(--text-secondary)' }}>-</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.875rem' }}
            />
          </div>
        </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Date</th>
              <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Category</th>
              <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Note</th>
              <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>Amount</th>
              <th style={{ padding: '0.75rem 0.5rem', width: '50px' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem 0.5rem' }}>{new Date(t.date).toLocaleDateString()}</td>
                <td style={{ padding: '1rem 0.5rem' }}>
                  <span style={{ 
                    padding: '0.2rem 0.6rem', 
                    borderRadius: '6px', 
                    background: t.type === 'INCOME' ? 'rgba(16, 185, 129, 0.1)' : 'var(--background)', 
                    color: t.type === 'INCOME' ? 'var(--success)' : 'var(--text-primary)',
                    border: '1px solid var(--border)',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    {t.category}
                  </span>
                </td>
                <td style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }}>{t.note || '-'}</td>
                <td style={{ padding: '1rem 0.5rem', textAlign: 'right', fontWeight: 600, color: t.type === 'INCOME' ? 'var(--success)' : 'var(--text-primary)' }}>
                  {t.type === 'INCOME' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                  <button 
                    onClick={() => handleDelete(t.id)}
                    disabled={isDeleting === t.id}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--error)', 
                      cursor: 'pointer',
                      padding: '0.4rem',
                      borderRadius: '4px',
                      opacity: isDeleting === t.id ? 0.5 : 1,
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    title="Delete Transaction"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No transactions found matching the filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
        </>
      )}
    </div>
  )
}
