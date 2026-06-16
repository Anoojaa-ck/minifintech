'use client'

interface ChartProps {
  data: Record<string, number>
}

export default function CategoryChart({ data }: ChartProps) {
  const categories = Object.entries(data).sort((a, b) => b[1] - a[1])
  const totalSpend = Object.values(data).reduce((sum, val) => sum + val, 0)

  // Colors for the pie slices
  const colors = [
    '#2563eb', // Blue
    '#10b981', // Green
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#64748b', // Slate
  ]

  // Helper to calculate SVG path for a pie slice
  function getCoordinatesForPercent(percent: number) {
    const x = Math.cos(2 * Math.PI * percent)
    const y = Math.sin(2 * Math.PI * percent)
    return [x, y]
  }

  let cumulativePercent = 0

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem', fontWeight: 600 }}>Spending Breakdown (%)</h3>
      
      {categories.length === 0 ? (
        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Add some expenses to see the breakdown.
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* SVG Pie Chart */}
          <div style={{ position: 'relative', width: '200px', height: '200px' }}>
            <svg viewBox="-1 -1 2 2" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
              {(() => {
                let cumulative = 0
                return categories.map(([category, amount], index) => {
                  const percent = amount / totalSpend
                  const [startX, startY] = getCoordinatesForPercent(cumulative)
                  cumulative += percent
                  const [endX, endY] = getCoordinatesForPercent(cumulative)
                  
                  const largeArcFlag = percent > 0.5 ? 1 : 0
                  const pathData = [
                    `M ${startX} ${startY}`,
                    `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                    `L 0 0`,
                  ].join(' ')

                  return (
                    <path
                      key={category}
                      d={pathData}
                      fill={colors[index % colors.length]}
                      style={{ transition: 'all 0.3s' }}
                    />
                  )
                })
              })()}
            </svg>
            {/* Inner circle for "Donut" style (optional, looks more modern) */}
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              width: '50%', 
              height: '50%', 
              background: 'var(--surface)', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
            }}>
               <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Total</span>
            </div>
          </div>

          {/* Legend */}
          <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {categories.map(([category, amount], index) => {
              const percentage = Math.round((amount / totalSpend) * 100)
              return (
                <div key={category} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: colors[index % colors.length] }} />
                    <span style={{ fontWeight: 600 }}>{category}</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    {percentage}% (₹{amount.toLocaleString('en-IN')})
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
