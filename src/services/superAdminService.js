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

// 9. Register / Create Admin (POST /api/superadmin/admins/register)
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

export default {
  createSuperAdmin,
  loginSuperAdmin,
  forgotPassword,
  verifyOtp,
  getSuperAdminProfile,
  updateSuperAdminProfile,
  changePassword,
  getDashboardStats,
  registerAdmin,
  createAdmin,
  getAllAdmins,
  getAdminById,
};
