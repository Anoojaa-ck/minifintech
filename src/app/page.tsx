import { getSummary, getTransactions } from '@/actions/transactions'
import SummaryHeader from '@/components/SummaryHeader'
import InsightBanner from '@/components/InsightBanner'
import TransactionList from '@/components/TransactionList'
import AddTransactionForm from '@/components/AddTransactionForm'
import CategoryChart from '@/components/CategoryChart'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const summary = await getSummary()
  const transactions = await getTransactions()

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>
          Financial Overview
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
          Welcome back! Here&apos;s what&apos;s happening with your money.
        </p>
      </div>

      <SummaryHeader data={summary} />
      
      <InsightBanner summary={summary} />

      <div className="dashboard-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <TransactionList transactions={transactions} />
          <CategoryChart data={summary.categoryBreakdown} />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <AddTransactionForm />
        </div>
      </div>
    </div>
  )
}
