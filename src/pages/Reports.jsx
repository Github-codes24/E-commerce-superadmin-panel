import React, { useState, useEffect } from 'react'
import { TrendingUp, FileText, ShoppingBag, Store, Users, Package, UserCheck } from 'lucide-react'

function Reports() {
  const [hoveredMonth, setHoveredMonth] = useState(null)
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const stats = [
    {
      id: 'revenue',
      label: 'Total Revenue',
      value: '₹ 5,56,879',
      icon: TrendingUp,
      className: 'stat-revenue span-2',
    },
    {
      id: 'sales',
      label: 'Total Sales',
      value: '₹ 1,88,879',
      icon: FileText,
      className: 'stat-sales span-2',
    },
    {
      id: 'orders',
      label: 'Total Order',
      value: '506',
      icon: ShoppingBag,
      className: 'stat-order span-2',
    },
    {
      id: 'vendors',
      label: 'Active Vendors',
      value: '240',
      icon: UserCheck,
      className: 'stat-vendors span-3',
    },
    {
      id: 'customers',
      label: 'Active Customers',
      value: '1000',
      icon: UserCheck,
      className: 'stat-users span-3',
    },
  ]

  const [monthsData] = useState(() => {
    // The visual scale on the Y axis has gridlines:
    // y=200 is ₹0
    // y=170 is ₹1K
    // y=140 is ₹2K
    // y=110 is ₹3K
    // y=80 is ₹5K
    // y=50 is ₹10K
    // y=20 is ₹20K
    const getValY = (val) => {
      if (val <= 1000) {
        return 200 - (val / 1000) * 30
      } else if (val <= 2000) {
        return 170 - ((val - 1000) / 1000) * 30
      } else if (val <= 3000) {
        return 140 - ((val - 2000) / 1000) * 30
      } else if (val <= 5000) {
        return 110 - ((val - 3000) / 2000) * 30
      } else if (val <= 10000) {
        return 80 - ((val - 5000) / 5000) * 30
      } else {
        return 50 - ((val - 10000) / 10000) * 30
      }
    }

    const dataValues = [
      { name: 'Jan', thisYear: 1800, lastYear: 1200 },
      { name: 'Feb', thisYear: 2000, lastYear: 2000 },
      { name: 'Mar', thisYear: 1300, lastYear: 1950 },
      { name: 'Apr', thisYear: 1500, lastYear: 1900 },
      { name: 'May', thisYear: 1800, lastYear: 2800 },
      { name: 'Jun', thisYear: 3200, lastYear: 1400 },
      { name: 'Jul', thisYear: 3500, lastYear: 1300 },
      { name: 'Aug', thisYear: 4400, lastYear: 2100 },
      { name: 'Sep', thisYear: 2800, lastYear: 1800 },
      { name: 'Oct', thisYear: 2600, lastYear: 3100 },
      { name: 'Nov', thisYear: 3000, lastYear: 3300 },
      { name: 'Dec', thisYear: 3100, lastYear: 4200 },
    ]

    return dataValues.map((d, i) => {
      const cx = 65 + i * 45
      return {
        name: d.name,
        thisYear: d.thisYear,
        lastYear: d.lastYear,
        cx,
        cyThis: getValY(d.thisYear),
        cyLast: getValY(d.lastYear)
      }
    })
  })

  const [categoriesPaths] = useState(() => {
    const categories = [
      { name: 'Fashion', color: '#ff2d55', pct: 20 },
      { name: 'Home', color: '#00c7b1', pct: 15 },
      { name: 'Mobile', color: '#ffcc00', pct: 15 },
      { name: 'Beauty', color: '#00b0ff', pct: 25 },
      { name: 'Electronics', color: '#5e5ff5', pct: 25 }
    ]

    let currentAngle = Math.PI
    return categories.map((cat, i) => {
      const pct = cat.pct
      const angleSize = (pct / 100) * Math.PI
      const startAngle = currentAngle
      const endAngle = currentAngle - angleSize
      currentAngle = endAngle

      const xStart = (150 + 90 * Math.cos(startAngle)).toFixed(1)
      const yStart = (150 - 90 * Math.sin(startAngle)).toFixed(1)
      const xEnd = (150 + 90 * Math.cos(endAngle)).toFixed(1)
      const yEnd = (150 - 90 * Math.sin(endAngle)).toFixed(1)
      const d = `M ${xStart} ${yStart} A 90 90 0 0 1 ${xEnd} ${yEnd}`

      const midAngle = startAngle - angleSize / 2
      const badgeCx = Math.round(150 + 105 * Math.cos(midAngle))
      const badgeCy = Math.round(150 - 105 * Math.sin(midAngle))

      return {
        name: cat.name,
        color: cat.color,
        value: `${pct}%`,
        d,
        badgeCx,
        badgeCy
      }
    })
  })

  const getPathD = (points, key) => {
    let path = `M ${points[0].cx},${points[0][key]}`
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1]
      const p1 = points[i]
      const cpX1 = p0.cx + 22.5
      const cpY1 = p0[key]
      const cpX2 = p1.cx - 22.5
      const cpY2 = p1[key]
      path += ` C ${cpX1},${cpY1} ${cpX2},${cpY2} ${p1.cx},${p1[key]}`
    }
    return path
  }

  return (
    <div className="reports-view">
      {/* Stats Cards Row */}
      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.id} className={`stat-card ${stat.className}`}>
              <div className="stat-icon-wrapper">
                <Icon />
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="dashboard-grid-columns">
        {/* Revenue Overview Line Chart */}
        <div className="dashboard-card-panel">
          <div className="panel-header-row" style={{ borderBottom: '1px solid #f1f3f4', paddingBottom: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h2 className="panel-title" style={{ fontSize: '16px' }}>Revenue Overview</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', fontWeight: '500' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8bc34a' }} />
                  This year
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#42a5f5' }} />
                  Last year
                </span>
              </div>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="chart-container" style={{ position: 'relative', height: '280px', width: '100%' }}>
            <svg viewBox="0 0 600 240" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              {/* Grid Lines */}
              <line x1="45" y1="200" x2="570" y2="200" stroke="#f1f3f4" strokeWidth="1" />
              <line x1="45" y1="170" x2="570" y2="170" stroke="#f1f3f4" strokeWidth="1" />
              <line x1="45" y1="140" x2="570" y2="140" stroke="#f1f3f4" strokeWidth="1" />
              <line x1="45" y1="110" x2="570" y2="110" stroke="#f1f3f4" strokeWidth="1" />
              <line x1="45" y1="80" x2="570" y2="80" stroke="#f1f3f4" strokeWidth="1" />
              <line x1="45" y1="50" x2="570" y2="50" stroke="#f1f3f4" strokeWidth="1" />
              <line x1="45" y1="20" x2="570" y2="20" stroke="#f1f3f4" strokeWidth="1" />

              {/* Y-Axis Labels */}
              <text x="15" y="204" fill="#90a4ae" fontSize="10" fontWeight="500">₹0</text>
              <text x="15" y="174" fill="#90a4ae" fontSize="10" fontWeight="500">₹1K</text>
              <text x="15" y="144" fill="#90a4ae" fontSize="10" fontWeight="500">₹2K</text>
              <text x="15" y="114" fill="#90a4ae" fontSize="10" fontWeight="500">₹3K</text>
              <text x="15" y="84" fill="#90a4ae" fontSize="10" fontWeight="500">₹5K</text>
              <text x="10" y="54" fill="#90a4ae" fontSize="10" fontWeight="500">₹10K</text>
              <text x="10" y="24" fill="#90a4ae" fontSize="10" fontWeight="500">₹20K</text>

              {/* X-Axis Labels */}
              {monthsData.map((m) => (
                <text key={m.name} x={m.cx} y="222" fill="#90a4ae" fontSize="10" fontWeight="500" textAnchor="middle">
                  {m.name}
                </text>
              ))}

              {/* Last Year Dotted Blue Line Curve */}
              <path 
                d={getPathD(monthsData, 'cyLast')} 
                fill="none" 
                stroke="#42a5f5" 
                strokeWidth="2" 
                strokeDasharray="4,4" 
                style={{
                  strokeDasharray: '1000',
                  strokeDashoffset: animated ? '0' : '1000',
                  transition: 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />

              {/* This Year Solid Green Line Curve with gradient fill underneath */}
              <defs>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8bc34a" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#8bc34a" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path 
                d={getPathD(monthsData, 'cyThis')} 
                fill="none" 
                stroke="#8bc34a" 
                strokeWidth="3" 
                strokeLinecap="round"
                style={{
                  strokeDasharray: '1000',
                  strokeDashoffset: animated ? '0' : '1000',
                  transition: 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
              <path 
                d={`${getPathD(monthsData, 'cyThis')} L ${monthsData[monthsData.length - 1].cx},200 L ${monthsData[0].cx},200 Z`} 
                fill="url(#greenGrad)" 
                style={{
                  opacity: animated ? 1 : 0,
                  transition: 'opacity 2s ease-in-out',
                  transitionDelay: '0.5s'
                }}
              />

              {/* Hover Interactions */}
              {hoveredMonth !== null && (
                <g>
                  {/* Vertical Guide Line */}
                  <line 
                    x1={monthsData[hoveredMonth].cx} 
                    y1="30" 
                    x2={monthsData[hoveredMonth].cx} 
                    y2="200" 
                    stroke="#b0bec5" 
                    strokeWidth="1.5" 
                    strokeDasharray="3,3" 
                  />
                  {/* Circle Markers */}
                  <circle cx={monthsData[hoveredMonth].cx} cy={monthsData[hoveredMonth].cyThis} r="6" fill="#8bc34a" stroke="#ffffff" strokeWidth="2" />
                  <circle cx={monthsData[hoveredMonth].cx} cy={monthsData[hoveredMonth].cyLast} r="6" fill="#42a5f5" stroke="#ffffff" strokeWidth="2" />

                  {/* Tooltip Card */}
                  <g>
                    <rect 
                      x={monthsData[hoveredMonth].cx - 65} 
                      y={Math.min(monthsData[hoveredMonth].cyThis, monthsData[hoveredMonth].cyLast) - 60} 
                      width="130" 
                      height="50" 
                      rx="8" 
                      fill="#1e293b" 
                      stroke="#475569"
                      strokeWidth="1"
                      filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
                    />
                    <text 
                      x={monthsData[hoveredMonth].cx} 
                      y={Math.min(monthsData[hoveredMonth].cyThis, monthsData[hoveredMonth].cyLast) - 45} 
                      fill="#ffffff" 
                      fontSize="10" 
                      fontWeight="700" 
                      textAnchor="middle"
                    >
                      {monthsData[hoveredMonth].name} Revenue
                    </text>
                    <text 
                      x={monthsData[hoveredMonth].cx - 50} 
                      y={Math.min(monthsData[hoveredMonth].cyThis, monthsData[hoveredMonth].cyLast) - 28} 
                      fill="#a3d973" 
                      fontSize="9" 
                      fontWeight="600"
                    >
                      TY: ₹{monthsData[hoveredMonth].thisYear}
                    </text>
                    <text 
                      x={monthsData[hoveredMonth].cx + 10} 
                      y={Math.min(monthsData[hoveredMonth].cyThis, monthsData[hoveredMonth].cyLast) - 28} 
                      fill="#60a5fa" 
                      fontSize="9" 
                      fontWeight="600"
                    >
                      LY: ₹{monthsData[hoveredMonth].lastYear}
                    </text>
                  </g>
                </g>
              )}

              {/* Invisible Hover Hitboxes for Months */}
              {monthsData.map((d, i) => (
                <rect
                  key={i}
                  x={d.cx - 20}
                  y="20"
                  width="40"
                  height="180"
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredMonth(i)}
                  onMouseLeave={() => setHoveredMonth(null)}
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Top 5 Categories Card */}
        <div className="dashboard-card-panel">
          <div className="panel-header-row" style={{ borderBottom: '1px solid #f1f3f4', paddingBottom: '12px', marginBottom: '16px' }}>
            <h2 className="panel-title" style={{ fontSize: '16px' }}>Top 5 Categories</h2>
          </div>

          {/* Semicircle Gauge SVG */}
          <div className="gauge-container" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '360px', height: '210px' }}>
              <svg viewBox="0 0 300 160" style={{ width: '100%', height: '100%' }}>
                {categoriesPaths.map((cat, i) => (
                  <g key={cat.name}>
                    <path 
                      d={cat.d} 
                      fill="none" 
                      stroke={cat.color} 
                      strokeWidth={hoveredCategory?.name === cat.name ? "22" : "16"} 
                      strokeLinecap="round" 
                      style={{ 
                        strokeDasharray: 300,
                        strokeDashoffset: animated ? 0 : 300,
                        transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1), stroke-width 0.2s',
                        cursor: 'pointer' 
                      }}
                      onMouseEnter={() => setHoveredCategory(cat)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    />
                    
                    {/* Percentage Labels Placement */}
                    <g
                      style={{
                        opacity: animated ? 1 : 0,
                        transform: animated ? 'scale(1)' : 'scale(0.5)',
                        transformOrigin: `${cat.badgeCx}px ${cat.badgeCy}px`,
                        transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        transitionDelay: `${i * 100}ms`
                      }}
                    >
                      <circle 
                        cx={cat.badgeCx} 
                        cy={cat.badgeCy} 
                        r="14" 
                        fill="#ffffff" 
                        stroke={hoveredCategory?.name === cat.name ? cat.color : "#e0e0e0"} 
                        strokeWidth={hoveredCategory?.name === cat.name ? "2" : "1"} 
                        style={{ transition: 'all 0.2s', cursor: 'pointer' }}
                        onMouseEnter={() => setHoveredCategory(cat)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      />
                      <text 
                        x={cat.badgeCx} 
                        y={cat.badgeCy + 3} 
                        fontSize="9" 
                        fontWeight="700" 
                        fill="#37474f" 
                        textAnchor="middle"
                        style={{ pointerEvents: 'none' }}
                      >
                        {cat.value}
                      </text>
                    </g>
                  </g>
                ))}

                {/* Center text dynamic based on hover */}
                {/* Let's render a beautiful inner circular background card */}
                <circle cx="150" cy="120" r="35" fill="#fff9e6" />
                {hoveredCategory !== null ? (
                  <>
                    <text x="150" y="118" fontSize="22" fontWeight="700" fill={hoveredCategory.color} textAnchor="middle">
                      {hoveredCategory.value}
                    </text>
                    <text x="150" y="132" fontSize="9" fontWeight="600" fill="#78909c" textAnchor="middle">
                      {hoveredCategory.name}
                    </text>
                  </>
                ) : (
                  <>
                    <text x="150" y="127" fontSize="22" fontWeight="700" fill="#ff8f00" textAnchor="middle">100%</text>
                  </>
                )}
              </svg>
            </div>

            {/* Legends list */}
            <div className="gauge-legends" style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '16px', padding: '0 8px' }}>
              {categoriesPaths.map((cat) => (
                <div 
                  key={cat.name} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    fontSize: '13px', 
                    fontWeight: '500',
                    cursor: 'pointer',
                    padding: '6px 8px',
                    borderRadius: '8px',
                    backgroundColor: hoveredCategory?.name === cat.name ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={() => setHoveredCategory(cat)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: cat.color, display: 'inline-block' }} />
                    <span style={{ color: '#555555' }}>{cat.name}</span>
                  </div>
                  <span style={{ color: '#90a4ae', fontSize: '12px' }}>{cat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
