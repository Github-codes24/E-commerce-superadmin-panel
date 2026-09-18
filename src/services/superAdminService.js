import api from './api';

/**
 * Super Admin APIs (/api/super-admin)
 */

// 1. Create Super Admin (POST /api/super-admin/create)
export const createSuperAdmin = async ({ name, email, password }) => {
  const response = await api.post('/super-admin/create', {
    name,
    email,
    password,
  });
  return response.data;
};

// 2. Super Admin Login (POST /api/super-admin/login)
export const loginSuperAdmin = async ({ email, password }) => {
  const response = await api.post('/super-admin/login', {
    email,
    password,
  });
  return response.data;
};

// 3. Forgot Password - Send OTP (POST /api/super-admin/forgot-password)
export const forgotPassword = async ({ email }) => {
  const response = await api.post('/super-admin/forgot-password', { email });
  return response.data;
};

// 4. Verify OTP (POST /api/super-admin/verify-otp)
export const verifyOtp = async ({ email, otp }) => {
  const response = await api.post('/super-admin/verify-otp', { email, otp });
  return response.data;
};

// 5. Get Super Admin Profile (GET /api/super-admin/profile)
export const getSuperAdminProfile = async () => {
  const response = await api.get('/super-admin/profile');
  return response.data;
};

// 6. Update Super Admin Profile (PUT /api/super-admin/profile/update)
export const updateSuperAdminProfile = async (profileData) => {
  const response = await api.put('/super-admin/profile/update', profileData);
  return response.data;
};

// 7. Change Password (POST /api/super-admin/change-password)
export const changePassword = async ({ oldPassword, newPassword }) => {
  const response = await api.post('/super-admin/change-password', {
    oldPassword,
    newPassword,
  });
  return response.data;
};

// 8. Get Super Admin Dashboard Stats (GET /api/super-admin/dashboard)
export const getDashboardStats = async () => {
  const response = await api.get('/super-admin/dashboard');
  return response.data;
};

// 8b. Assign Permissions (POST /api/superadmin/permissions/assign)
export const assignPermissions = async ({ adminId, permissions }) => {
  const response = await api.post('/superadmin/permissions/assign', {
    adminId,
    permissions,
  });
  return response.data;
};

// 8c. Get All Permissions (GET /api/superadmin/permissions/get-all)
export const getAllPermissions = async () => {
  const response = await api.get('/superadmin/permissions/get-all');
  return response.data;
};

// 8d. Get Permissions by Admin ID (GET /api/superadmin/permissions/get-by-admin/:adminId)
export const getPermissionsByAdminId = async (adminId) => {
  const response = await api.get(`/superadmin/permissions/get-by-admin/${adminId}`);
  return response.data;
};

// 8e. Update Permissions (PUT /api/superadmin/permissions/update/:adminId)
export const updatePermissions = async (adminId, { permissions }) => {
  const response = await api.put(`/superadmin/permissions/update/${adminId}`, {
    permissions,
  });
  return response.data;
};

// 8f. Delete Permissions (DELETE /api/superadmin/permissions/delete/:adminId)
export const deletePermissions = async (adminId) => {
  const response = await api.delete(`/superadmin/permissions/delete/${adminId}`);
  return response.data;
};

// 8g. Check Module Permission (GET /api/superadmin/permissions/check/:adminId/:module)
export const checkModulePermission = async (adminId, moduleName) => {
  const response = await api.get(`/superadmin/permissions/check/${adminId}/${encodeURIComponent(moduleName)}`);
  return response.data;
};

// 9. Register / Create Admin (POST /api/superadmin/admins/register)
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


// 10. Get All Admins (GET /api/superadmin/admins/get-all)
export const getAllAdmins = async () => {
  const response = await api.get('/superadmin/admins/get-all');
  return response.data;
};

// 11. Get Admin By ID (GET /api/superadmin/admins/get-byid/:id)
export const getAdminById = async (id) => {
  const response = await api.get(`/superadmin/admins/get-byid/${id}`);
  return response.data;
};

// 12. Update Admin (PUT /api/superadmin/admins/update/:id)
export const updateAdmin = async (id, { name, email, phone, role = 'ADMIN' }) => {
  const response = await api.put(`/superadmin/admins/update/${id}`, {
    name,
    email,
    phone,
    role,
  });
  return response.data;
};

// 13. Activate / Deactivate Admin (PATCH /api/superadmin/admins/status/:id/status)
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

// 14. Delete Admin (DELETE /api/superadmin/admins/delete/:id)
export const deleteAdmin = async (id) => {
  const response = await api.delete(`/superadmin/admins/delete/${id}`);
  return response.data;
};

// 15. Get All Products (GET /api/superadmin/products)
export const getAllProducts = async (params = {}) => {
  const response = await api.get('/superadmin/products', { params });
  return response.data;
};

// 16. Get Product By ID (GET /api/superadmin/products/:id)
export const getProductById = async (id) => {
  const response = await api.get(`/superadmin/products/${id}`);
  return response.data;
};

// 17. Create Product (POST /api/superadmin/products)
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

// 20. Update Product Status (PATCH /api/superadmin/products/:id/status)
export const updateProductStatus = async (id, status) => {
  const response = await api.patch(`/superadmin/products/${id}/status`, {
    status: typeof status === 'string' ? status.toUpperCase() : (status ? 'ACTIVE' : 'INACTIVE'),
  });
  return response.data;
};

// 21. Get All Customers (GET /api/superadmin/customers)
export const getAllCustomers = async (params = {}) => {
  const response = await api.get('/superadmin/customers', { params });
  return response.data;
};

// 22. Get Customer By ID (GET /api/superadmin/customers/:id)
export const getCustomerById = async (id) => {
  const response = await api.get(`/superadmin/customers/${id}`);
  return response.data;
};

// 23. Update Customer (PUT /api/superadmin/customers/:id)
export const updateCustomer = async (id, { fullName, name, email, mobile, phone, isVerified = true }) => {
  const response = await api.put(`/superadmin/customers/${id}`, {
    fullName: fullName || name,
    email,
    mobile: mobile || phone,
    isVerified,
  });
  return response.data;
};

// 24. Activate / Deactivate Customer (PATCH /api/superadmin/customers/:id/status)
export const updateCustomerStatus = async (id, isActive) => {
  const payloadIsActive = typeof isActive === 'boolean' 
    ? isActive 
    : (typeof isActive === 'string' ? (isActive.toUpperCase() === 'ACTIVE' || isActive.toLowerCase() === 'active') : Boolean(isActive));
  const response = await api.patch(`/superadmin/customers/${id}/status`, {
    isActive: payloadIsActive,
    status: payloadIsActive ? 'ACTIVE' : 'INACTIVE',
    isBlocked: !payloadIsActive,
  });
  return response.data;
};

// 25. Delete Customer (DELETE /api/superadmin/customers/:id)
export const deleteCustomer = async (id) => {
  const response = await api.delete(`/superadmin/customers/${id}`);
  return response.data;
};

// 26. Get All Vendors (GET /api/superadmin/vendors)
export const getAllVendors = async (params = {}) => {
  const response = await api.get('/superadmin/vendors', { params });
  return response.data;
};

// 27. Get Vendor By ID (GET /api/superadmin/vendors/:id)
export const getVendorById = async (id) => {
  const response = await api.get(`/superadmin/vendors/${id}`);
  return response.data;
};

// 28. Update Vendor (PUT /api/superadmin/vendors/:id)
export const updateVendor = async (id, data) => {
  const response = await api.put(`/superadmin/vendors/${id}`, data);
  return response.data;
};

// 28b. Create Vendor (POST /api/superadmin/vendors)
export const createVendor = async (vendorData) => {
  const response = await api.post('/superadmin/vendors', vendorData);
  return response.data;
};

// 29. Approve Vendor (PATCH /api/superadmin/vendors/:id/approve)
export const approveVendor = async (id) => {
  const response = await api.patch(`/superadmin/vendors/${id}/approve`);
  return response.data;
};

// 30. Reject Vendor (PATCH /api/superadmin/vendors/:id/reject)
export const rejectVendor = async (id) => {
  const response = await api.patch(`/superadmin/vendors/${id}/reject`);
  return response.data;
};

// 31. Activate / Deactivate Vendor (PATCH /api/superadmin/vendors/:id/status)
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

// 32. Delete Vendor (DELETE /api/superadmin/vendors/:id)
export const deleteVendor = async (id) => {
  const response = await api.delete(`/superadmin/vendors/${id}`);
  return response.data;
};

// 33. Get All Categories (GET /api/superadmin/categories)
export const getAllCategories = async (params = {}) => {
  const response = await api.get('/superadmin/categories', { params });
  return response.data;
};

// 34. Create Category (POST /api/superadmin/categories)
export const createCategory = async ({ name, description, image, isActive = true }) => {
  const response = await api.post('/superadmin/categories', {
    name,
    description,
    image,
    isActive,
  });
  return response.data;
};

// 35. Get Category By ID (GET /api/superadmin/categories/:id)
export const getCategoryById = async (id) => {
  const response = await api.get(`/superadmin/categories/${id}`);
  return response.data;
};

// 36. Update Category (PUT /api/superadmin/categories/:id)
export const updateCategory = async (id, { name, description, image, isActive = true }) => {
  const response = await api.put(`/superadmin/categories/${id}`, {
    name,
    description,
    image,
    isActive,
  });
  return response.data;
};

// 37. Delete Category (DELETE /api/superadmin/categories/:id)
export const deleteCategory = async (id) => {
  const response = await api.delete(`/superadmin/categories/${id}`);
  return response.data;
};

// 38. Activate / Deactivate Category (PATCH /api/superadmin/categories/:id/status)
export const updateCategoryStatus = async (id, isActive) => {
  const response = await api.patch(`/superadmin/categories/${id}/status`, {
    isActive: typeof isActive === 'boolean' ? isActive : isActive === 'active',
  });
  return response.data;
};

// 39. Get All Orders (GET /api/super-admin/orders)
export const getAllOrders = async (params = {}) => {
  const response = await api.get('/super-admin/orders', { params });
  return response.data;
};

// 40. Get Order By ID (GET /api/super-admin/orders/:id)
export const getOrderById = async (id) => {
  const response = await api.get(`/super-admin/orders/${id}`);
  return response.data;
};

// 41. Update Order Status (PATCH /api/super-admin/orders/:id/status)
export const updateOrderStatus = async (id, status) => {
  const response = await api.patch(`/super-admin/orders/${id}/status`, {
    status,
  });
  return response.data;
};

// 42. Cancel Order (PATCH /api/super-admin/orders/:id/cancel)
export const cancelOrder = async (id) => {
  const response = await api.patch(`/super-admin/orders/${id}/cancel`);
  return response.data;
};

// 43. Get Orders By Customer (GET /api/super-admin/orders/customer/:customerId)
export const getOrdersByCustomer = async (customerId, params = {}) => {
  const response = await api.get(`/super-admin/orders/customer/${customerId}`, { params });
  return response.data;
};

// 44. Get Orders By Vendor (GET /api/super-admin/orders/vendor/:vendorId)
export const getOrdersByVendor = async (vendorId, params = {}) => {
  const response = await api.get(`/super-admin/orders/vendor/${vendorId}`, { params });
  return response.data;
};

// 45. Get All Commissions (GET /api/super-admin/commissions)
export const getAllCommissions = async (params = {}) => {
  const response = await api.get('/super-admin/commissions', { params });
  return response.data;
};

// 46. Get Commission By ID (GET /api/super-admin/commissions/:id)
export const getCommissionById = async (id) => {
  const response = await api.get(`/super-admin/commissions/${id}`);
  return response.data;
};

// 47. Create Commission (POST /api/super-admin/commissions)
export const createCommission = async ({ categoryId, rate, status = 'ACTIVE' }) => {
  const response = await api.post('/super-admin/commissions', {
    categoryId,
    rate: typeof rate === 'string' ? parseFloat(rate.replace('%', '')) : Number(rate),
    status: typeof status === 'string' ? status.toUpperCase() : (status ? 'ACTIVE' : 'INACTIVE'),
  });
  return response.data;
};

// 48. Update Commission (PUT /api/super-admin/commissions/:id)
export const updateCommission = async (id, { categoryId, rate, status = 'ACTIVE' }) => {
  const response = await api.put(`/super-admin/commissions/${id}`, {
    categoryId,
    rate: typeof rate === 'string' ? parseFloat(rate.replace('%', '')) : Number(rate),
    status: typeof status === 'string' ? status.toUpperCase() : (status ? 'ACTIVE' : 'INACTIVE'),
  });
  return response.data;
};

// 49. Delete Commission (DELETE /api/super-admin/commissions/:id)
export const deleteCommission = async (id) => {
  const response = await api.delete(`/super-admin/commissions/${id}`);
  return response.data;
};

// 50. Create Offer / Coupon (POST /api/super-admin/offers-coupons/create)
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

// 51. Get All Offers / Coupons (GET /api/super-admin/offers-coupons/get-all)
export const getAllOffersCoupons = async (params = {}) => {
  const response = await api.get('/super-admin/offers-coupons/get-all', { params });
  return response.data;
};

export const getOffersCoupons = getAllOffersCoupons;

// 52. Get Offer / Coupon By ID (GET /api/super-admin/offers-coupons/get-byid/:id?type=OFFER)
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

// 53. Update Offer / Coupon (PUT /api/super-admin/offers-coupons/update/:id)
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

// 54. Update Offer / Coupon Status (PATCH /api/super-admin/offers-coupons/status/:id)
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

// 55. Delete Offer / Coupon (DELETE /api/super-admin/offers-coupons/delete/:id?type=OFFER)
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

// 56. Get All Payments (GET /api/super-admin/payments)
export const getAllPayments = async (params = {}) => {
  const response = await api.get('/super-admin/payments', { params });
  return response.data;
};

export const getPayments = getAllPayments;

// 57. Get Payment Stats (GET /api/super-admin/payments/stats)
export const getPaymentStats = async () => {
  const response = await api.get('/super-admin/payments/stats');
  return response.data;
};

export const getPaymentsStats = getPaymentStats;

// 58. Get Failed Payments (GET /api/super-admin/payments/failed)
export const getFailedPayments = async (params = {}) => {
  const response = await api.get('/super-admin/payments/failed', { params });
  return response.data;
};

export default {
  createSuperAdmin,
  loginSuperAdmin,
  forgotPassword,
  verifyOtp,
  getSuperAdminProfile,
  updateSuperAdminProfile,
  changePassword,
  getDashboardStats,
  assignPermissions,
  getAllPermissions,
  getPermissionsByAdminId,
  updatePermissions,
  deletePermissions,
  checkModulePermission,
  registerAdmin,
  createAdmin,
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
  getAllCommissions,
  getCommissionById,
  createCommission,
  updateCommission,
  deleteCommission,
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
};














