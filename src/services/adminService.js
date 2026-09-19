import api from './api';

/**
 * Create Admin (POST /api/superadmin/admins/register)
 * Method: POST
 * Headers: Authorization: Bearer <Token>
 * @param {Object} data - { name, email, phone, password, role }
 */
export const registerAdmin = async ({ name, fullName, email, phone, mobile, password, role = 'ADMIN', gender = 'Male', status = 'ACTIVE' }) => {
  const payload = {
    fullName: fullName || name,
    name: name || fullName,
    email,
    password,
    role,
    gender: gender || 'Male',
    status: status || 'ACTIVE',
  };
  const phoneValue = (phone || mobile || '').toString().trim();
  if (phoneValue && phoneValue !== 'N/A') {
    payload.mobile = phoneValue;
    payload.phone = phoneValue;
  }
  const response = await api.post('/superadmin/admins/register', payload);
  return response.data;
};

export const createAdmin = registerAdmin;

/**
 * 1 - Create Super Admin
 * Method: POST
 * Endpoint: /api/super-admin/create
 * Headers: Authorization: Bearer <Token>
 * @param {Object} data - { name, email, password }
 */
export const createSuperAdmin = async ({ name, email, password }) => {
  const response = await api.post('/super-admin/create', {
    name,
    email,
    password,
  });
  return response.data;
};

/**
 * Assign Permissions (POST /api/superadmin/permissions/assign)
 * Method: POST
 * Endpoint: /api/superadmin/permissions/assign
 * Headers: Authorization: Bearer <Token>
 * @param {Object} data - { adminId, permissions: [{ module, actions }] }
 */
export const assignPermissions = async ({ adminId, permissions }) => {
  const response = await api.post('/superadmin/permissions/assign', {
    adminId,
    permissions,
  });
  return response.data;
};

/**
 * Get All Permissions (GET /api/superadmin/permissions/get-all)
 * Method: GET
 * Endpoint: /api/superadmin/permissions/get-all
 * Headers: Authorization: Bearer <Token>
 */
export const getAllPermissions = async () => {
  const response = await api.get('/superadmin/permissions/get-all');
  return response.data;
};

/**
 * Get Permissions by Admin ID (GET /api/superadmin/permissions/get-by-admin/:adminId)
 * Method: GET
 * Endpoint: /api/superadmin/permissions/get-by-admin/:adminId
 * Headers: Authorization: Bearer <Token>
 * @param {string} adminId - Admin ID
 */
export const getPermissionsByAdminId = async (adminId) => {
  const response = await api.get(`/superadmin/permissions/get-by-admin/${adminId}`);
  return response.data;
};

/**
 * Update Permissions (PUT /api/superadmin/permissions/update/:adminId)
 * Method: PUT
 * Endpoint: /api/superadmin/permissions/update/:adminId
 * Headers: Authorization: Bearer <Token>
 * @param {string} adminId - Admin ID
 * @param {Object} data - { permissions: [{ module, actions }] }
 */
export const updatePermissions = async (adminId, { permissions }) => {
  const response = await api.put(`/superadmin/permissions/update/${adminId}`, {
    permissions,
  });
  return response.data;
};

/**
 * Delete Permissions (DELETE /api/superadmin/permissions/delete/:adminId)
 * Method: DELETE
 * Endpoint: /api/superadmin/permissions/delete/:adminId
 * Headers: Authorization: Bearer <Token>
 * @param {string} adminId - Admin ID
 */
export const deletePermissions = async (adminId) => {
  const response = await api.delete(`/superadmin/permissions/delete/${adminId}`);
  return response.data;
};

/**
 * Check Module Permission (GET /api/superadmin/permissions/check/:adminId/:module)
 * Method: GET
 * Endpoint: /api/superadmin/permissions/check/:adminId/:module
 * Headers: Authorization: Bearer <Token>
 * @param {string} adminId - Admin ID
 * @param {string} moduleName - Module Name / Code
 */
export const checkModulePermission = async (adminId, moduleName) => {
  const response = await api.get(`/superadmin/permissions/check/${adminId}/${encodeURIComponent(moduleName)}`);
  return response.data;
};

/**
 * Get All Admins (GET /api/superadmin/admins/get-all)
 * Method: GET
 * Headers: Authorization: Bearer <Token>
 */
export const getAllAdmins = async () => {
  const response = await api.get('/superadmin/admins/get-all');
  return response.data;
};

/**
 * Get Admin By ID (GET /api/superadmin/admins/get-byid/:id)
 * Method: GET
 * Headers: Authorization: Bearer <Token>
 */
export const getAdminById = async (id) => {
  const response = await api.get(`/superadmin/admins/get-byid/${id}`);
  return response.data;
};

/**
 * 8 - Update Admin (PUT /api/superadmin/admins/update/:id)
 * Method: PUT
 * Endpoint: /api/superadmin/admins/update/:id
 * Headers: Authorization: Bearer <Token>
 * @param {string} id - Admin ID
 * @param {Object} data - { name, email, phone, role }
 */
export const updateAdmin = async (id, { name, email, phone, role = 'ADMIN' }) => {
  const response = await api.put(`/superadmin/admins/update/${id}`, {
    name,
    email,
    phone,
    role,
  });
  return response.data;
};

/**
 * Activate / Deactivate Admin (PATCH /api/superadmin/admins/status/:id/status)
 * Method: PATCH
 * Endpoint: /api/superadmin/admins/status/:id/status
 * Headers: Authorization: Bearer <Token>
 * @param {string} id - Admin ID
 * @param {string|boolean} status - 'ACTIVE' / 'INACTIVE' or boolean
 */
export const updateAdminStatus = async (id, status) => {
  const boolIsActive = typeof status === 'boolean'
    ? status
    : (typeof status === 'string' ? (status.toUpperCase() === 'ACTIVE' || status.toLowerCase() === 'active') : Boolean(status));
  const response = await api.patch(`/superadmin/admins/status/${id}/status`, {
    isActive: boolIsActive,
    status: boolIsActive ? 'ACTIVE' : 'INACTIVE',
  });
  return response.data;
};

/**
 * 10 - Delete Admin (DELETE /api/superadmin/admins/delete/:id)
 * Method: DELETE
 * Endpoint: /api/superadmin/admins/delete/:id
 * Headers: Authorization: Bearer <Token>
 * @param {string} id - Admin ID
 */
/**
 * 11 - Get All Products (GET /api/superadmin/products)
 * Method: GET
 * Endpoint: /api/superadmin/products
 * Headers: Authorization: Bearer <Token>
 * @param {Object} params - Query parameters (page, limit, category, etc.)
 */
export const getAllProducts = async (params = {}) => {
  const response = await api.get('/superadmin/products', { params });
  return response.data;
};

/**
 * 13 - Create Product (POST /api/superadmin/products)
 * Method: POST
 * Endpoint: /api/superadmin/products
 * Headers: Authorization: Bearer <Token>, Content-Type: multipart/form-data
 * @param {FormData} formData - Multipart form data
 */
export const createProduct = async (formData) => {
  const response = await api.post('/superadmin/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// 18. Update Product (PUT /api/superadmin/products/:id)
export const updateProduct = async (id, data) => {
  const response = await api.put(`/superadmin/products/${id}`, data);
  return response.data;
};

// 19. Delete Product (DELETE /api/superadmin/products/:id)
export const deleteProduct = async (id) => {
  const response = await api.delete(`/superadmin/products/${id}`);
  return response.data;
};

/**
 * 20 - Update Product Status (PATCH /api/superadmin/products/:id/status)
 * Method: PATCH
 * Endpoint: /api/superadmin/products/:id/status
 * Headers: Authorization: Bearer <Token>
 * @param {string} id - Product ID
 * @param {string|boolean} status - 'ACTIVE' / 'INACTIVE' or boolean
 */
export const updateProductStatus = async (id, status) => {
  const response = await api.patch(`/superadmin/products/${id}/status`, {
    status: typeof status === 'string' ? status.toUpperCase() : (status ? 'ACTIVE' : 'INACTIVE'),
  });
  return response.data;
};

/**
 * 21 - Get All Customers (GET /api/superadmin/customers)
 * Method: GET
 * Endpoint: /api/superadmin/customers
 * Headers: Authorization: Bearer <Token>
 * @param {Object} params - Query parameters (page, limit, search, status)
 */
export const getAllCustomers = async (params = {}) => {
  const response = await api.get('/superadmin/customers', { params });
  return response.data;
};

/**
 * 22 - Get Customer By ID (GET /api/superadmin/customers/:id)
 * Method: GET
 * Endpoint: /api/superadmin/customers/:id
 * Headers: Authorization: Bearer <Token>
 * @param {string} id - Customer ID
 */
export const getCustomerById = async (id) => {
  const response = await api.get(`/superadmin/customers/${id}`);
  return response.data;
};

/**
 * 23 - Update Customer (PUT /api/superadmin/customers/:id)
 * Method: PUT
 * Endpoint: /api/superadmin/customers/:id
 * Headers: Authorization: Bearer <Token>
 * @param {string} id - Customer ID
 * @param {Object} data - { fullName, email, mobile, isVerified }
 */
export const updateCustomer = async (id, { fullName, name, email, mobile, phone, isVerified = true }) => {
  const response = await api.put(`/superadmin/customers/${id}`, {
    fullName: fullName || name,
    email,
    mobile: mobile || phone,
    isVerified,
  });
  return response.data;
};

/**
 * 24 - Activate / Deactivate Customer (PATCH /api/superadmin/customers/:id/status)
 * Method: PATCH
 * Endpoint: /api/superadmin/customers/:id/status
 * Headers: Authorization: Bearer <Token>
 * @param {string} id - Customer ID
 * @param {boolean|string} isActive - Status flag
 */
export const updateCustomerStatus = async (id, isActive) => {
  const payloadIsActive = typeof isActive === 'boolean' 
    ? isActive 
    : (typeof isActive === 'string' ? (isActive.toUpperCase() === 'ACTIVE' || isActive.toLowerCase() === 'active') : Boolean(isActive));
  const response = await api.patch(`/superadmin/customers/${id}/status`, {
    isActive: payloadIsActive,
  });
  return response.data;
};

/**
 * 25 - Delete Customer (DELETE /api/superadmin/customers/:id)
 * Method: DELETE
 * Endpoint: /api/superadmin/customers/:id
 * Headers: Authorization: Bearer <Token>
 * @param {string} id - Customer ID
 */
export const deleteCustomer = async (id) => {
  const response = await api.delete(`/superadmin/customers/${id}`);
  return response.data;
};

/**
 * 26 - Get All Vendors (GET /api/superadmin/vendors)
 * Method: GET
 * Endpoint: /api/superadmin/vendors
 * Headers: Authorization: Bearer <Token>
 * @param {Object} params - { page, limit, search, approvalStatus, status }
 */
export const getAllVendors = async (params = {}) => {
  const response = await api.get('/superadmin/vendors', { params });
  return response.data;
};

/**
 * 27 - Get Vendor By ID (GET /api/superadmin/vendors/:id)
 * Method: GET
 * Endpoint: /api/superadmin/vendors/:id
 * Headers: Authorization: Bearer <Token>
 * @param {string} id - Vendor ID
 */
export const getVendorById = async (id) => {
  const response = await api.get(`/superadmin/vendors/${id}`);
  return response.data;
};

/**
 * 28 - Update Vendor (PUT /api/superadmin/vendors/:id)
 * Method: PUT
 * Endpoint: /api/superadmin/vendors/:id
 * Headers: Authorization: Bearer <Token>
 * @param {string} id - Vendor ID
 * @param {Object} data - Updated vendor payload
 */
export const updateVendor = async (id, data) => {
  const response = await api.put(`/superadmin/vendors/${id}`, data);
  return response.data;
};

/**
 * 28b - Create Vendor (POST /api/superadmin/vendors)
 * Method: POST
 * Endpoint: /api/superadmin/vendors
 * Headers: Authorization: Bearer <Token>
 * @param {Object} data - New vendor payload
 */
export const createVendor = async (data) => {
  const response = await api.post('/superadmin/vendors', data);
  return response.data;
};

/**
 * 29 - Approve Vendor (PATCH /api/superadmin/vendors/:id/approve)
 * Method: PATCH
 * Endpoint: /api/superadmin/vendors/:id/approve
 * Headers: Authorization: Bearer <Token>
 * @param {string} id - Vendor ID
 */
export const approveVendor = async (id) => {
  const response = await api.patch(`/superadmin/vendors/${id}/approve`);
  return response.data;
};

/**
 * 30 - Reject Vendor (PATCH /api/superadmin/vendors/:id/reject)
 * Method: PATCH
 * Endpoint: /api/superadmin/vendors/:id/reject
 * Headers: Authorization: Bearer <Token>
 * @param {string} id - Vendor ID
 */
export const rejectVendor = async (id) => {
  const response = await api.patch(`/superadmin/vendors/${id}/reject`);
  return response.data;
};

/**
 * 31 - Activate / Deactivate Vendor (PATCH /api/superadmin/vendors/:id/status)
 * Method: PATCH
 * Endpoint: /api/superadmin/vendors/:id/status
 * Headers: Authorization: Bearer <Token>
 * @param {string} id - Vendor ID
 * @param {string|boolean} status - Account status ('Active' | 'Inactive')
 */
export const updateVendorStatus = async (id, status) => {
  const formattedStatus = typeof status === 'boolean'
    ? (status ? 'Active' : 'Inactive')
    : (typeof status === 'string'
      ? (status.toLowerCase() === 'active' ? 'Active' : 'Inactive')
      : (status ? 'Active' : 'Inactive'));

  const response = await api.patch(`/superadmin/vendors/${id}/status`, {
    accountStatus: formattedStatus,
  });
  return response.data;
};

/**
 * 32 - Delete Vendor (DELETE /api/superadmin/vendors/:id)
 * Method: DELETE
 * Endpoint: /api/superadmin/vendors/:id
 * Headers: Authorization: Bearer <Token>
 * @param {string} id - Vendor ID
 */
export const deleteVendor = async (id) => {
  const response = await api.delete(`/superadmin/vendors/${id}`);
  return response.data;
};

/**
 * 33 - Get All Categories (GET /api/superadmin/categories)
 * Method: GET
 * Endpoint: /api/superadmin/categories
 * Headers: Authorization: Bearer <Token>
 * @param {Object} params - Query parameters (page, limit, status, search, etc.)
 */
export const getAllCategories = async (params = {}) => {
  const response = await api.get('/superadmin/categories', { params });
  return response.data;
};

/**
 * 34 - Create Category (POST /api/superadmin/categories)
 * Method: POST
 * Endpoint: /api/superadmin/categories
 * Headers: Authorization: Bearer <Token>
 * @param {Object} data - { name, description, image, isActive }
 */
export const createCategory = async ({ name, description, image, isActive = true }) => {
  const response = await api.post('/superadmin/categories', {
    name,
    description,
    image,
    isActive,
  });
  return response.data;
};

/**
 * 35 - Get Category By ID (GET /api/superadmin/categories/:id)
 * Method: GET
 * Endpoint: /api/superadmin/categories/:id
 * Headers: Authorization: Bearer <Token>
 * @param {string} id - Category ID
 */
export const getCategoryById = async (id) => {
  const response = await api.get(`/superadmin/categories/${id}`);
  return response.data;
};

/**
 * 36 - Update Category (PUT /api/superadmin/categories/:id)
 * Method: PUT
 * Endpoint: /api/superadmin/categories/:id
 * Headers: Authorization: Bearer <Token>
 * @param {string} id - Category ID
 * @param {Object} data - { name, description, image, isActive }
 */
export const updateCategory = async (id, { name, description, image, isActive = true }) => {
  const response = await api.put(`/superadmin/categories/${id}`, {
    name,
    description,
    image,
    isActive,
  });
  return response.data;
};

/**
 * 37 - Delete Category (DELETE /api/superadmin/categories/:id)
 * Method: DELETE
 * Endpoint: /api/superadmin/categories/:id
 * Headers: Authorization: Bearer <Token>
 * @param {string} id - Category ID
 */
export const deleteCategory = async (id) => {
  const response = await api.delete(`/superadmin/categories/${id}`);
  return response.data;
};

/**
 * 38 - Activate / Deactivate Category (PATCH /api/superadmin/categories/:id/status)
 * Method: PATCH
 * Endpoint: /api/superadmin/categories/:id/status
 * Headers: Authorization: Bearer <Token>
 * @param {string} id - Category ID
 * @param {boolean} isActive - Category status boolean
 */
// 38. Activate / Deactivate Category (PATCH /api/superadmin/categories/:id/status)
export const updateCategoryStatus = async (id, isActive) => {
  const response = await api.patch(`/superadmin/categories/${id}/status`, {
    isActive: typeof isActive === 'boolean' ? isActive : isActive === 'active',
  });
  return response.data;
};

/**
 * 39 - Get All Orders (GET /api/super-admin/orders)
 * Method: GET
 * Endpoint: /api/super-admin/orders
 * Headers: Authorization: Bearer <Token>
 * @param {Object} params - Query parameters (page, limit, search, status, etc.)
 */
export const getAllOrders = async (params = {}) => {
  const response = await api.get('/super-admin/orders', { params });
  return response.data;
};

/**
 * 40 - Get Order By ID (GET /api/super-admin/orders/:id)
 * Method: GET
 * Endpoint: /api/super-admin/orders/:id
 * Headers: Authorization: Bearer <Token>
 * @param {string} id - Order ID
 */
export const getOrderById = async (id) => {
  const response = await api.get(`/super-admin/orders/${id}`);
  return response.data;
};

/**
 * 41 - Update Order Status (PATCH /api/super-admin/orders/:id/status)
 * Method: PATCH
 * Endpoint: /api/super-admin/orders/:id/status
 * Headers: Authorization: Bearer <Token>
 * @param {string} id - Order ID
 * @param {string} status - New status ('PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', etc.)
 */
export const updateOrderStatus = async (id, status) => {
  const response = await api.patch(`/super-admin/orders/${id}/status`, {
    status,
  });
  return response.data;
};

/**
 * 42 - Cancel Order (PATCH /api/super-admin/orders/:id/cancel)
 * Method: PATCH
 * Endpoint: /api/super-admin/orders/:id/cancel
 * Headers: Authorization: Bearer <Token>
 * @param {string} id - Order ID
 */
export const cancelOrder = async (id) => {
  const response = await api.patch(`/super-admin/orders/${id}/cancel`);
  return response.data;
};

/**
 * 43 - Get Orders By Customer (GET /api/super-admin/orders/customer/:customerId)
 * Method: GET
 * Endpoint: /api/super-admin/orders/customer/:customerId
 * Headers: Authorization: Bearer <Token>
 * @param {string} customerId - Customer ID
 * @param {object} params - Optional query params
 */
export const getOrdersByCustomer = async (customerId, params = {}) => {
  const response = await api.get(`/super-admin/orders/customer/${customerId}`, { params });
  return response.data;
};

/**
 * 44 - Get Orders By Vendor (GET /api/super-admin/orders/vendor/:vendorId)
 * Method: GET
 * Endpoint: /api/super-admin/orders/vendor/:vendorId
 * Headers: Authorization: Bearer <Token>
 * @param {string} vendorId - Vendor ID
 * @param {object} params - Optional query params
 */
export const getOrdersByVendor = async (vendorId, params = {}) => {
  const response = await api.get(`/super-admin/orders/vendor/${vendorId}`, { params });
  return response.data;
};

// Create Offer / Coupon (POST /api/super-admin/offers-coupons/create)
export const createOfferCoupon = async ({ type = 'OFFER', title, discount, status = true, ...extra }) => {
  const payload = {
    type: type ? type.toUpperCase() : 'OFFER',
    title: (title || '').trim(),
    discount: typeof discount === 'string' ? parseFloat(discount.replace(/[^0-9.]/g, '')) || 0 : Number(discount),
    status: typeof status === 'boolean' ? status : (status === 'Active' || status === 'ACTIVE' || status === true),
    ...extra,
  };
  const response = await api.post('/super-admin/offers-coupons/create', payload);
  return response.data;
};

// Get All Offers / Coupons (GET /api/super-admin/offers-coupons/get-all)
export const getAllOffersCoupons = async (params = {}) => {
  const response = await api.get('/super-admin/offers-coupons/get-all', { params });
  return response.data;
};

export const getOffersCoupons = getAllOffersCoupons;

// Get Offer / Coupon By ID (GET /api/super-admin/offers-coupons/get-byid/:id?type=OFFER)
export const getOfferCouponById = async (id, typeOrParams = 'OFFER') => {
  let params = {};
  if (typeof typeOrParams === 'string') {
    params = { type: typeOrParams.toUpperCase() };
  } else if (typeof typeOrParams === 'object' && typeOrParams !== null) {
    params = { ...typeOrParams };
    if (params.type) {
      params.type = params.type.toUpperCase();
    }
  }
  const response = await api.get(`/super-admin/offers-coupons/get-byid/${id}`, { params });
  return response.data;
};

export const getOfferById = (id) => getOfferCouponById(id, 'OFFER');
export const getCouponById = (id) => getOfferCouponById(id, 'COUPON');

// Update Offer / Coupon (PUT /api/super-admin/offers-coupons/update/:id)
export const updateOfferCoupon = async (id, { type = 'OFFER', title, discount, status = true, ...extra }) => {
  const payload = {
    type: type ? type.toUpperCase() : 'OFFER',
    title: (title || '').trim(),
    discount: typeof discount === 'string' ? parseFloat(discount.replace(/[^0-9.]/g, '')) || 0 : Number(discount),
    status: typeof status === 'boolean' ? status : (status === 'Active' || status === 'ACTIVE' || status === true),
    ...extra,
  };
  const response = await api.put(`/super-admin/offers-coupons/update/${id}`, payload);
  return response.data;
};

export const updateOffer = (id, data) => updateOfferCoupon(id, { ...data, type: 'OFFER' });
export const updateCoupon = (id, data) => updateOfferCoupon(id, { ...data, type: 'COUPON' });

// Update Offer / Coupon Status (PATCH /api/super-admin/offers-coupons/status/:id)
export const updateOfferCouponStatus = async (id, { type = 'OFFER', status }) => {
  const isStatusBool = typeof status === 'boolean'
    ? status
    : (status === 'Active' || status === 'ACTIVE' || status === true);
  const payload = {
    type: type ? type.toUpperCase() : 'OFFER',
    status: isStatusBool,
  };
  const response = await api.patch(`/super-admin/offers-coupons/status/${id}`, payload);
  return response.data;
};

export const updateOfferStatus = (id, status) => updateOfferCouponStatus(id, { type: 'OFFER', status });
export const updateCouponStatus = (id, status) => updateOfferCouponStatus(id, { type: 'COUPON', status });

// Delete Offer / Coupon (DELETE /api/super-admin/offers-coupons/delete/:id?type=OFFER)
export const deleteOfferCoupon = async (id, typeOrParams = 'OFFER') => {
  let params = {};
  if (typeof typeOrParams === 'string') {
    params = { type: typeOrParams.toUpperCase() };
  } else if (typeof typeOrParams === 'object' && typeOrParams !== null) {
    params = { ...typeOrParams };
    if (params.type) {
      params.type = params.type.toUpperCase();
    }
  }
  const response = await api.delete(`/super-admin/offers-coupons/delete/${id}`, { params });
  return response.data;
};

export const deleteOffer = (id) => deleteOfferCoupon(id, 'OFFER');
export const deleteCoupon = (id) => deleteOfferCoupon(id, 'COUPON');

/**
 * 45 - Get All Payments (GET /api/super-admin/payments)
 * Method: GET
 * Endpoint: /api/super-admin/payments
 * Headers: Authorization: Bearer <Token>
 * @param {object} params - Optional query parameters (page, limit, status, search, etc.)
 */
export const getAllPayments = async (params = {}) => {
  const response = await api.get('/super-admin/payments', { params });
  return response.data;
};

export const getPayments = getAllPayments;

/**
 * 46 - Get Payment Stats (GET /api/super-admin/payments/stats)
 * Method: GET
 * Endpoint: /api/super-admin/payments/stats
 * Headers: Authorization: Bearer <Token>
 */
export const getPaymentStats = async () => {
  const response = await api.get('/super-admin/payments/stats');
  return response.data;
};

export const getPaymentsStats = getPaymentStats;

/**
 * 47 - Get Failed Payments (GET /api/super-admin/payments/failed)
 * Method: GET
 * Endpoint: /api/super-admin/payments/failed
 * Headers: Authorization: Bearer <Token>
 * @param {object} params - Optional query parameters
 */
export const getFailedPayments = async (params = {}) => {
  const response = await api.get('/super-admin/payments/failed', { params });
  return response.data;
};

/**
 * 48 - Get Pending Payments (GET /api/super-admin/payments/pending)
 * Method: GET
 * Endpoint: /api/super-admin/payments/pending
 * Headers: Authorization: Bearer <Token>
 * @param {object} params - Optional query parameters
 */
export const getPendingPayments = async (params = {}) => {
  const response = await api.get('/super-admin/payments/pending', { params });
  return response.data;
};

/**
 * 49 - Get Payment Revenue (GET /api/super-admin/payments/revenue)
 * Method: GET
 * Endpoint: /api/super-admin/payments/revenue
 * Headers: Authorization: Bearer <Token>
 * @param {object} params - Optional query parameters
 */
export const getPaymentRevenue = async (params = {}) => {
  const response = await api.get('/super-admin/payments/revenue', { params });
  return response.data;
};

export const getPaymentsRevenue = getPaymentRevenue;

/**
 * 50 - Get Payment by Order ID (GET /api/super-admin/payments/:orderId)
 * Method: GET
 * Endpoint: /api/super-admin/payments/:orderId
 * Headers: Authorization: Bearer <Token>
 * @param {string} orderId - Order ID
 */
export const getPaymentByOrderId = async (orderId) => {
  const response = await api.get(`/super-admin/payments/${orderId}`);
  return response.data;
};

export const getPaymentByOrder = getPaymentByOrderId;

/**
 * 51 - Get Sales Report (GET /api/super-admin/reports/sales)
 * Method: GET
 * Endpoint: /api/super-admin/reports/sales
 * Headers: Authorization: Bearer <Token>
 * @param {object} params - Optional query parameters (startDate, endDate, etc.)
 */
export const getSalesReport = async (params = {}) => {
  const response = await api.get('/super-admin/reports/sales', { params });
  return response.data;
};

export const getSalesReports = getSalesReport;

/**
 * 52 - Get Products Report (GET /api/super-admin/reports/products)
 * Method: GET
 * Endpoint: /api/super-admin/reports/products
 * Headers: Authorization: Bearer <Token>
 * @param {object} params - Optional query parameters (startDate, endDate, etc.)
 */
export const getProductsReport = async (params = {}) => {
  const response = await api.get('/super-admin/reports/products', { params });
  return response.data;
};

export const getProductReports = getProductsReport;

/**
 * 53 - Get Orders Report (GET /api/super-admin/reports/orders)
 * Method: GET
 * Endpoint: /api/super-admin/reports/orders
 * Headers: Authorization: Bearer <Token>
 * @param {object} params - Optional query parameters (startDate, endDate, etc.)
 */
export const getOrdersReport = async (params = {}) => {
  const response = await api.get('/super-admin/reports/orders', { params });
  return response.data;
};

export const getOrderReports = getOrdersReport;

export default {
  registerAdmin,
  createAdmin,
  createSuperAdmin,
  assignPermissions,
  getAllPermissions,
  getPermissionsByAdminId,
  updatePermissions,
  deletePermissions,
  checkModulePermission,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  updateAdminStatus,
  deleteAdmin,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  updateCustomerStatus,
  deleteCustomer,
  getAllVendors,
  getVendorById,
  updateVendor,
  approveVendor,
  rejectVendor,
  updateVendorStatus,
  deleteVendor,
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  updateCategoryStatus,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getOrdersByCustomer,
  getOrdersByVendor,
  createOfferCoupon,
  getAllOffersCoupons,
  getOffersCoupons,
  getOfferCouponById,
  getOfferById,
  getCouponById,
  updateOfferCoupon,
  updateOffer,
  updateCoupon,
  updateOfferCouponStatus,
  updateOfferStatus,
  updateCouponStatus,
  deleteOfferCoupon,
  deleteOffer,
  deleteCoupon,
  getAllPayments,
  getPayments,
  getPaymentStats,
  getPaymentsStats,
  getFailedPayments,
  getPendingPayments,
  getPaymentRevenue,
  getPaymentsRevenue,
  getPaymentByOrderId,
  getPaymentByOrder,
  getSalesReport,
  getSalesReports,
  getProductsReport,
  getProductReports,
  getOrdersReport,
  getOrderReports,
};













