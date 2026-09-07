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

export default {
  registerAdmin,
  createAdmin,
  createSuperAdmin,
  getAllAdmins,
  getAdminById,
};
