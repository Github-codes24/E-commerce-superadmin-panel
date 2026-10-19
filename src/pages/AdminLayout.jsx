import React, { useState, useEffect, useRef } from 'react'
import {
  LayoutGrid,
  BarChart3,
  UserCheck,
  Store,
  Users,
  Package,
  Layers,
  ClipboardList,
  Key,
  Percent,
  Coins,
  CreditCard,
  Search,
  Bell,
  LogOut,
  Menu,
  UserRound,
  LockKeyhole
} from 'lucide-react'
import './admin.css'
import Dashboard from './Dashboard'
import Notifications from './Notifications'
import Profile from './Profile'
import ChangePassword from './ChangePassword'
import Reports from './Reports'
import AdminsManagement from './AdminsManagement'
import VendorsManagement from './VendorsManagement'
import CustomersManagement from './CustomersManagement'
import ProductManagement from './ProductManagement'
import CategoryManagement from './CategoryManagement'
import OrdersManagement from './OrdersManagement'
import PermissionsManagement from './PermissionsManagement'
import OffersCoupons from './OffersCoupons'
import CommissionManagement from './CommissionManagement'
import PaymentMonitoring from './PaymentMonitoring'
import logoImg from '../assets/new logo.jpeg'

function AdminLayout({ onLogout }) {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [prevTab, setPrevTab] = useState('Dashboard')
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false)

  const [profileData, setProfileData] = useState(() => {
    try {
      const saved = localStorage.getItem('profileData')
      return saved ? JSON.parse(saved) : {
        name: 'Michael Dell',
        role: 'Super Admin',
        phone: '9876543210',
        email: 'example@123@gmail.com',
        password: '*************',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256&h=256'
      }
    } catch {
      return {
        name: 'Michael Dell',
        role: 'Super Admin',
        phone: '9876543210',
        email: 'example@123@gmail.com',
        password: '*************',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256&h=256'
      }
    }
  })

  // Sync profile data when updated locally or via events
  useEffect(() => {
    const handleProfileSync = () => {
      try {
        const saved = localStorage.getItem('profileData') || localStorage.getItem('adminUser')
        if (saved) {
          const parsed = JSON.parse(saved)
          setProfileData(prev => ({ ...prev, ...parsed }))
        }
      } catch (err) {
        console.warn('Could not sync admin profile from storage:', err)
      }
    }
    window.addEventListener('profile:updated', handleProfileSync)
    window.addEventListener('storage', handleProfileSync)
    return () => {
      window.removeEventListener('profile:updated', handleProfileSync)
      window.removeEventListener('storage', handleProfileSync)
    }
  }, [])

  React.useEffect(() => {
    localStorage.setItem('profileData', JSON.stringify(profileData))
  }, [profileData])

  React.useEffect(() => {
    document.body.removeAttribute('data-theme')
    localStorage.removeItem('theme')
  }, [])

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const pageContainerRef = useRef(null)

  useEffect(() => {
    if (pageContainerRef.current) {
      pageContainerRef.current.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [activeTab])

  const menuItems = [
    { name: 'Dashboard', icon: LayoutGrid },
    { name: 'Reports', icon: BarChart3 },
    { name: 'Admins Management', icon: UserCheck },
    { name: 'Vendors Management', icon: Store },
    { name: 'Customers Management', icon: Users },
    { name: 'Product Management', icon: Package },
    { name: 'Category Management', icon: Layers },
    { name: 'Orders Management', icon: ClipboardList },
    { name: 'Permissions Management', icon: Key }, // lowercase 'p' as in screenshot
    { name: 'Offers & Coupons', icon: Percent },
    { name: 'Commission Management', icon: Coins },
    { name: 'Payment Monitoring', icon: CreditCard }
  ]

  const handleTabClick = (tabName) => {
    if (tabName !== activeTab) {
      setPrevTab(activeTab)
      setActiveTab(tabName)
    }
    setShowProfileDropdown(false)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard onViewAllOrders={() => handleTabClick('Orders Management')} onNavigate={handleTabClick} />
      case 'Reports':
        return <Reports />
      case 'Admins Management':
        return <AdminsManagement />
      case 'Vendors Management':
        return <VendorsManagement />
      case 'Customers Management':
        return <CustomersManagement />
      case 'Product Management':
        return <ProductManagement />
      case 'Category Management':
        return <CategoryManagement />
      case 'Orders Management':
        return <OrdersManagement initialSearchQuery={searchQuery} />
      case 'Permissions Management':
        return <PermissionsManagement />
      case 'Offers & Coupons':
        return <OffersCoupons />
      case 'Commission Management':
        return <CommissionManagement />
      case 'Payment Monitoring':
        return <PaymentMonitoring />
      case 'Notifications':
        return <Notifications onBack={() => handleTabClick(prevTab && prevTab !== 'Notifications' ? prevTab : 'Dashboard')} />
      case 'Profile':
        return (
          <Profile
            profileData={profileData}
            setProfileData={setProfileData}
            onChangePassword={() => setShowChangePasswordModal(true)}
            onBack={() => handleTabClick(prevTab && prevTab !== 'Profile' ? prevTab : 'Dashboard')}
          />
        )
      case 'Change Password':
        return (
          <ChangePassword
            isModal={false}
            profileData={profileData}
            setProfileData={setProfileData}
            onLogout={onLogout}
            onBack={() => handleTabClick(prevTab && prevTab !== 'Change Password' ? prevTab : 'Dashboard')}
          />
        )
      default:
        // Render a premium looking placeholder for other tabs
        return (
          <div className="empty-tab-view">
            <div className="empty-tab-icon">
              {React.createElement(
                (menuItems.find(item => item.name === activeTab)?.icon) || LayoutGrid
              )}
            </div>
            <h2>{activeTab}</h2>
            <p>This module is currently connected to the live database in read-only sandbox mode. Full management capabilities will be active in production.</p>
            <button
              className="edit-profile-btn"
              onClick={() => setActiveTab('Dashboard')}
            >
              Go to Dashboard
            </button>
          </div>
        )
    }
  }

  return (
    <div className="admin-container">
      {/* Left Sidebar */}
      <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-logo-container">
          <img src={logoImg} alt="Logo" className="sidebar-logo-image" />
        </div>
        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            const isTabActive = activeTab === item.name
            return (
              <li
                key={item.name}
                className={`sidebar-item ${isTabActive ? 'active' : ''}`}
                onClick={() => handleTabClick(item.name)}
                title={isSidebarCollapsed ? item.name : undefined}
              >
                <IconComponent className="sidebar-item-icon" />
                {!isSidebarCollapsed && <span className="sidebar-item-text">{item.name}</span>}
              </li>
            )
          })}
        </ul>
      </aside>

      {/* Main Panel Viewport */}
      <div className="admin-workspace">
        {/* Header Row */}
        <header className="top-header">
          <div className="header-title-section" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              className="sidebar-toggle-btn"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              aria-label="Toggle Sidebar"
            >
              <Menu size={22} />
            </button>
            <h2>Welcome Super Admin</h2>
          </div>

          <div className="header-search-section">
            <div className="search-input-wrapper">
              <Search
                className="search-icon-header"
                onClick={() => {
                  if (searchQuery.trim()) handleTabClick('Orders Management')
                }}
                style={{ cursor: 'pointer' }}
              />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    handleTabClick('Orders Management')
                  }
                }}
              />
            </div>
          </div>

          <div className="header-actions">
            {/* Profile Avatar / Name */}
            <div style={{ position: 'relative' }}>
              <button
                className="profile-trigger"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <img
                  src={profileData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256'}
                  alt={profileData.name}
                  className="profile-avatar"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256'
                  }}
                />
                <div className="profile-info">
                  <span className="profile-name">{profileData.name}</span>
                  <span className="profile-role">{profileData.role}</span>
                </div>
              </button>

              {showProfileDropdown && (
                <div className="logout-dropdown">
                  <button
                    className="dropdown-item profile-info-item"
                    onClick={() => {
                      handleTabClick('Profile');
                      setShowProfileDropdown(false);
                    }}
                  >
                    <UserRound style={{ width: '18px', height: '18px' }} />
                    Profile Information
                  </button>
                  <button
                    className="dropdown-item change-pass-item"
                    onClick={() => {
                      setShowChangePasswordModal(true);
                      setShowProfileDropdown(false);
                    }}
                  >
                    <LockKeyhole style={{ width: '18px', height: '18px' }} />
                    Change Password
                  </button>
                  <button
                    className="dropdown-item logout-item"
                    onClick={() => {
                      setShowLogoutConfirmModal(true);
                      setShowProfileDropdown(false);
                    }}
                  >
                    <LogOut style={{ width: '18px', height: '18px' }} />
                    Logout
                  </button>
                </div>
              )}
            </div>



            {/* Notification Bell */}
            <button
              className="notification-bell-btn"
              aria-label="View notifications"
              onClick={() => handleTabClick('Notifications')}
            >
              <Bell className="bell-icon" />
              <span className="bell-dot" />
            </button>
          </div>
        </header>

        {/* Page Content Rendering Area */}
        <main className="page-container" ref={pageContainerRef}>
          {renderContent()}
        </main>
      </div>

      {/* Change Password Overlay */}
      {showChangePasswordModal && (
        <ChangePassword
          isModal={true}
          onClose={() => setShowChangePasswordModal(false)}
          profileData={profileData}
          setProfileData={setProfileData}
          onLogout={onLogout}
        />
      )}

      {/* Logout Overlay */}
      {showLogoutConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-card logout-modal">
            <h3 className="modal-title font-large">Logout</h3>

            <p className="modal-text">
              Are your sure you want to <span className="text-danger">Logout</span> ?
            </p>

            <div className="modal-actions">
              <button
                className="modal-btn cancel-btn"
                onClick={() => setShowLogoutConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className="modal-btn submit-btn"
                onClick={() => {
                  setShowLogoutConfirmModal(false);
                  onLogout();
                }}
              >
                Yes, Sure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminLayout
