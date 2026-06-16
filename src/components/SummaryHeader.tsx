import { ArrowUpCircle, ArrowDownCircle, TrendingUp } from 'lucide-react'

interface SummaryProps {
  data: {
    totalIncome: number
    totalExpense: number
    netBalance: number
    topCategory: string
  }
}

export default function SummaryHeader({ data }: SummaryProps) {
  const cards = [
    {
      title: 'Net Balance',
      value: data.netBalance,
      icon: null,
      color: 'var(--primary)',
    },
    {
      title: 'Total Income',
      value: data.totalIncome,
      icon: <ArrowUpCircle size={20} />,
      color: 'var(--success)',
    },
    {
      title: 'Total Expenses',
      value: data.totalExpense,
      icon: <ArrowDownCircle size={20} />,
      color: 'var(--error)',
    },
    {
      title: 'Top Category',
      value: data.topCategory,
      icon: <TrendingUp size={20} />,
      color: 'var(--secondary)',
      isCurrency: false,
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
      {cards.map((card, i) => (
        <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{card.title}</span>
            <div style={{ color: card.color }}>{card.icon}</div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {card.isCurrency === false ? card.value : `₹${card.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          </div>
        </div>
      ))}
    </div>
  )
}
