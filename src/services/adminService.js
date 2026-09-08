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
export const deleteAdmin = async (id) => {
  const response = await api.delete(`/superadmin/admins/delete/${id}`);
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
};



