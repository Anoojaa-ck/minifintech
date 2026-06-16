import { Info } from 'lucide-react'

interface InsightProps {
  summary: {
    totalIncome: number
    totalExpense: number
    topCategory: string
    categoryBreakdown: Record<string, number>
  }
}

export default function InsightBanner({ summary }: InsightProps) {
  const insights: { text: string; type: 'info' | 'warning' | 'success' }[] = []

  if (summary.totalIncome === 0 && summary.totalExpense === 0) {
    insights.push({ text: "Welcome! Start by adding your first transaction to see financial insights.", type: 'info' })
  } else {
    if (summary.totalExpense > summary.totalIncome && summary.totalIncome > 0) {
      insights.push({ text: "Your expenses have exceeded your income. Consider reviewing your spending.", type: 'warning' })
    } else if (summary.totalIncome > summary.totalExpense && summary.totalExpense > 0) {
      insights.push({ text: "Your net balance is positive for this period.", type: 'success' })
    }

    if (summary.topCategory !== 'None' && summary.topCategory !== 'Salary') {
      const pct = Math.round((summary.categoryBreakdown[summary.topCategory] / summary.totalExpense) * 100)
      insights.push({ text: `${summary.topCategory} is your top expense category, making up ${pct}% of your spending.`, type: 'info' })
    }

    const expenseCategories = Object.entries(summary.categoryBreakdown)
      .filter(([cat]) => cat !== 'Salary')
      .sort((a, b) => b[1] - a[1])

    if (expenseCategories.length >= 2 && summary.totalExpense > 0) {
      const topTwoSum = expenseCategories[0][1] + expenseCategories[1][1]
      const topTwoPercent = Math.round((topTwoSum / summary.totalExpense) * 100)
      if (topTwoPercent > 50) {
        insights.push({ text: `${expenseCategories[0][0]} and ${expenseCategories[1][0]} account for ${topTwoPercent}% of your total spending.`, type: 'warning' })
      }
    }

    if (insights.length === 0) {
      insights.push({ text: "Keep tracking your transactions to receive more insights.", type: 'info' })
    }
  }

  const overallType = insights.some(i => i.type === 'warning') ? 'warning' : insights.some(i => i.type === 'success') ? 'success' : 'info'

  const styles = {
    info: { bg: 'rgba(37, 99, 235, 0.05)', color: 'var(--primary)', border: 'var(--primary)' },
    warning: { bg: 'rgba(239, 68, 68, 0.05)', color: 'var(--error)', border: 'var(--error)' },
    success: { bg: 'rgba(16, 185, 129, 0.05)', color: 'var(--success)', border: 'var(--success)' }
  }

  const activeStyle = styles[overallType]

  return (
    <div className="card" style={{ 
      padding: '1.25rem', 
      marginBottom: '2rem', 
      background: activeStyle.bg, 
      borderLeft: `4px solid ${activeStyle.color}`,
      color: activeStyle.color,
      boxShadow: 'none'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <Info size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Insights</div>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {insights.map((item, i) => (
              <li key={i} style={{ lineHeight: 1.5, color: item.type === 'warning' ? 'var(--error)' : item.type === 'success' ? 'var(--success)' : 'var(--primary)' }}>
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
