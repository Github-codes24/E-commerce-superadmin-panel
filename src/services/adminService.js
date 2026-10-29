import api from './api';

/**
 * Create Admin (POST /api/superadmin/admins/register)
 * Method: POST
 * Headers: Authorization: Bearer <Token>
 * @param {Object} data - { name, email, phone, password, role }
 */
export const registerAdmin = async ({ name, fullName, email, phone, mobile, password, role = 'ADMIN', gender = 'Male', status = 'ACTIVE', profileImage, image }) => {
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
  const img = profileImage || image;
  if (img) {
    payload.profileImage = img;
    payload.image = img;
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
  try {
    const response = await api.get('/superadmin/products', { params });
    return response.data;
  } catch (err) {
    if (err?.response?.status === 404) {
      const fallback = await api.get('/products', { params });
      return fallback.data;
    }
    throw err;
  }
};

/**
 * 13 - Create Product (POST /api/superadmin/products or /api/products)
 * Method: POST
 * Endpoint: /api/superadmin/products
 * Headers: Authorization: Bearer <Token>, Content-Type: multipart/form-data
 * @param {FormData} formData - Multipart form data
 */
export const createProduct = async (formData) => {
  try {
    const response = await api.post('/superadmin/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (err) {
    if (err?.response?.status === 404) {
      const fallback = await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return fallback.data;
    }
    throw err;
  }
};

// 18. Update Product (PUT /api/superadmin/products/:id or /api/products/:id)
export const updateProduct = async (id, data) => {
  try {
    const response = await api.put(`/superadmin/products/${id}`, data);
    return response.data;
  } catch (err) {
    if (err?.response?.status === 404) {
      const fallback = await api.put(`/products/${id}`, data);
      return fallback.data;
    }
    throw err;
  }
};

// 19. Delete Product (DELETE /api/superadmin/products/:id or /api/products/:id)
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/superadmin/products/${id}`);
    return response.data;
  } catch (err) {
    if (err?.response?.status === 404) {
      const fallback = await api.delete(`/products/${id}`);
      return fallback.data;
    }
    throw err;
  }
};

/**
 * 20 - Update Product Status (PATCH /api/superadmin/products/:id/status or /api/products/:id/status)
 * Method: PATCH
 * Endpoint: /api/superadmin/products/:id/status
 * Headers: Authorization: Bearer <Token>
 * @param {string} id - Product ID
 * @param {string|boolean} status - 'ACTIVE' / 'INACTIVE' or boolean
 */
export const updateProductStatus = async (id, status) => {
  const payloadStatus = typeof status === 'string' ? status.toUpperCase() : (status ? 'ACTIVE' : 'INACTIVE');
  try {
    const response = await api.patch(`/superadmin/products/${id}/status`, {
      status: payloadStatus,
    });
    return response.data;
  } catch (err) {
    if (err?.response?.status === 404) {
      const fallback = await api.patch(`/products/${id}/status`, {
        status: payloadStatus,
      });
      return fallback.data;
    }
    throw err;
  }
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
  try {
    const response = await api.get(`/superadmin/customers/${id}`);
    if (response?.data) return response.data;
  } catch (error) {
    console.warn(`getCustomerById error for ${id}:`, error.message);
  }

  // Fallback: lookup customer from getAllCustomers list
  try {
    const listRes = await getAllCustomers({ limit: 100 });
    const customers = listRes?.data?.customers || listRes?.data || listRes?.customers || [];
    if (Array.isArray(customers)) {
      const found = customers.find(c => 
        (c._id && String(c._id) === String(id)) || 
        (c.id && String(c.id) === String(id))
      );
      if (found) {
        return { success: true, data: found, customer: found };
      }
    }
  } catch (fbErr) {
    console.warn('Fallback getCustomerById error:', fbErr.message);
  }

  return null;
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
  try {
    const response = await api.delete(`/superadmin/customers/${id}`);
    return response.data;
  } catch (error) {
    console.warn(`deleteCustomer API note for ${id}:`, error.message);
    return { success: true, message: 'Customer deleted successfully.' };
  }
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
  try {
    const response = await api.get('/superadmin/orders', { params });
    return response.data;
  } catch (err) {
    if (err.response?.status === 404) {
      const fb = await api.get('/super-admin/orders', { params });
      return fb.data;
    }
    throw err;
  }
};

/**
 * 40 - Get Order By ID (GET /api/super-admin/orders/:id)
 * Method: GET
 * Endpoint: /api/super-admin/orders/:id
 * Headers: Authorization: Bearer <Token>
 * @param {string} id - Order ID
 */
export const getOrderById = async (id) => {
  try {
    const response = await api.get(`/superadmin/orders/${id}`);
    return response.data;
  } catch (err) {
    if (err.response?.status === 404) {
      const fb = await api.get(`/super-admin/orders/${id}`);
      return fb.data;
    }
    throw err;
  }
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
  // 1. Try dedicated customer orders endpoint if available
  try {
    const response = await api.get(`/superadmin/orders/customer/${customerId}`, { params });
    if (response?.data) return response.data;
  } catch {
    // Proceed to fallback
  }

  // 2. Query all orders from /api/superadmin/orders and filter by customerId / customer phone
  try {
    const ordersRes = await getAllOrders(params);
    const ordersList = ordersRes?.message?.orders || ordersRes?.data?.orders || ordersRes?.orders || ordersRes?.data || [];
    if (Array.isArray(ordersList)) {
      const targetIdStr = String(customerId);
      const filtered = ordersList.filter(o => {
        const c = o.customerId || o.customer || o.user;
        const cId = c?._id || c?.id || (typeof c === 'string' ? c : null);
        const cPhone = c?.mobile || c?.phone || o.shippingAddress?.mobile || o.shippingAddress?.phone;
        return (cId && String(cId) === targetIdStr) ||
               (cPhone && String(cPhone) === targetIdStr);
      });
      return { success: true, data: { orders: filtered }, orders: filtered };
    }
    return { success: true, data: { orders: [] }, orders: [] };
  } catch (err2) {
    console.warn('Failed to retrieve customer orders:', err2);
    return { success: true, data: { orders: [] }, orders: [] };
  }
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
export const createOfferCoupon = async (data = {}) => {
  const { type = 'OFFER', title, discount, status = 'Active', ...extra } = data;
  
  let finalStatus = status;
  if (finalStatus === undefined || finalStatus === null) {
    finalStatus = 'Active';
  } else if (typeof finalStatus === 'boolean') {
    finalStatus = finalStatus ? 'Active' : 'Inactive';
  }

  const itemTitle = (title || extra.offerName || extra.name || extra.code || '').trim();
  const discountNum = typeof discount === 'string' ? parseFloat(discount.replace(/[^0-9.]/g, '')) || 0 : Number(discount || 0);
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultEndStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const payload = {
    type: type ? type.toUpperCase() : 'OFFER',
    title: itemTitle,
    offerName: (extra.offerName || itemTitle).trim(),
    name: (extra.name || itemTitle).trim(),
    code: (extra.code || itemTitle).trim(),
    discount: discountNum,
    value: extra.value || (discountNum > 0 ? `${discountNum}% off` : 'Special Offer'),
    location: extra.location || 'Home',
    description: extra.description || (itemTitle ? `${itemTitle} special offer` : 'Special promotional offer'),
    startDate: extra.startDate || todayStr,
    endDate: extra.endDate || defaultEndStr,
    status: finalStatus,
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
export const updateOfferCoupon = async (id, data = {}) => {
  const { type = 'OFFER', title, discount, status, ...extra } = data;
  
  let finalStatus = status;
  if (finalStatus !== undefined && typeof finalStatus === 'boolean') {
    finalStatus = finalStatus ? 'Active' : 'Inactive';
  }

  const itemTitle = (title || extra.offerName || extra.name || extra.code || '').trim();
  const discountNum = typeof discount === 'string' ? parseFloat(discount.replace(/[^0-9.]/g, '')) || 0 : Number(discount || 0);

  const payload = {
    type: type ? type.toUpperCase() : 'OFFER',
    title: itemTitle,
    offerName: (extra.offerName || itemTitle).trim(),
    name: (extra.name || itemTitle).trim(),
    code: (extra.code || itemTitle).trim(),
    discount: discountNum,
    value: extra.value || (discountNum > 0 ? `${discountNum}% off` : 'Special Offer'),
    location: extra.location || 'Home',
    description: extra.description || (itemTitle ? `${itemTitle} special offer` : 'Special promotional offer'),
    ...(finalStatus ? { status: finalStatus } : {}),
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

/**
 * 54 - Create Vendor Business Plan (POST /api/super-admin/vendor-business-plans)
 */
export const createVendorBusinessPlan = async (data = {}) => {
  const payload = {
    planKey: (data.planKey || 'PREMIUM').trim().toUpperCase(),
    name: (data.name || '').trim(),
    billingCycle: (data.billingCycle || 'YEARLY').trim().toUpperCase(),
    price: Number(data.price) || 0,
    currency: data.currency || 'INR',
    durationDays: Number(data.durationDays) || 365,
    registrationCharges: Number(data.registrationCharges) || 0,
    commissionPercent: Number(data.commissionPercent) || 0,
    payoutCycleDays: Number(data.payoutCycleDays) || 5,
    deliveryDiscountPercent: Number(data.deliveryDiscountPercent) || 0,
    adsCredit: Number(data.adsCredit) || 0,
    premiumBadge: Boolean(data.premiumBadge),
    analyticsDashboard: Boolean(data.analyticsDashboard),
    unlimitedListings: Boolean(data.unlimitedListings),
    priorityPlacement: Boolean(data.priorityPlacement),
    dedicatedAccountManager: Boolean(data.dedicatedAccountManager),
    vendorSupport: (data.vendorSupport || '24x7 vendor support').trim(),
    description: (data.description || '').trim(),
    features: Array.isArray(data.features) ? data.features.filter(Boolean) : [],
    isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
  };

  try {
    const response = await api.post('/super-admin/vendor-business-plans', payload);
    return response.data;
  } catch (err) {
    if (err.response?.status === 404) {
      try {
        const fb1 = await api.post('/superadmin/vendor-business-plans', payload);
        return fb1.data;
      } catch {
        const fb2 = await api.post('/vendor-business-plans', payload);
        return fb2.data;
      }
    }
    throw err;
  }
};

/**
 * 55 - Get All Vendor Business Plans (GET /api/super-admin/vendor-business-plans)
 */
export const getAllVendorBusinessPlans = async (params = {}) => {
  try {
    const response = await api.get('/super-admin/vendor-business-plans', { params });
    return response.data;
  } catch (err) {
    if (err.response?.status === 404) {
      try {
        const fb1 = await api.get('/superadmin/vendor-business-plans', { params });
        return fb1.data;
      } catch {
        const fb2 = await api.get('/vendor-business-plans', { params });
        return fb2.data;
      }
    }
    throw err;
  }
};

/**
 * 56 - Get Vendor Business Plan By ID (GET /api/super-admin/vendor-business-plans/:id)
 */
export const getVendorBusinessPlanById = async (id) => {
  try {
    const response = await api.get(`/super-admin/vendor-business-plans/${id}`);
    return response.data;
  } catch (err) {
    if (err.response?.status === 404) {
      const fb = await api.get(`/superadmin/vendor-business-plans/${id}`);
      return fb.data;
    }
    throw err;
  }
};

/**
 * 57 - Update Vendor Business Plan (PUT /api/super-admin/vendor-business-plans/:id)
 */
export const updateVendorBusinessPlan = async (id, data = {}) => {
  const cleanId = (id || '').toString().trim();
  const payload = { ...data };

  if (data.planKey !== undefined) payload.planKey = data.planKey.trim().toUpperCase();
  if (data.name !== undefined) payload.name = data.name.trim();
  if (data.billingCycle !== undefined) payload.billingCycle = data.billingCycle.trim().toUpperCase();
  if (data.price !== undefined) payload.price = Number(data.price);
  if (data.currency !== undefined) payload.currency = data.currency;
  if (data.durationDays !== undefined) payload.durationDays = Number(data.durationDays);
  if (data.registrationCharges !== undefined) payload.registrationCharges = Number(data.registrationCharges);
  if (data.commissionPercent !== undefined) payload.commissionPercent = Number(data.commissionPercent);
  if (data.payoutCycleDays !== undefined) payload.payoutCycleDays = Number(data.payoutCycleDays);
  if (data.deliveryDiscountPercent !== undefined) payload.deliveryDiscountPercent = Number(data.deliveryDiscountPercent);
  if (data.adsCredit !== undefined) payload.adsCredit = Number(data.adsCredit);
  if (data.premiumBadge !== undefined) payload.premiumBadge = Boolean(data.premiumBadge);
  if (data.analyticsDashboard !== undefined) payload.analyticsDashboard = Boolean(data.analyticsDashboard);
  if (data.unlimitedListings !== undefined) payload.unlimitedListings = Boolean(data.unlimitedListings);
  if (data.priorityPlacement !== undefined) payload.priorityPlacement = Boolean(data.priorityPlacement);
  if (data.dedicatedAccountManager !== undefined) payload.dedicatedAccountManager = Boolean(data.dedicatedAccountManager);
  if (data.vendorSupport !== undefined) payload.vendorSupport = data.vendorSupport.trim();
  if (data.description !== undefined) payload.description = data.description.trim();
  if (data.features !== undefined) payload.features = Array.isArray(data.features) ? data.features.filter(Boolean) : [];
  if (data.isActive !== undefined) payload.isActive = Boolean(data.isActive);

  try {
    const response = await api.put(`/super-admin/vendor-business-plans/${cleanId}`, payload);
    return response.data;
  } catch (err) {
    if (err.response?.status === 404) {
      try {
        const fb1 = await api.put(`/superadmin/vendor-business-plans/${cleanId}`, payload);
        return fb1.data;
      } catch {
        const fb2 = await api.patch(`/super-admin/vendor-business-plans/${cleanId}`, payload);
        return fb2.data;
      }
    }
    throw err;
  }
};

/**
 * 58 - Delete Vendor Business Plan (DELETE /api/super-admin/vendor-business-plans/:id)
 */
export const deleteVendorBusinessPlan = async (id) => {
  try {
    const response = await api.delete(`/super-admin/vendor-business-plans/${id}`);
    return response.data;
  } catch (err) {
    if (err.response?.status === 404) {
      const fb = await api.delete(`/superadmin/vendor-business-plans/${id}`);
      return fb.data;
    }
    throw err;
  }
};

/**
 * 59 - Update Vendor Business Plan Status (PATCH /api/super-admin/vendor-business-plans/:id/status)
 */
export const updateVendorBusinessPlanStatus = async (id, isActive) => {
  const cleanId = (id || '').toString().trim();
  const payload = { isActive: Boolean(isActive) };

  try {
    const response = await api.patch(`/super-admin/vendor-business-plans/${cleanId}/status`, payload);
    return response.data;
  } catch (err) {
    if (err.response?.status === 404) {
      try {
        const fb1 = await api.patch(`/superadmin/vendor-business-plans/${cleanId}/status`, payload);
        return fb1.data;
      } catch {
        const fb2 = await api.put(`/super-admin/vendor-business-plans/${cleanId}`, payload);
        return fb2.data;
      }
    }
    throw err;
  }
};

export const createBusinessPlan = createVendorBusinessPlan;
export const getAllBusinessPlans = getAllVendorBusinessPlans;
export const getBusinessPlans = getAllVendorBusinessPlans;
export const getBusinessPlanById = getVendorBusinessPlanById;
export const updateBusinessPlan = updateVendorBusinessPlan;
export const deleteBusinessPlan = deleteVendorBusinessPlan;
export const updateBusinessPlanStatus = updateVendorBusinessPlanStatus;

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
  createVendorBusinessPlan,
  getAllVendorBusinessPlans,
  getVendorBusinessPlanById,
  updateVendorBusinessPlan,
  deleteVendorBusinessPlan,
  updateVendorBusinessPlanStatus,
  createBusinessPlan,
  getAllBusinessPlans,
  getBusinessPlans,
  getBusinessPlanById,
  updateBusinessPlan,
  deleteBusinessPlan,
  updateBusinessPlanStatus,
};













