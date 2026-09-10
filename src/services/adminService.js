import api from './api';

/**
 * Create Admin (POST /api/superadmin/admins/register)
 * Method: POST
 * Headers: Authorization: Bearer <Token>
 * @param {Object} data - { name, email, phone, password, role }
 */
export const registerAdmin = async ({ name, fullName, email, phone, mobile, password, role = 'ADMIN', gender = 'Male', status = 'ACTIVE' }) => {
  const response = await api.post('/superadmin/admins/register', {
    fullName: fullName || name,
    name: name || fullName,
    email,
    mobile: mobile || phone || '9876543210',
    phone: phone || mobile || '9876543210',
    password,
    role,
    gender: gender || 'Male',
    status: status || 'ACTIVE',
  });
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
  const response = await api.patch(`/superadmin/admins/status/${id}/status`, {
    status: typeof status === 'string' ? status.toUpperCase() : (status ? 'ACTIVE' : 'INACTIVE'),
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

export default {
  registerAdmin,
  createAdmin,
  createSuperAdmin,
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
};






