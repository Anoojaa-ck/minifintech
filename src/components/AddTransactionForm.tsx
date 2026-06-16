'use client'

import { useState, useRef } from 'react'
import { addTransaction } from '@/actions/transactions'
import { Plus } from 'lucide-react'

export default function AddTransactionForm() {
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!formRef.current) return

    setLoading(true)
    const formData = new FormData(formRef.current)
    try {
      await addTransaction(formData)
      formRef.current.reset()
    } catch (error) {
      console.error('Failed to add transaction:', error)
      alert('Error adding transaction. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.125rem' }}>
        <Plus size={20} color="var(--primary)" />
        Add Transaction
      </h3>
      <form 
        ref={formRef}
        onSubmit={handleSubmit} 
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Amount (₹)</label>
          <input 
            name="amount" 
            type="number" 
            step="0.01" 
            required 
            placeholder="0.00"
            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-primary)', outline: 'none' }}
          />
        </div>
        
        <div className="form-grid">
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Type</label>
            <select name="type" required style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-primary)', outline: 'none' }}>
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Category</label>
            <input 
              name="category" 
              type="text" 
              required 
              placeholder="e.g. Food"
              style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Date</label>
          <input 
            name="date" 
            type="date" 
            required 
            defaultValue={new Date().toISOString().split('T')[0]}
            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-primary)', outline: 'none' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Note (Optional)</label>
          <textarea 
            name="note" 
            placeholder="What was this for?"
            rows={2}
            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-primary)', resize: 'none', outline: 'none' }}
          ></textarea>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', marginTop: '0.5rem' }}>
          {loading ? 'Processing...' : 'Save Transaction'}
        </button>
      </form>
    </div>
  )
}
