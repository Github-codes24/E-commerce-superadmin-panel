import React, { useState, useEffect } from 'react'
import {
  ShoppingCart,
  CheckCircle2,
  RefreshCw,
  XCircle,
  Search,
  ChevronDown,
  ChevronLeft,
  Eye,
  Star,
  MapPin,
  User,
  Store,
  CreditCard,
  TrendingDown,
  Check,
  AlertCircle,
  X,
  RotateCw,
} from 'lucide-react'
import { getAllOrders, getOrderById, updateOrderStatus, cancelOrder } from '../services/superAdminService'
import './OrdersManagement.css'

/* ─────────────────────────────────────────
   Mock Data
───────────────────────────────────────── */
const ORDERS = [
  {
    id: '#ORD_001',
    orderNo: '#28456876',
    customer: 'Neha Trivedi',
    vendor: 'Sameer Sharma',
    amount: '₹ 12,000',
    payment: 'Paid',
    status: 'Delivered',
    paymentMethod: 'Online',
    transactionId: 'TXN987654321',
    complaint: {
      reason: 'Product damaged',
      requestedAmount: '₹ 1,000',
      requestDate: '27 Aug 2026',
      status: 'Pending',
    }
  },
  {
    id: '#ORD_002',
    orderNo: '#28456877',
    customer: 'kumar Dube',
    vendor: 'Priya Verma',
    amount: '₹ 12,675',
    payment: 'Paid',
    status: 'Delivered',
    paymentMethod: 'Cash on Delivery',
    transactionId: 'Not available',
    complaint: {
      reason: 'Product damaged',
      requestedAmount: '₹ 1,000',
      requestDate: '27 Aug 2026',
      status: 'Pending',
      refundMethod: 'Bank Transfer'
    }
  },
  {
    id: '#ORD_003',
    orderNo: '#28456878',
    customer: 'Priya Sharma',
    vendor: 'Neha Sing',
    amount: '₹ 10,980',
    payment: 'Paid',
    status: 'Shipped',
    paymentMethod: 'Online',
    transactionId: 'TXN987654322',
    complaint: {
      reason: 'Incorrect size sent',
      requestedAmount: '₹ 2,000',
      requestDate: '26 Aug 2026',
      status: 'Pending'
    }
  },
  {
    id: '#ORD_004',
    orderNo: '#28456879',
    customer: 'Esther Howard',
    vendor: 'Arjun Soni',
    amount: '₹ 8,000',
    payment: 'Paid',
    status: 'Delivered',
    paymentMethod: 'Online',
    transactionId: 'TXN987654323',
    complaint: {
      reason: 'Wrong color received',
      requestedAmount: '₹ 1,500',
      requestDate: '25 Aug 2026',
      status: 'Approved',
      refundStatus: 'Processing'
    }
  },
  {
    id: '#ORD_005',
    orderNo: '#28456880',
    customer: 'Jenny Wilson',
    vendor: 'Yash Jaiswaal',
    amount: '₹ 6,999',
    payment: 'Refund',
    status: 'Cancelled',
    paymentMethod: 'Online',
    transactionId: 'TXN987654324',
    complaint: {
      reason: 'Order Cancelled - Auto Refund',
      requestedAmount: '₹ 6,999',
      requestDate: '24 Aug 2026',
      status: 'Approved',
      refundStatus: 'Completed',
      refundDate: '27 Aug 2026',
      refundMethod: 'Original online payment method'
    }
  },
  {
    id: '#ORD_006',
    orderNo: '#28456881',
    customer: 'Rocky Dhavan',
    vendor: 'Jamie Dohn',
    amount: '₹ 16,500',
    payment: 'Paid',
    status: 'Ordered',
    paymentMethod: 'Online',
    transactionId: 'TXN987654325',
  },
  {
    id: '#ORD_007',
    orderNo: '#28456882',
    customer: 'Alex Michaelides',
    vendor: 'Lee Child',
    amount: '₹ 12,000',
    payment: 'Paid',
    status: 'Delivered',
    paymentMethod: 'Cash on Delivery',
    transactionId: 'Not available',
    complaint: {
      reason: 'Product defective',
      requestedAmount: '₹ 2,500',
      requestDate: '27 Aug 2026',
      status: 'Approved',
      refundStatus: 'Completed',
      refundMethod: 'Bank Transfer',
      refundDate: '27 Aug 2026'
    }
  },
]

const ORDER_DETAILS = {
  '#ORD_001': {
    orderNo: '#28456876',
    status: 'Ordered',
    product: {
      name: 'Sony Camera',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=200&h=200',
      size: 'Free Size',
      color: 'Black',
      qty: 1,
      rating: 4.8,
      discount: 64,
      price: '₹ 7,198',
    },
    pricing: { product: '₹ 7,198', delivery: '₹ 15', total: '₹ 7,213', saved: '₹ 12,796' },
    vendor: { name: 'Sony Center', address: '456, Business Bay, T. Nagar, Pune, Maharashtra – 987654', gst: '27AAAA0000A1Z5' },
    customer: { name: 'Aman Verma', email: 'amanverma@gmail.com' },
    shipping: 'Flat No. 302, Green Valley Apartments, Wardha Road, Nagpur, Maharashtra - 440015',
    timeline: [
      { label: 'ordered', done: true, desc: 'Order has been placed.', date: '08 May' },
      { label: 'Shipped', done: false, desc: 'DLPL Logistics – FMPC5FDG5G4', date: '10 May' },
      { label: 'Out Of Delivery', done: false, desc: 'Your item is out for delivery.', date: '16 May' },
      { label: 'Delivered', done: false, desc: 'Your Item has been delivered.', date: '16 May' },
    ],
  },
  '#ORD_004': {
    orderNo: '#28456876',
    status: 'Shipped',
    product: {
      name: 'Lamp',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
      size: 'Free Size',
      color: 'Brown',
      qty: 2,
      rating: 4.8,
      discount: 64,
      price: '₹ 7,198',
    },
    pricing: { product: '₹ 2,198', delivery: '₹ 15', total: '₹ 2,213', saved: '₹ 3,907' },
    vendor: { name: 'City Lights', address: '455, Business Bay, T. Nagar, Pune, Maharashtra – 987654', gst: '27AAAA0000A1Z5' },
    customer: { name: 'Jyoti Murti', email: 'jyotimurti@gmail.com' },
    shipping: 'Plot No. 12, Sunrise Avenue, Ring Road, Nagpur, Maharashtra - 440022',
    timeline: [
      { label: 'ordered', done: true, desc: 'Order has been placed.', date: '08 May' },
      { label: 'Shipped', done: true, desc: 'DLPL Logistics – FMPC5FDG5G4', date: '10 May' },
      { label: 'Out Of Delivery', done: false, desc: 'Your item is out for delivery.', date: '16 May' },
      { label: 'Delivered', done: false, desc: 'Your Item has been delivered.', date: '16 May' },
    ],
  },
  '#ORD_005': {
    orderNo: '#28456876',
    status: 'Cancelled',
    product: {
      name: "Men's Shirt",
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=200&h=200',
      size: 'Free Size',
      color: 'Blue',
      qty: 2,
      rating: 4.8,
      discount: 64,
      price: '₹ 199',
    },
    pricing: { product: '₹ 199', delivery: '₹ 15', total: '₹ 214', saved: '₹ 380' },
    vendor: { name: 'A.K.Fashion', address: '456, Business Bay, T. Nagar, Pune, Maharashtra - 987654', gst: '27AAAA0000A1Z5' },
    customer: { name: 'Amit Deshmukh', email: 'amit@gmail.com' },
    shipping: 'Building C-3, Flat No. 501, Empress City, Nagpur, Maharashtra - 440018',
    timeline: [
      { label: 'ordered', done: true, desc: 'Order has been placed.', date: '08 May' },
      { label: 'Cancelled', done: true, desc: 'Your Item has been Cancelled.', date: '16 May', isRed: true },
    ],
  },
  '#ORD_006': {
    orderNo: '#28456876',
    status: 'Delivered',
    product: {
      name: 'Sony Smart TV',
      image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=200&h=200',
      size: 'Free Size',
      color: 'Black',
      qty: 1,
      rating: 4.8,
      discount: 64,
      price: '₹ 7,198',
    },
    pricing: { product: '₹ 5,198', delivery: '₹ 15', total: '₹ 5,213', saved: '₹ 9,241' },
    vendor: { name: 'Sony Center', address: '456, Business Bay, T. Nagar, Pune, Maharashtra – 987654', gst: '27AAAA0000A1Z5' },
    customer: { name: 'Vishal Sahane', email: 'vishal@gmail.com' },
    shipping: 'Flat No. 104, Royal Palms Residences, Wardha Road, Nagpur, Maharashtra - 440015',
    timeline: [
      { label: 'ordered', done: true, desc: 'Order has been placed.', date: '08 May' },
      { label: 'Shipped', done: true, desc: 'DLPL Logistics – FMPC5FDG5G4', date: '10 May' },
      { label: 'Out Of Delivery', done: false, desc: 'Your item is out for delivery.', date: '16 May' },
      { label: 'Delivered', done: true, desc: 'Your Item has been delivered.', date: '18 May' },
    ],
  },
  '#ORD_003': {
    orderNo: '#28456876',
    status: 'Out Of Delivery',
    product: {
      name: 'Lamp',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
      size: 'Free Size',
      color: 'Brown',
      qty: 1,
      rating: 4.8,
      discount: 64,
      price: '₹ 7,198',
    },
    pricing: { product: '₹ 2,198', delivery: '₹ 15', total: '₹ 2,213', saved: '₹ 3,907' },
    vendor: { name: 'City Lights', address: '455, Business Bay, T. Nagar, Pune, Maharashtra – 987654', gst: '27AAAA0000A1Z5' },
    customer: { name: 'Karan Patel', email: 'karan@gmail.com' },
    shipping: 'Flat No. 402, Green Avenue Heights, Nagpur, Maharashtra - 440010',
    timeline: [
      { label: 'ordered', done: true, desc: 'Order has been placed.', date: '08 May' },
      { label: 'Shipped', done: true, desc: 'DLPL Logistics – FMPC5FDG5G4', date: '10 May' },
      { label: 'Out Of Delivery', done: false, desc: 'Your item is out for delivery.', date: '16 May' },
      { label: 'Delivered', done: false, desc: 'Your Item has been delivered.', date: '16 May' },
    ],
  },
}

/* ─────────────────────────────────────────
   Helper: format backend order item
   ───────────────────────────────────────── */
const formatOrderItem = (item, index = 0) => {
  if (!item) return null
  const rawId = item.id || item._id || item.orderId || item.orderNo || `#ORD_${String(index + 1).padStart(3, '0')}`
  const orderNumber = item.orderNo || item.orderNumber || item.orderId || (item._id ? `#${String(item._id).slice(-8).toUpperCase()}` : rawId)
  
  // Customer info (handles customerId object, customer object, user object, or string)
  let customerName = 'Customer'
  let customerEmail = ''
  let customerPhone = ''
  const custObj = item.customerId || item.customer || item.user || {}
  if (typeof custObj === 'object' && custObj !== null) {
    customerName = custObj.fullName || custObj.name || custObj.username || item.customerName || 'Customer'
    customerEmail = custObj.email || ''
    customerPhone = custObj.mobile || custObj.phone || custObj.phoneNumber || ''
  } else if (item.customerName) {
    customerName = item.customerName
  } else if (typeof item.customer === 'string' && item.customer.trim()) {
    customerName = item.customer
  }

  // Vendor info (handles vendorId object, vendor object, seller object, or string)
  let vendorName = 'Vendor'
  let vendorAddress = ''
  let vendorGst = ''
  const vendObj = item.vendorId || item.vendor || item.seller || item.store || {}
  if (typeof vendObj === 'object' && vendObj !== null) {
    vendorName = vendObj.storeName || vendObj.shopName || vendObj.name || vendObj.fullName || vendObj.businessName || item.vendorName || 'Vendor'
    vendorAddress = vendObj.businessAddress || vendObj.address || (typeof vendObj.address === 'object' ? `${vendObj.address.street || ''} ${vendObj.address.city || ''} ${vendObj.address.state || ''}`.trim() : '')
    vendorGst = vendObj.gstNumber || vendObj.gst || ''
  } else if (item.vendorName) {
    vendorName = item.vendorName
  } else if (typeof item.vendor === 'string' && item.vendor.trim()) {
    vendorName = item.vendor
  }

  // Products array extraction
  const rawProducts = Array.isArray(item.products) && item.products.length > 0
    ? item.products
    : (Array.isArray(item.items) && item.items.length > 0 ? item.items : (item.product ? [item.product] : []))

  const formattedProducts = rawProducts.map((p, pIdx) => {
    const pProd = p.productId || p.product || {}
    const pName = p.productName || p.name || p.title || (typeof pProd === 'object' ? pProd.name || pProd.productName : null) || 'Platform Product'
    const pImg = p.image || p.imageUrl || p.productImage || (typeof pProd === 'object' ? pProd.image || pProd.imageUrl : null) || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=200&h=200'
    const pSize = p.size || p.variant?.size || 'Free Size'
    const pColor = p.color || p.variant?.color || 'Standard'
    const pQty = p.quantity || p.qty || 1
    const pRating = p.rating || 4.8
    const pDiscount = p.discount !== undefined ? p.discount : 64
    const pPriceNum = p.price !== undefined ? p.price : (typeof pProd === 'object' ? pProd.price : null)
    const pPriceStr = pPriceNum !== null && pPriceNum !== undefined 
      ? (typeof pPriceNum === 'number' ? `₹ ${pPriceNum.toLocaleString('en-IN')}` : String(pPriceNum))
      : '₹ 0'

    return {
      id: p._id || p.productId || p.id || `p-${pIdx}`,
      name: pName,
      image: pImg,
      size: pSize,
      color: pColor,
      qty: pQty,
      rating: pRating,
      discount: pDiscount,
      price: pPriceStr.startsWith('₹') ? pPriceStr : `₹ ${pPriceStr}`,
    }
  })

  const firstItem = formattedProducts.length > 0 ? formattedProducts[0] : null

  // Amount
  let amountStr = '₹ 0'
  const rawTotal = item.totalAmount !== undefined 
    ? item.totalAmount 
    : (item.amount !== undefined ? item.amount : (item.grandTotal !== undefined ? item.grandTotal : item.total))
    
  if (typeof rawTotal === 'number') {
    amountStr = `₹ ${rawTotal.toLocaleString('en-IN')}`
  } else if (typeof rawTotal === 'string') {
    amountStr = rawTotal.startsWith('₹') ? rawTotal : `₹ ${rawTotal}`
  } else if (firstItem?.price) {
    amountStr = firstItem.price
  }

  // Payment Status: 'Paid' | 'Pending' | 'Refund'
  let paymentStr = 'Paid'
  const pStatus = (item.payment || item.paymentStatus || (item.isPaid ? 'Paid' : 'Pending')).toString().toLowerCase()
  if (pStatus.includes('paid') || pStatus.includes('success') || pStatus.includes('completed')) {
    paymentStr = 'Paid'
  } else if (pStatus.includes('refund')) {
    paymentStr = 'Refund'
  } else {
    paymentStr = 'Pending'
  }

  // Order Status: 'Delivered' | 'Shipped' | 'Processing' | 'Cancelled' | 'Ordered' | 'Out for Delivery' | 'Pending'
  let statusStr = 'Ordered'
  const oStatus = (item.orderStatus || item.status || 'Ordered').toString().toLowerCase()
  if (oStatus.includes('deliver')) {
    statusStr = 'Delivered'
  } else if (oStatus.includes('out')) {
    statusStr = 'Out for Delivery'
  } else if (oStatus.includes('ship')) {
    statusStr = 'Shipped'
  } else if (oStatus.includes('process')) {
    statusStr = 'Processing'
  } else if (oStatus.includes('cancel')) {
    statusStr = 'Cancelled'
  } else if (oStatus.includes('place') || oStatus.includes('order')) {
    statusStr = 'Ordered'
  } else if (oStatus.includes('pend')) {
    statusStr = 'Pending'
  } else {
    statusStr = item.status || item.orderStatus || 'Ordered'
  }

  // Payment method
  const paymentMethod = item.paymentMethod || item.paymentType || (paymentStr === 'Paid' ? 'Online' : 'Cash on Delivery')
  const transactionId = item.transactionId || item.txnId || item.paymentId || (paymentMethod === 'Cash on Delivery' ? 'Not available' : 'TXN' + String(item._id || rawId).slice(-8).toUpperCase())

  // Shipping
  const rawShip = item.shippingAddress || item.shipping || item.deliveryAddress || item.address
  const shippingAddress = typeof rawShip === 'object' && rawShip !== null
    ? `${rawShip.street || rawShip.addressLine1 || ''} ${rawShip.city || ''}, ${rawShip.state || ''} - ${rawShip.pincode || rawShip.zipCode || ''}`.trim()
    : (typeof rawShip === 'string' && rawShip.trim() ? rawShip : 'Flat No. 302, Green Valley Apartments, Wardha Road, Nagpur, Maharashtra - 440015')

  return {
    id: rawId,
    _id: item._id || rawId,
    orderNo: orderNumber,
    customer: customerName,
    vendor: vendorName,
    amount: amountStr,
    payment: paymentStr,
    status: statusStr,
    paymentMethod,
    transactionId,
    complaint: item.complaint || item.refundRequest || null,
    products: formattedProducts,
    product: firstItem,
    pricing: {
      product: amountStr,
      delivery: item.deliveryFee !== undefined ? (typeof item.deliveryFee === 'number' ? `₹ ${item.deliveryFee}` : item.deliveryFee) : 'Free',
      total: amountStr,
      saved: item.savings ? `₹ ${item.savings}` : '₹ 0'
    },
    vendorDetails: {
      name: vendorName,
      address: vendorAddress || '456, Business Bay, T. Nagar, Pune, Maharashtra – 987654',
      gst: vendorGst || '27AAAA0000A1Z5'
    },
    customerDetails: {
      name: customerName,
      email: customerEmail || `${customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      phone: customerPhone || '+91 9876543210'
    },
    shipping: shippingAddress,
    createdAt: item.createdAt || item.date || item.orderDate || new Date().toISOString(),
    raw: item
  }
}

/* ─────────────────────────────────────────
   Helper: status colour maps
   ───────────────────────────────────────── */
function getPaymentClass(payment) {
  switch (payment) {
    case 'Paid': return 'payment-paid'
    case 'Pending': return 'payment-pending'
    case 'Refund': return 'payment-refund'
    default: return 'payment-paid'
  }
}

function getStatusClass(status) {
  switch (status) {
    case 'Delivered': return 'status-delivered'
    case 'Out Of Delivery':
    case 'Out for Delivery':
      return 'status-out-of-delivery'
    case 'Shipped': return 'status-shipped'
    case 'Cancelled': return 'status-cancelled'
    case 'Ordered': return 'status-ordered'
    default: return 'status-ordered'
  }
}

const getOriginalPrice = (priceStr, discount) => {
  if (!priceStr) return '';
  const num = parseFloat(priceStr.replace(/[^\d]/g, ''));
  if (isNaN(num)) return '';
  const orig = Math.round(num / (1 - (discount || 0) / 100));
  return '₹ ' + orig.toLocaleString('en-IN');
};

const formatStepLabel = (lbl) => {
  if (lbl.toLowerCase() === 'ordered') return 'Ordered';
  if (lbl.toLowerCase() === 'shipped') return 'Shipped';
  if (lbl.toLowerCase() === 'out of delivery' || lbl.toLowerCase() === 'out of delivery') return 'Out for Delivery';
  if (lbl.toLowerCase() === 'delivered') return 'Delivered';
  return lbl;
};

export const mapFrontendToBackendStatus = (status) => {
  switch (status) {
    case 'Ordered':
    case 'Pending':
      return 'PLACED';
    case 'Processing':
      return 'PROCESSING';
    case 'Shipped':
      return 'SHIPPED';
    case 'Out for Delivery':
    case 'Out Of Delivery':
      return 'OUT_FOR_DELIVERY';
    case 'Delivered':
      return 'DELIVERED';
    case 'Cancelled':
      return 'CANCELLED';
    default:
      return status ? status.toUpperCase().replace(/\s+/g, '_') : 'PLACED';
  }
};

export const mapBackendToFrontendStatus = (status) => {
  if (!status) return 'Ordered';
  const s = status.toUpperCase().replace(/[\s-]+/g, '_');
  switch (s) {
    case 'PLACED':
    case 'ORDERED':
    case 'PENDING':
      return 'Ordered';
    case 'PROCESSING':
      return 'Processing';
    case 'SHIPPED':
      return 'Shipped';
    case 'OUT_FOR_DELIVERY':
      return 'Out for Delivery';
    case 'DELIVERED':
      return 'Delivered';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return status;
  }
};

/* ─────────────────────────────────────────
   Order Detail View
   ───────────────────────────────────────── */
function OrderDetailView({ 
  order, 
  onBack, 
  onUpdateStatus, 
  onCancelOrder,
  statusUpdating = false,
  cancellingOrder = false,
  onApproveRefund, 
  onRejectRefund, 
  loading = false, 
  onRefresh 
}) {
  const [toastMessage, setToastMessage] = useState('')
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  const triggerToast = (msg) => {
    setToastMessage(msg)
    const t = setTimeout(() => {
      setToastMessage('')
    }, 2500)
    return () => clearTimeout(t)
  }

  const handleCopy = (text, label, e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text)
    triggerToast(`Copied ${label} to clipboard!`)
  }

  const detail = ORDER_DETAILS[order.id] || ORDER_DETAILS[order.orderNo] || null

  const rawAmount = typeof order.amount === 'number' 
    ? order.amount 
    : (parseInt(String(order.amount || 0).replace(/[^\d]/g, '')) || 0)
    
  const discountPercent = detail?.product?.discount || order.product?.discount || 64
  const originalVal = Math.round(rawAmount / (1 - (discountPercent || 64) / 100)) || rawAmount

  const fallback = {
    orderNo: order.orderNo || order.id || '#28456876',
    status: order.status || 'Ordered',
    product: order.product || {
      name: 'Premium Leather Camera Strap',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=200&h=200',
      size: 'Free Size',
      color: 'Brown',
      qty: 1,
      rating: 4.8,
      discount: discountPercent,
      price: order.amount || `₹ ${rawAmount.toLocaleString('en-IN')}`,
    },
    pricing: order.pricing || {
      product: order.amount || `₹ ${rawAmount.toLocaleString('en-IN')}`,
      delivery: 'Free',
      total: order.amount || `₹ ${rawAmount.toLocaleString('en-IN')}`,
      saved: '₹ ' + (originalVal - rawAmount).toLocaleString('en-IN')
    },
    vendor: { 
      name: order.vendorDetails?.name || (typeof order.vendor === 'object' ? (order.vendor.name || order.vendor.storeName) : order.vendor) || 'Vendor', 
      address: order.vendorDetails?.address || '456, Business Bay, T. Nagar, Pune, Maharashtra – 987654', 
      gst: order.vendorDetails?.gst || '27AAAA0000A1Z5' 
    },
    customer: { 
      name: order.customerDetails?.name || (typeof order.customer === 'object' ? (order.customer.fullName || order.customer.name) : order.customer) || 'Customer', 
      email: order.customerDetails?.email || (typeof order.customer === 'string' ? `${order.customer.toLowerCase().replace(/\s+/g, '')}@gmail.com` : 'customer@example.com') 
    },
    shipping: order.shipping || 'Flat No. 302, Green Valley Apartments, Wardha Road, Nagpur, Maharashtra - 440015',
  }

  // Build dynamic details object matching the actual clicked order
  const d = {
    orderNo: detail?.orderNo || order.orderNo || fallback.orderNo,
    status: order.status,
    products: order.products && order.products.length > 0 ? order.products : [order.product || fallback.product],
    product: {
      name: detail?.product?.name || order.product?.name || fallback.product.name,
      image: detail?.product?.image || order.product?.image || fallback.product.image,
      size: detail?.product?.size || order.product?.size || fallback.product.size,
      color: detail?.product?.color || order.product?.color || fallback.product.color,
      qty: detail?.product?.qty || order.product?.qty || fallback.product.qty,
      rating: detail?.product?.rating || order.product?.rating || fallback.product.rating,
      discount: discountPercent,
      price: order.amount || `₹ ${rawAmount.toLocaleString('en-IN')}`,
    },
    pricing: {
      product: detail?.pricing?.product || order.pricing?.product || fallback.pricing.product,
      delivery: detail?.pricing?.delivery || order.pricing?.delivery || fallback.pricing.delivery,
      total: detail?.pricing?.total || order.pricing?.total || fallback.pricing.total,
      saved: detail?.pricing?.saved || order.pricing?.saved || fallback.pricing.saved,
    },
    vendor: {
      name: order.vendorDetails?.name || (typeof order.vendor === 'object' ? order.vendor.name : order.vendor) || fallback.vendor.name,
      address: detail?.vendor?.address || order.vendorDetails?.address || fallback.vendor.address,
      gst: detail?.vendor?.gst || order.vendorDetails?.gst || fallback.vendor.gst,
    },
    customer: {
      name: order.customerDetails?.name || (typeof order.customer === 'object' ? order.customer.fullName : order.customer) || fallback.customer.name,
      email: detail?.customer?.email || order.customerDetails?.email || fallback.customer.email,
    },
    shipping: detail?.shipping || order.shipping || fallback.shipping,
  }

  // Dynamic timeline generator reflecting the current order status
  const getTimelineSteps = (status) => {
    if (status === 'Cancelled') {
      return [
        { label: 'Ordered', done: true, desc: 'Order has been placed.', date: '08 May' },
        { label: 'Cancelled', done: true, desc: 'Your Item has been Cancelled.', date: '16 May', isRed: true },
      ]
    }

    const steps = ['Ordered', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered']
    const statusIndex = steps.indexOf(status)

    let activeIndex = statusIndex
    if (status === 'Pending') activeIndex = 0
    if (status === 'Ordered') activeIndex = 0
    if (status === 'Processing') activeIndex = 1
    if (status === 'Shipped') activeIndex = 2
    if (status === 'Out for Delivery' || status === 'Out Of Delivery') activeIndex = 3
    if (status === 'Delivered') activeIndex = 4

    return [
      { label: 'Ordered', done: activeIndex >= 0, desc: 'Order has been placed.', date: '08 May' },
      { label: 'Processing', done: activeIndex >= 1, desc: 'Your order is being processed.', date: '09 May' },
      { label: 'Shipped', done: activeIndex >= 2, desc: 'DLPL Logistics – FMPC5FDG5G4', date: '10 May' },
      { label: 'Out for Delivery', done: activeIndex >= 3, desc: 'Your item is out for delivery.', date: '16 May' },
      { label: 'Delivered', done: activeIndex >= 4, desc: 'Your Item has been delivered.', date: '16 May' },
    ]
  }

  const timelineSteps = getTimelineSteps(d.status)

  return (
    <div className="orders-detail-view">
      {/* Custom Floating Toast */}
      {toastMessage && (
        <div className="orders-toast">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Approve Refund Modal */}
      {showApproveModal && (
        <div className="orders-modal-overlay" onClick={() => setShowApproveModal(false)}>
          <div className="orders-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{order.paymentMethod === 'Cash on Delivery' ? 'Approve COD Refund' : 'Approve Online Refund'}</h3>
            <p>Are you sure you want to approve this refund?</p>
            <div className="orders-modal-details">
              <div>Refund Amount: <strong>{order.complaint?.requestedAmount}</strong></div>
              <div>Reason: <strong>{order.complaint?.reason}</strong></div>
              <div>Payment Method: <strong>{order.paymentMethod}</strong></div>
              {order.paymentMethod === 'Cash on Delivery' ? (
                <div>Refund Method: <strong>{order.complaint?.refundMethod || 'Managed by backend'}</strong></div>
              ) : (
                <div>Refund Destination: <strong>Original payment method</strong></div>
              )}
            </div>
            <div className="orders-modal-buttons">
              <button className="orders-modal-btn cancel" onClick={() => setShowApproveModal(false)}>Cancel</button>
              <button 
                className="orders-modal-btn approve" 
                onClick={() => {
                  if (onApproveRefund) {
                    onApproveRefund({
                      orderId: order.id,
                      refundRequestId: order.complaint?.id || 'N/A',
                      paymentMethod: order.paymentMethod,
                      refundAmount: order.complaint?.requestedAmount,
                      reason: order.complaint?.reason
                    })
                  }
                  setShowApproveModal(false)
                  triggerToast("Refund request approved successfully!")
                }}
              >
                Approve Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Refund Modal */}
      {showRejectModal && (
        <div className="orders-modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="orders-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Reject Refund Request</h3>
            <p>Are you sure you want to reject this request?</p>
            <div className="orders-modal-details">
              <div>Reason: <strong>{order.complaint?.reason}</strong></div>
            </div>
            <div className="orders-modal-buttons">
              <button className="orders-modal-btn cancel" onClick={() => setShowRejectModal(false)}>Cancel</button>
              <button 
                className="orders-modal-btn reject" 
                onClick={() => {
                  if (onRejectRefund) {
                    onRejectRefund({
                      orderId: order.id
                    })
                  }
                  setShowRejectModal(false)
                  triggerToast("Refund request rejected successfully!")
                }}
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="orders-modal-overlay" onClick={() => !cancellingOrder && setShowCancelModal(false)}>
          <div className="orders-modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: '#b91c1c' }}>Cancel Order Confirmation</h3>
            <p>Are you sure you want to cancel this order? This action cannot be undone.</p>
            <div className="orders-modal-details">
              <div>Order ID: <strong>{order.id || order._id}</strong></div>
              <div>Customer: <strong>{d.customer.name}</strong></div>
              <div>Amount: <strong>{order.amount}</strong></div>
              <div>Current Status: <strong>{d.status}</strong></div>
            </div>
            <div className="orders-modal-buttons">
              <button 
                type="button" 
                className="orders-modal-btn cancel" 
                onClick={() => setShowCancelModal(false)}
                disabled={cancellingOrder}
              >
                Keep Order
              </button>
              <button 
                type="button" 
                className="orders-modal-btn danger" 
                disabled={cancellingOrder}
                onClick={async () => {
                  if (onCancelOrder) {
                    const ok = await onCancelOrder(order._id || order.id)
                    if (ok) {
                      setShowCancelModal(false)
                    }
                  }
                }}
              >
                {cancellingOrder ? 'Cancelling...' : 'Yes, Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back header with refresh option */}
      <div className="orders-detail-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="back-circle-btn" onClick={onBack} aria-label="Back to orders list">
            <ChevronLeft style={{ width: '18px', height: '18px' }} />
          </button>
          <h2>View Order Details</h2>
          {loading && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#3b82f6', fontWeight: '500' }}>
              <RotateCw className="spin-animation" style={{ width: '14px', height: '14px' }} />
              Updating details...
            </span>
          )}
        </div>
        {onRefresh && (
          <button 
            className="orders-refresh-btn" 
            onClick={onRefresh} 
            title="Refresh Order Details"
            disabled={loading}
          >
            <RotateCw className={loading ? 'spin-animation' : ''} style={{ width: '16px', height: '16px' }} />
          </button>
        )}
      </div>

      {/* Order number + status badge + Status updaters */}
      <div className="orders-detail-id-row">
        <div className="orders-title-info">
          <span className="orders-detail-order-no">Order {order.id || order._id}</span>
          <span className="orders-detail-invoice-no">Invoice ID: {d.orderNo}</span>
        </div>
        
        <div className="orders-detail-actions-panel">
          <div className="orders-action-select-group">
            <label htmlFor="order-status-dropdown">Status:</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select 
                id="order-status-dropdown"
                value={d.status}
                disabled={statusUpdating || cancellingOrder || d.status === 'Cancelled'}
                onChange={(e) => {
                  if (e.target.value === 'Cancelled') {
                    setShowCancelModal(true)
                  } else if (onUpdateStatus) {
                    onUpdateStatus(e.target.value)
                  }
                }}
                className="orders-action-select"
                title={d.status === 'Cancelled' ? 'Cancelled order status cannot be updated.' : 'Change Order Status'}
              >
                <option value="Ordered">Ordered (Placed)</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              {statusUpdating && (
                <RotateCw className="spin-animation" style={{ width: '15px', height: '15px', color: '#3b82f6' }} />
              )}
            </div>
          </div>

          {d.status !== 'Delivered' && d.status !== 'Cancelled' && (
            <button
              type="button"
              className="orders-cancel-btn"
              onClick={() => setShowCancelModal(true)}
              disabled={statusUpdating || cancellingOrder}
              title="Cancel this order"
            >
              <XCircle style={{ width: '14px', height: '14px' }} />
              {cancellingOrder ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}

          <div className="orders-action-select-group" style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start' }}>
            <span className="payment-label" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)' }}>
              Method: <strong style={{ color: 'var(--text-dark)' }}>{order.paymentMethod || 'Online'}</strong>
            </span>
            <span className="payment-label" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)' }}>
              Transaction: <strong style={{ color: 'var(--text-dark)', fontFamily: 'monospace' }}>{order.transactionId || 'Not available'}</strong>
            </span>
          </div>

          <div className="orders-action-select-group">
            <span className="payment-label" style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>Payment:</span>
            <span className={`orders-status-badge ${getPaymentClass(order.payment)}`} style={{ textTransform: 'capitalize', fontSize: '12px', padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              ● {order.payment === 'Refund' ? 'Refunded' : order.payment}
            </span>
          </div>

          <span className={`orders-status-badge ${getStatusClass(d.status)}`}>
            {d.status}
          </span>
        </div>
      </div>

      {/* Tracking Timeline */}
      <div className="orders-timeline-card">
        <div className="orders-timeline">
          {timelineSteps.map((step, idx) => (
            <div key={idx} className={`timeline-step ${step.done ? 'done' : ''}`}>
              <div className="timeline-dot-line">
                <div className={`timeline-dot ${step.done ? 'done' : ''} ${step.isRed ? 'red' : ''}`}>
                  {step.done && <Check className="timeline-check-icon" />}
                </div>
                {idx < timelineSteps.length - 1 && (
                  <div className={`timeline-connector ${timelineSteps[idx + 1].done ? 'done' : ''} ${timelineSteps[idx + 1].isRed ? 'red' : ''}`} />
                )}
              </div>
              <div className="timeline-info">
                <span className={`timeline-label ${step.done ? 'done' : ''} ${step.isRed ? 'red' : ''}`}>
                  {step.label}
                </span>
                <p className="timeline-desc">{step.desc}</p>
                <span className="timeline-date">{step.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Complaint / Refund Request Section */}
      <div className="orders-side-card orders-complaint-section" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)' }}>
        <h3 className="orders-complaint-section-title" style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '12px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
          Customer Complaint / Refund Request
        </h3>
        
        {!order.complaint ? (
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No refund request raised</p>
        ) : (
          <div className="orders-complaint-details" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <div>Reason: <strong style={{ color: 'var(--text-dark)' }}>{order.complaint.reason}</strong></div>
            <div>Requested Amount: <strong style={{ color: 'var(--text-dark)' }}>{order.complaint.requestedAmount}</strong></div>
            <div>Request Date: <strong style={{ color: 'var(--text-dark)' }}>{order.complaint.requestDate}</strong></div>
            <div>Order Status: <strong style={{ color: 'var(--text-dark)' }}>{order.status}</strong></div>
            <div>Payment Method: <strong style={{ color: 'var(--text-dark)' }}>{order.paymentMethod}</strong></div>
            
            {order.paymentMethod === 'Cash on Delivery' && (
              <div>Refund Method: <strong style={{ color: 'var(--text-dark)' }}>{order.complaint.refundMethod || 'Managed by backend'}</strong></div>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              Request Status: 
              <span className={`orders-status-badge ${order.complaint.status === 'Approved' ? 'status-delivered' : order.complaint.status === 'Rejected' ? 'status-cancelled' : 'status-shipped'}`} style={{ padding: '3px 8px', fontSize: '11px' }}>
                ● {order.complaint.status}
              </span>
            </div>

            {order.complaint.status === 'Approved' && order.complaint.refundStatus && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Refund Status:
                  <span className={`orders-status-badge ${order.complaint.refundStatus === 'Completed' ? 'status-delivered' : 'status-shipped'}`} style={{ padding: '3px 8px', fontSize: '11px' }}>
                    ● {order.complaint.refundStatus}
                  </span>
                </div>
                {order.complaint.refundDate && (
                  <div>Refund Date: <strong style={{ color: 'var(--text-dark)' }}>{order.complaint.refundDate}</strong></div>
                )}
                {order.complaint.refundMethod && (
                  <div>Refund Destination: <strong style={{ color: 'var(--text-dark)' }}>{order.complaint.refundMethod}</strong></div>
                )}
              </>
            )}

            {/* Approval / Rejection actions */}
            {order.complaint.status === 'Pending' && (
              <div style={{ gridColumn: '1 / -1', marginTop: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                {order.status !== 'Delivered' ? (
                  <span style={{ color: '#ea580c', fontWeight: '600', fontSize: '12px' }}>
                    ⚠️ Refund is available after delivery confirmation. Current Order Status: {order.status}
                  </span>
                ) : (
                  <>
                    <button 
                      className="orders-refund-btn" 
                      onClick={() => setShowRejectModal(true)}
                      style={{ backgroundColor: '#f1f5f9', color: '#475569', borderColor: '#cbd5e1' }}
                    >
                      Reject Request
                    </button>
                    <button 
                      className="orders-refund-btn" 
                      onClick={() => setShowApproveModal(true)}
                    >
                      Approve Refund
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product + Side panels */}
      <div className="orders-detail-main-grid">
        {/* Left column */}
        <div className="orders-detail-left">
          {/* Products List (Supports multiple products in an order) */}
          {d.products && d.products.length > 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-dark)', margin: '0 0 4px 0' }}>
                Order Products ({d.products.length})
              </h3>
              {d.products.map((prod, pIdx) => (
                <div 
                  key={prod.id || pIdx}
                  className="orders-product-card interactive"
                  onClick={() => triggerToast(`Viewing ${prod.name} in product catalog...`)}
                  title="Click to view product details"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="orders-product-img"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=200&h=200' }}
                  />
                  <div className="orders-product-info">
                    <span className="orders-product-category-tag">ITEM #{pIdx + 1}</span>
                    <h3 className="orders-product-name">{prod.name}</h3>
                    
                    <div className="orders-product-meta-tags">
                      <span className="meta-tag">Size: <strong>{prod.size}</strong></span>
                      <span className="meta-tag">Color: <strong>{prod.color}</strong></span>
                      <span className="meta-tag">Qty: <strong>{prod.qty}</strong></span>
                    </div>

                    <div className="orders-product-rating">
                      <Star className="star-icon" />
                      <span>{prod.rating} Rating</span>
                    </div>
                    <div className="orders-product-price-row">
                      <span className="orders-final-price">{prod.price}</span>
                      <span className="orders-original-price">{getOriginalPrice(prod.price, prod.discount)}</span>
                      <span className="orders-discount-badge">{prod.discount}% OFF</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div 
              className="orders-product-card interactive"
              onClick={() => triggerToast(`Viewing ${d.product.name} in product catalog...`)}
              title="Click to view product details"
            >
              <img
                src={d.product.image}
                alt={d.product.name}
                className="orders-product-img"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=200&h=200' }}
              />
              <div className="orders-product-info">
                <span className="orders-product-category-tag">PLATFORM PRODUCT</span>
                <h3 className="orders-product-name">{d.product.name}</h3>
                
                <div className="orders-product-meta-tags">
                  <span className="meta-tag">Size: <strong>{d.product.size}</strong></span>
                  <span className="meta-tag">Color: <strong>{d.product.color}</strong></span>
                  <span className="meta-tag">Qty: <strong>{d.product.qty}</strong></span>
                </div>

                <div className="orders-product-rating">
                  <Star className="star-icon" />
                  <span>{d.product.rating} Rating</span>
                </div>
                <div className="orders-product-price-row">
                  <span className="orders-final-price">{d.product.price}</span>
                  <span className="orders-original-price">{getOriginalPrice(d.product.price, d.product.discount)}</span>
                  <span className="orders-discount-badge">{d.product.discount}% OFF</span>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Summary */}
          <div className="orders-pricing-card">
            <div className="pricing-header">
              <h3>Pricing Details</h3>
            </div>
            <div className="pricing-row">
              <span>Total Product Price</span>
              <span>{d.pricing.product}</span>
            </div>
            <div className="pricing-row">
              <span>Delivery Charges</span>
              <span className="delivery-free">{d.pricing.delivery}</span>
            </div>
            <div className="pricing-row total">
              <span>Total Amount</span>
              <span className="total-value">{d.pricing.total}</span>
            </div>
            
            <div className="pricing-footer-flex" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}>
                <div className="orders-prepaid-badge" style={{ margin: 0 }}>
                  <CreditCard style={{ width: '14px', height: '14px' }} />
                  <span>{order.paymentMethod === 'Cash on Delivery' ? 'Cash on Delivery' : 'Prepaid Order'}</span>
                </div>
                {parseFloat(d.pricing.saved.replace(/[^\d]/g, '')) > 0 && (
                  <div className="orders-savings-note" style={{ margin: 0 }}>
                    🎉 You saved {d.pricing.saved} on this order
                  </div>
                )}
              </div>
              <div className="payment-metadata-rows" style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                <div>Payment Method: <strong style={{ color: 'var(--text-dark)' }}>{order.paymentMethod || 'Online'}</strong></div>
                <div>Transaction ID: <strong style={{ color: 'var(--text-dark)', fontFamily: 'monospace' }}>{order.transactionId || 'Not available'}</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="orders-detail-right">
          {/* Vendor Details */}
          <div className="orders-side-card interactive" onClick={(e) => handleCopy(d.vendor.name, 'Vendor Name', e)}>
            <div className="orders-side-card-header">
              <Store style={{ width: '16px', height: '16px' }} />
              Vendor Details
            </div>
            <div className="orders-side-content">
              <p className="orders-side-value bold">{d.vendor.name}</p>
              <div className="side-card-section">
                <p className="orders-side-label">Business Address</p>
                <p className="orders-side-value address-text">{d.vendor.address}</p>
              </div>
              <div className="side-card-section">
                <p className="orders-side-label">GST Number</p>
                <p className="orders-side-value gst-badge">{d.vendor.gst}</p>
              </div>
              <div className="side-card-actions">
                <button className="side-card-btn" onClick={(e) => handleCopy(d.vendor.gst, 'GST Number', e)}>
                  Copy GST
                </button>
                <button className="side-card-btn" onClick={(e) => handleCopy(d.vendor.address, 'Business Address', e)}>
                  Copy Address
                </button>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="orders-side-card interactive" onClick={(e) => handleCopy(d.customer.name, 'Customer Name', e)}>
            <div className="orders-side-card-header">
              <User style={{ width: '16px', height: '16px' }} />
              Customer Details
            </div>
            <div className="orders-side-content">
              <div className="customer-profile-row">
                <div className="customer-avatar-initials">
                  {d.customer.name ? d.customer.name.split(' ').map(n=>n[0]).join('') : 'C'}
                </div>
                <div>
                  <p className="orders-side-value bold">{d.customer.name}</p>
                  <p className="orders-side-value email-text">{d.customer.email}</p>
                </div>
              </div>
              <div className="side-card-actions">
                <a 
                  href={`mailto:${d.customer.email}`} 
                  className="side-card-btn" 
                  onClick={(e) => e.stopPropagation()}
                  style={{ textDecoration: 'none' }}
                >
                  Send Email
                </a>
                <button className="side-card-btn" onClick={(e) => handleCopy(d.customer.email, 'Customer Email', e)}>
                  Copy Email
                </button>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="orders-side-card interactive" onClick={(e) => handleCopy(d.shipping, 'Shipping Address', e)}>
            <div className="orders-side-card-header">
              <MapPin style={{ width: '16px', height: '16px' }} />
              Shipping Address
            </div>
            <div className="orders-side-content">
              <p className="orders-side-value bold">{d.customer.name}</p>
              <p className="orders-side-value address-text shipping-text">{d.shipping}</p>
              <div className="side-card-actions">
                <button className="side-card-btn" onClick={(e) => handleCopy(d.shipping, 'Shipping Address', e)}>
                  Copy Address
                </button>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.shipping)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="side-card-btn"
                  onClick={(e) => e.stopPropagation()}
                  style={{ textDecoration: 'none' }}
                >
                  View on Map
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Main Component
───────────────────────────────────────── */
function OrdersManagement({ initialSearchQuery }) {
  const [ordersList, setOrdersList] = useState(ORDERS)
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '')
  const [statusFilter, setStatusFilter] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('')
  const [selectAll, setSelectAll] = useState(false)
  const [selected, setSelected] = useState({})
  const [viewedOrder, setViewedOrder] = useState(null)
  const [orderDetailLoading, setOrderDetailLoading] = useState(false)
  const [orderDetailError, setOrderDetailError] = useState(null)

  // API State
  const [loading, setLoading] = useState(false)
  const [statusUpdating, setStatusUpdating] = useState(false)
  const [cancellingOrder, setCancellingOrder] = useState(false)
  const [fetchError, setFetchError] = useState(null)
  const [isApiLoaded, setIsApiLoaded] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 12645,
    limit: 10
  })

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type })
    setTimeout(() => {
      setToastMessage(prev => (prev?.text === text ? null : prev))
    }, 4000)
  }

  const renderToast = () => {
    if (!toastMessage) return null
    return (
      <div className={`product-toast-banner ${toastMessage.type}`}>
        {toastMessage.type === 'success' ? (
          <CheckCircle2 style={{ width: '18px', height: '18px', flexShrink: 0 }} />
        ) : (
          <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
        )}
        <span>{toastMessage.text}</span>
        <button
          type="button"
          onClick={() => setToastMessage(null)}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: 0,
            marginLeft: '8px',
            display: 'flex',
            alignItems: 'center'
          }}
          aria-label="Close notification"
        >
          <X style={{ width: '14px', height: '14px' }} />
        </button>
      </div>
    )
  }

  // Fetch All Orders from Backend API (GET /api/super-admin/orders)
  const fetchOrders = async () => {
    try {
      setLoading(true)
      setFetchError(null)

      const params = {
        page: currentPage,
        limit: itemsPerPage,
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim()
      }
      if (statusFilter) {
        params.status = statusFilter
      }
      if (paymentFilter) {
        params.payment = paymentFilter
      }

      const res = await getAllOrders(params)

      let ordersData = []
      if (res?.data?.orders && Array.isArray(res.data.orders)) {
        ordersData = res.data.orders
      } else if (res?.orders && Array.isArray(res.orders)) {
        ordersData = res.orders
      } else if (res?.data && Array.isArray(res.data)) {
        ordersData = res.data
      } else if (Array.isArray(res)) {
        ordersData = res
      }

      if (ordersData && ordersData.length > 0) {
        const formatted = ordersData.map((item, idx) => formatOrderItem(item, idx))
        setOrdersList(formatted)
        setIsApiLoaded(true)
      } else if (res?.success && isApiLoaded) {
        setOrdersList([])
      }

      const pagination = res?.data?.pagination || res?.pagination
      if (pagination) {
        setPaginationData({
          currentPage: pagination.currentPage || currentPage,
          limit: pagination.limit || itemsPerPage,
          totalOrders: pagination.totalOrders !== undefined ? pagination.totalOrders : ordersData.length,
          totalPages: pagination.totalPages || 1
        })
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err)
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to fetch orders.'
      setFetchError(errorMsg)
      if (!isApiLoaded) {
        console.info('Showing mock fallback orders due to API connection error.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Fetch Single Order By ID (GET /api/super-admin/orders/:id)
  const handleViewOrder = async (order) => {
    setViewedOrder(order)
    setOrderDetailLoading(false)
    setOrderDetailError(null)

    const orderId = order._id || order.id || order.orderId
    if (!orderId) return

    try {
      setOrderDetailLoading(true)
      const res = await getOrderById(orderId)
      const data = res?.data || res?.order || res

      if (data) {
        const formatted = formatOrderItem(data, 0)
        setViewedOrder(prev => ({
          ...(prev || order),
          ...formatted,
          id: prev?.id || formatted.id,
          orderNo: formatted.orderNo || prev?.orderNo || formatted.id,
        }))
      }
    } catch (err) {
      console.error('Failed to fetch order details by ID:', err)
      const errorMsg = err?.response?.data?.message || err?.message || 'Order not found.'
      setOrderDetailError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setOrderDetailLoading(false)
    }
  }

  // Reset page when filters or search change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, paymentFilter])

  // Fetch orders on mount and parameter changes
  useEffect(() => {
    fetchOrders()
  }, [currentPage, statusFilter, paymentFilter])

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchOrders()
    }, 400)
    return () => clearTimeout(handler)
  }, [searchQuery])

  useEffect(() => {
    if (initialSearchQuery !== undefined && initialSearchQuery.trim()) {
      setSearchQuery(initialSearchQuery)
      const found = ordersList.find((o) => o.id?.toLowerCase() === initialSearchQuery.toLowerCase().trim() || o.orderNo?.toLowerCase() === initialSearchQuery.toLowerCase().trim())
      if (found) {
        handleViewOrder(found)
      } else {
        const cleanQuery = initialSearchQuery.trim()
        if (cleanQuery.length > 5) {
          getOrderById(cleanQuery)
            .then(res => {
              if (res?.data) {
                const formatted = formatOrderItem(res.data, 0)
                setViewedOrder(formatted)
              }
            })
            .catch(() => {
              setViewedOrder(null)
            })
        } else {
          setViewedOrder(null)
        }
      }
    }
  }, [initialSearchQuery])

  // Calculate dynamic stats
  const totalOrdersCount = isApiLoaded && paginationData.totalOrders !== undefined
    ? paginationData.totalOrders.toLocaleString()
    : '12,645'

  const deliveredOrdersCount = isApiLoaded
    ? ordersList.filter(o => o.status === 'Delivered').length.toLocaleString()
    : '10,245'

  const processingOrdersCount = isApiLoaded
    ? ordersList.filter(o => o.status === 'Processing' || o.status === 'Ordered').length.toLocaleString()
    : '1,823'

  const cancelledOrdersCount = isApiLoaded
    ? ordersList.filter(o => o.status === 'Cancelled').length.toLocaleString()
    : '377'

  const stats = [
    { id: 'total', filterVal: '', label: 'Total Orders', value: totalOrdersCount, icon: ShoppingCart, bg: '#ffecb3', iconColor: '#3b82f6' },
    { id: 'delivered', filterVal: 'Delivered', label: 'Delivered Orders', value: deliveredOrdersCount, icon: CheckCircle2, bg: '#c8e6c9', iconColor: '#2ecc71' },
    { id: 'processing', filterVal: 'Processing', label: 'Processing Orders', value: processingOrdersCount, icon: RefreshCw, bg: '#b2dfdb', iconColor: '#3b82f6' },
    { id: 'cancelled', filterVal: 'Cancelled', label: 'Cancelled Orders', value: cancelledOrdersCount, icon: XCircle, bg: '#ffcdd2', iconColor: '#f43f5e' },
  ]

  const filteredOrders = ordersList.filter((o) => {
    const q = searchQuery.toLowerCase()
    const matchSearch =
      !q ||
      (o.id && o.id.toLowerCase().includes(q)) ||
      (o.orderNo && o.orderNo.toLowerCase().includes(q)) ||
      (o.customer && o.customer.toLowerCase().includes(q)) ||
      (o.vendor && o.vendor.toLowerCase().includes(q))
    const matchStatus = !statusFilter || o.status === statusFilter
    const matchPayment = !paymentFilter || o.payment === paymentFilter
    return matchSearch && matchStatus && matchPayment
  })

  // Pagination calculations
  const totalItems = isApiLoaded && paginationData.totalOrders !== undefined ? paginationData.totalOrders : filteredOrders.length
  const totalPages = isApiLoaded && paginationData.totalPages !== undefined ? paginationData.totalPages : (Math.ceil(filteredOrders.length / itemsPerPage) || 1)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOrders = isApiLoaded ? filteredOrders : filteredOrders.slice(startIndex, startIndex + itemsPerPage)

  const handleSelectAll = (e) => {
    const checked = e.target.checked
    setSelectAll(checked)
    const newSelected = {}
    if (checked) filteredOrders.forEach((o) => (newSelected[o.id] = true))
    setSelected(newSelected)
  }

  const handleRowSelect = (id) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Update Order Status (PATCH /api/super-admin/orders/:id/status)
  const handleUpdateOrderStatus = async (newStatus) => {
    if (!viewedOrder) return
    const orderId = viewedOrder._id || viewedOrder.id || viewedOrder.orderId
    if (!orderId) {
      showToast('Order ID not found.', 'error')
      return
    }

    if (viewedOrder.status === 'Cancelled') {
      showToast('Cancelled order status cannot be updated.', 'error')
      return
    }

    const backendStatus = mapFrontendToBackendStatus(newStatus)
    try {
      setStatusUpdating(true)
      const res = await updateOrderStatus(orderId, backendStatus)
      const updatedStatusBackend = res?.data?.orderStatus || backendStatus
      const updatedStatus = mapBackendToFrontendStatus(updatedStatusBackend)
      const successMsg = res?.message || 'Order status updated successfully.'

      // Update both ordersList and viewedOrder
      setOrdersList(prev => prev.map(o => (o._id === orderId || o.id === orderId || o.id === viewedOrder.id) ? { ...o, status: updatedStatus } : o))
      setViewedOrder(prev => (prev ? { ...prev, status: updatedStatus } : prev))
      showToast(successMsg, 'success')
    } catch (err) {
      console.error('Failed to update order status:', err)
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to update order status.'
      showToast(errorMsg, 'error')
    } finally {
      setStatusUpdating(false)
    }
  }

  // Cancel Order (PATCH /api/super-admin/orders/:id/cancel)
  const handleCancelOrder = async (orderId) => {
    const targetId = orderId || viewedOrder?._id || viewedOrder?.id || viewedOrder?.orderId
    if (!targetId) {
      showToast('Order ID not found.', 'error')
      return false
    }

    // Client-side validations matching API specs
    const currentOrder = viewedOrder || ordersList.find(o => o.id === targetId || o._id === targetId)
    if (currentOrder?.status === 'Cancelled' || currentOrder?.isCancelled) {
      showToast('Order is already cancelled.', 'error')
      return false
    }
    if (currentOrder?.status === 'Delivered') {
      showToast('Delivered order cannot be cancelled.', 'error')
      return false
    }

    try {
      setCancellingOrder(true)
      const res = await cancelOrder(targetId)
      const successMsg = res?.message || 'Order cancelled successfully.'

      // Update both ordersList and viewedOrder
      setOrdersList(prev => prev.map(o => (o._id === targetId || o.id === targetId || o.id === viewedOrder?.id) ? { ...o, status: 'Cancelled', isCancelled: true } : o))
      setViewedOrder(prev => (prev ? { ...prev, status: 'Cancelled', isCancelled: true } : prev))
      showToast(successMsg, 'success')
      return true
    } catch (err) {
      console.error('Failed to cancel order:', err)
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to cancel order.'
      showToast(errorMsg, 'error')
      return false
    } finally {
      setCancellingOrder(false)
    }
  }

  if (viewedOrder) {
    return (
      <OrderDetailView 
        order={viewedOrder} 
        loading={orderDetailLoading}
        statusUpdating={statusUpdating}
        cancellingOrder={cancellingOrder}
        onRefresh={() => handleViewOrder(viewedOrder)}
        onBack={() => setViewedOrder(null)} 
        onUpdateStatus={handleUpdateOrderStatus}
        onCancelOrder={handleCancelOrder}
        onApproveRefund={(refundData) => {
          setOrdersList(prev => prev.map(o => {
            if (o.id === viewedOrder.id) {
              return {
                ...o,
                complaint: {
                  ...o.complaint,
                  status: 'Approved',
                  refundStatus: 'Processing'
                }
              }
            }
            return o
          }))
          setViewedOrder(prev => {
            if (prev) {
              return {
                ...prev,
                complaint: {
                  ...prev.complaint,
                  status: 'Approved',
                  refundStatus: 'Processing'
                }
              }
            }
            return prev
          })
        }}
        onRejectRefund={(refundData) => {
          setOrdersList(prev => prev.map(o => {
            if (o.id === viewedOrder.id) {
              return {
                ...o,
                complaint: {
                  ...o.complaint,
                  status: 'Rejected'
                }
              }
            }
            return o
          }))
          setViewedOrder(prev => {
            if (prev) {
              return {
                ...prev,
                complaint: {
                  ...prev.complaint,
                  status: 'Rejected'
                }
              }
            }
            return prev
          })
        }}
      />
    )
  }

  return (
    <div className="orders-management-view">
      {/* Toast Notification */}
      {renderToast()}

      {/* Page title */}
      <div className="orders-page-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Orders</h1>
          <p>Manage all Orders Placed on the platform.</p>
        </div>
        <button 
          className="orders-refresh-btn" 
          onClick={fetchOrders} 
          title="Refresh Orders"
          disabled={loading}
        >
          <RotateCw className={loading ? 'spin-animation' : ''} style={{ width: '18px', height: '18px' }} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="orders-stats-grid">
        {stats.map((s) => {
          const Icon = s.icon
          const isActive = statusFilter === s.filterVal
          return (
            <div 
              key={s.id} 
              className={`orders-stat-card clickable ${isActive ? 'active-filter' : ''}`} 
              style={{ backgroundColor: s.bg, cursor: 'pointer', color: s.iconColor }}
              onClick={() => setStatusFilter(s.filterVal)}
            >
              <div className="orders-stat-icon" style={{ color: s.iconColor }}>
                <Icon />
              </div>
              <div className="orders-stat-value">{s.value}</div>
              <div className="orders-stat-label">{s.label}</div>
            </div>
          )
        })}
      </div>

      {/* Table Card */}
      <div className="dashboard-card-panel">
        {/* Filters */}
        <div className="table-filter-bar">
          <div className="table-search-wrapper">
            <Search />
            <input
              type="text"
              placeholder="Search by Order ID, Customer, Vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="orders-filter-selects">
            <div className="orders-select-wrapper">
              <select
                className="status-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Delivered">Delivered</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <ChevronDown className="select-chevron" />
            </div>

            <div className="orders-select-wrapper">
              <select
                className="status-select"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option value="">All Payments</option>
                <option value="Paid">Paid</option>
                <option value="Refund">Refund</option>
                <option value="Pending">Pending</option>
              </select>
              <ChevronDown className="select-chevron" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="admins-table-wrapper">
          <table className="admins-table orders-table">
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    className="admins-table-checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Vendor Name</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && ordersList.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                    <div className="orders-loading-state">
                      <RotateCw className="spin-animation" style={{ width: '28px', height: '28px', color: '#3b82f6' }} />
                      <span>Loading orders...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <tr key={order.id || order._id}>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        className="admins-table-checkbox"
                        checked={!!selected[order.id]}
                        onChange={() => handleRowSelect(order.id)}
                      />
                    </td>
                    <td className="order-id-cell">{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.vendor}</td>
                    <td className="order-amount-cell">{order.amount}</td>
                    <td>
                      <span className={`orders-payment-badge ${getPaymentClass(order.payment)}`}>
                        {order.payment}
                      </span>
                    </td>
                    <td>
                      <span className={`orders-status-badge ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="orders-view-btn"
                        aria-label={`View order ${order.id}`}
                        onClick={() => handleViewOrder(order)}
                        title="View Order Details"
                      >
                        <Eye style={{ width: '16px', height: '16px' }} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: '#90a4ae' }}>
                    No orders found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Entries and Pagination */}
        <div className="offers-table-footer">
          <div className="footer-entries-text">
            Showing {Math.min(startIndex + 1, totalItems || paginatedOrders.length)} to {Math.min(startIndex + itemsPerPage, totalItems || paginatedOrders.length)} of {totalItems || paginatedOrders.length} Entries
          </div>
          <div className="offers-pagination">
            <button 
              className="pag-btn" 
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              aria-label="Previous Page"
            >
              &lt;
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum = i + 1
              if (totalPages > 7 && currentPage > 4) {
                pageNum = currentPage - 3 + i
                if (pageNum > totalPages) pageNum = totalPages - (6 - i)
              }
              return (
                <button 
                  key={pageNum}
                  className={`pag-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              )
            })}
            <button 
              className="pag-btn" 
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
              aria-label="Next Page"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrdersManagement
