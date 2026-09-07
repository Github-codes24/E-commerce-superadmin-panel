import React, { useState, useEffect } from 'react'
import { 
  ShoppingCart, 
  CheckCircle2, 
  RefreshCw, 
  XCircle, 
  DollarSign, 
  AlertTriangle, 
  Package, 
  UserCheck, 
  ShieldAlert, 
  Layers, 
  CheckSquare, 
  Users, 
  UserMinus, 
  Store, 
  Tag, 
  Ticket, 
  Clock, 
  ChevronRight,
  TrendingUp,
  FileText,
  ShoppingBag,
  LayoutGrid,
  RotateCw
} from 'lucide-react'
import { getDashboardStats } from '../services/superAdminService'
import './Dashboard.css'

function Dashboard({ onViewAllOrders }) {
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [statsData, setStatsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await getDashboardStats()
      if (res && res.success && res.data) {
        setStatsData(res.data)
      } else if (res && res.data) {
        setStatsData(res.data)
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err)
      setError(err?.response?.data?.message || 'Failed to fetch live stats')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const statSections = [
    {
      title: "Reports Metrics",
      items: [
        { id: 'total-revenue', label: 'Total Revenue', value: '₹ 5,56,879', icon: TrendingUp, colorClass: 'green' },
        { id: 'total-sales', label: 'Total Sales', value: '₹ 1,88,879', icon: FileText, colorClass: 'green' },
        { 
          id: 'reports-total-order', 
          label: 'Total Order', 
          value: statsData?.totalOrders !== undefined ? Number(statsData.totalOrders).toLocaleString() : '320', 
          icon: ShoppingBag, 
          colorClass: 'blue' 
        }
      ]
    },
    {
      title: "Orders & Payments Metrics",
      items: [
        { 
          id: 'total-orders', 
          label: 'Total Orders', 
          value: statsData?.totalOrders !== undefined ? Number(statsData.totalOrders).toLocaleString() : '320', 
          icon: ShoppingCart, 
          colorClass: 'blue' 
        },
        { id: 'delivered-orders', label: 'Delivered Orders', value: '10,245', icon: CheckCircle2, colorClass: 'green' },
        { id: 'processing-orders', label: 'Processing Orders', value: '1,823', icon: RefreshCw, colorClass: 'blue' },
        { id: 'cancelled-orders', label: 'Cancelled Orders', value: '377', icon: XCircle, colorClass: 'red' },
        { id: 'total-payments', label: 'Total Payments', value: '120', icon: DollarSign, colorClass: 'blue' },
        { id: 'success-payments', label: 'Success Payments', value: '110', icon: CheckCircle2, colorClass: 'green' },
        { id: 'refunded-payments', label: 'Refunded Payments', value: '10', icon: AlertTriangle, colorClass: 'red' }
      ]
    },
    {
      title: "Catalog & Inventory Metrics",
      items: [
        { 
          id: 'total-products', 
          label: 'Total Products', 
          value: statsData?.totalProducts !== undefined ? Number(statsData.totalProducts).toLocaleString() : '500', 
          icon: Package, 
          colorClass: 'blue' 
        },
        { id: 'active-products', label: 'Active Products', value: '448', icon: CheckCircle2, colorClass: 'green' },
        { id: 'outofstock-products', label: 'Out Of Stock', value: '49', icon: ShieldAlert, colorClass: 'red' },
        { id: 'product-category', label: 'Product Category', value: '20', icon: LayoutGrid, colorClass: 'blue' },
        { id: 'total-categories', label: 'Total Categories', value: '19', icon: Layers, colorClass: 'blue' },
        { id: 'active-categories', label: 'Active Categories', value: '17', icon: CheckSquare, colorClass: 'green' },
        { id: 'inactive-categories', label: 'Inactive Categories', value: '1', icon: AlertTriangle, colorClass: 'red' }
      ]
    },
    {
      title: "User & Vendor Metrics",
      items: [
        { 
          id: 'total-customers', 
          label: 'Total Customers', 
          value: statsData?.totalCustomers !== undefined ? Number(statsData.totalCustomers).toLocaleString() : '150', 
          icon: Users, 
          colorClass: 'blue' 
        },
        { id: 'active-customers', label: 'Active Customers', value: '900', icon: UserCheck, colorClass: 'green' },
        { id: 'blocked-customers', label: 'Blocked Customers', value: '100', icon: ShieldAlert, colorClass: 'red' },
        { 
          id: 'total-vendors', 
          label: 'Total Vendors', 
          value: statsData?.totalVendors !== undefined ? Number(statsData.totalVendors).toLocaleString() : '25', 
          icon: Store, 
          colorClass: 'blue' 
        },
        { id: 'active-vendors', label: 'Active Vendors', value: '196', icon: UserCheck, colorClass: 'green' },
        { id: 'inactive-vendors', label: 'Inactive Vendors', value: '13', icon: UserMinus, colorClass: 'red' },
        { 
          id: 'total-admins', 
          label: 'Total Admins', 
          value: statsData?.totalAdmins !== undefined ? Number(statsData.totalAdmins).toLocaleString() : '10', 
          icon: Users, 
          colorClass: 'blue' 
        },
        { id: 'active-admins', label: 'Active Admins', value: '5', icon: UserCheck, colorClass: 'green' },
        { id: 'inactive-admins', label: 'Inactive Admins', value: '1', icon: UserMinus, colorClass: 'red' }
      ]
    },
    {
      title: "Offers & Coupons Metrics",
      items: [
        { id: 'total-offers', label: 'Total Offers', value: '8', icon: Tag, colorClass: 'blue' },
        { id: 'total-coupons', label: 'Total Coupons', value: '8', icon: Ticket, colorClass: 'blue' },
        { id: 'active-offers', label: 'Active Offers', value: '3', icon: CheckCircle2, colorClass: 'green' },
        { id: 'active-coupons', label: 'Active Coupons', value: '3', icon: Clock, colorClass: 'green' }
      ]
    }
  ]

  const recentOrders = [
    {
      id: '#ORD_001',
      customer: 'John Doe',
      time: '2h ago',
      amount: '₹ 12,000',
      status: 'delivered',
      statusLabel: 'Delivered',
      items: 'Winter Wool Jacket x 1, Casual Jeans x 1',
      payment: 'UPI / NetBanking',
      address: '74, Park Street, Kolkata, WB'
    },
    {
      id: '#ORD_002',
      customer: 'Jane Smith',
      time: '4h ago',
      amount: '₹ 45,000',
      status: 'out-of-delivery',
      statusLabel: 'Out Of Delivery',
      items: 'Vellore Silk Saree x 2, Gold Plated Bangles x 1',
      payment: 'Credit Card',
      address: 'Flat 402, Lotus Residency, Pune, MH'
    },
    {
      id: '#ORD_003',
      customer: 'Sumeer Raj',
      time: '6h ago',
      amount: '₹ 8,000',
      status: 'pending',
      statusLabel: 'Pending',
      items: 'Leather Belt x 1, Sports Shoes x 1',
      payment: 'Cash on Delivery',
      address: 'H.No 12-B, Sector 15, Noida, UP'
    },
  ]

  const recentActivities = [
    {
      id: 1,
      title: 'New Vendor Verification Pending',
      timestamp: 'Jan 15, 2026 11:23 PM',
    },
    {
      id: 2,
      title: 'Admin Logged In',
      timestamp: 'Feb 15, 2026 12:40 AM',
    },
    {
      id: 3,
      title: 'Order Delivered',
      timestamp: 'Mar 26, 2026 03:15 PM',
    },
    {
      id: 4,
      title: 'New Customer Logged in',
      timestamp: 'Apr 02, 2026 09:12 AM',
    }
  ]

  return (
    <div className="dashboard-view">
      <div className="welcome-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of all panel modules and live metrics.</p>
        </div>
        <button 
          className="dashboard-refresh-btn" 
          onClick={fetchStats} 
          disabled={loading}
          title="Refresh Dashboard Stats"
        >
          <RotateCw size={15} className={loading ? 'spin-icon' : ''} />
          <span>{loading ? 'Fetching...' : 'Refresh Stats'}</span>
        </button>
      </div>

      {/* Render all metrics grouped by section */}
      {statSections.map((section, idx) => (
        <div key={idx} className="dashboard-section-block" style={{ marginBottom: '32px' }}>
          <h2 className="section-subtitle" style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-dark)' }}>
            {section.title}
          </h2>
          <div className="stats-grid">
            {section.items.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.id} className="stat-card-new">
                  <div className={`stat-icon-new ${stat.colorClass}`}>
                    <Icon />
                  </div>
                  <div className="stat-info-new">
                    <span className="stat-label-new">{stat.label}</span>
                    <span className="stat-value-new">{stat.value}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Columns: Recent Orders & Recent Activities */}
      <div className="dashboard-grid-columns">
        {/* Recent Orders Panel */}
        <div className="dashboard-card-panel">
          <div className="panel-header-row">
            <h2 className="panel-title">Recent Orders</h2>
            <button className="panel-link-btn" aria-label="View all orders" onClick={onViewAllOrders}>
              <ChevronRight />
            </button>
          </div>

          <div className="orders-list">
            {recentOrders.map((order) => (
              <div 
                key={order.id} 
                className="order-row-item interactive-order" 
                onClick={() => setSelectedOrder(order)}
                style={{ cursor: 'pointer' }}
              >
                <div className="order-meta-info">
                  <div className="order-number">{order.id}</div>
                  <div className="order-customer">{order.customer}</div>
                  <div className="order-time">{order.time}</div>
                </div>
                <div className="order-finance-status">
                  <div className="order-amount">{order.amount}</div>
                  <span className={`order-badge ${order.status}`}>
                    {order.statusLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities Panel */}
        <div className="dashboard-card-panel">
          <div className="panel-header-row">
            <h2 className="panel-title">Recent Activities</h2>
          </div>
          <p style={{ fontSize: '12px', color: '#78909c', marginBottom: '16px' }}>
            Check Recent Activities
          </p>

          <div className="activities-list">
            {recentActivities.map((act) => (
              <div key={act.id} className="activity-item">
                <div className="activity-title">{act.title}</div>
                <div className="activity-timestamp">{act.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-card order-detail-modal" style={{ width: '450px' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Order Details: {selectedOrder.id}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '20px 0', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#78909c' }}>Customer Name</span>
                <span style={{ fontWeight: '600' }}>{selectedOrder.customer}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#78909c' }}>Order Date/Time</span>
                <span>{selectedOrder.time}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#78909c' }}>Total Amount</span>
                <span style={{ fontWeight: '700', color: '#000000' }}>{selectedOrder.amount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#78909c' }}>Status</span>
                <span className={`order-badge ${selectedOrder.status}`}>{selectedOrder.statusLabel}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#78909c' }}>Payment Mode</span>
                <span>{selectedOrder.payment}</span>
              </div>
              <div style={{ borderTop: '1px solid #eee', margin: '8px 0' }} />
              <div>
                <span style={{ color: '#78909c', display: 'block', marginBottom: '4px' }}>Ordered Items</span>
                <span style={{ fontWeight: '500' }}>{selectedOrder.items}</span>
              </div>
              <div style={{ marginTop: '4px' }}>
                <span style={{ color: '#78909c', display: 'block', marginBottom: '4px' }}>Delivery Address</span>
                <span>{selectedOrder.address}</span>
              </div>
            </div>

            <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                type="button" 
                className="modal-btn cancel-btn" 
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
              <button 
                type="button" 
                className="modal-btn submit-btn" 
                onClick={() => {
                  alert(`Processing order ${selectedOrder.id}...`)
                  setSelectedOrder(null)
                }}
              >
                Accept Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
