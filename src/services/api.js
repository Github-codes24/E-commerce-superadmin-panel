import axios from 'axios';
import { isSessionValid, touchSession } from '../utils/sessionManager';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://e-commerce-backend-1-we80.onrender.com/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRenewingToken = false;
let pendingQueue = [];

const processPendingQueue = (error, newToken = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(newToken);
    }
  });
  pendingQueue = [];
};

/**
 * Background token renewal when backend token expires within the 30-day session
 */
const attemptBackgroundTokenRenew = async () => {
  try {
    let email = '';
    let password = '';

    const rawUser = localStorage.getItem('adminUser');
    if (rawUser) {
      try {
        const u = JSON.parse(rawUser);
        email = u.email;
        password = u.password;
      } catch {}
    }

    if (!email || !password) {
      const rawSync = localStorage.getItem('admin_credential_sync');
      if (rawSync) {
        try {
          const s = JSON.parse(rawSync);
          email = s.email;
          password = s.currentPassword;
        } catch {}
      }
    }

    if (email && password) {
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://e-commerce-backend-1-we80.onrender.com/api';
      const res = await axios.post(`${baseURL}/super-admin/login`, {
        email: email.trim(),
        password: password,
      });

      const data = res?.data;
      const newToken = data?.token || data?.data?.token || data?.data?.accessToken || data?.accessToken;
      if (newToken) {
        localStorage.setItem('token', newToken);
        localStorage.setItem('adminToken', newToken);
        touchSession();
        return newToken;
      }
    }
  } catch (err) {
    console.warn('Silent token renewal failed:', err?.message);
  }
  return null;
};

// Request Interceptor to attach Bearer token and manage 30-day session
api.interceptors.request.use(
  (config) => {
    const hasToken = Boolean(localStorage.getItem('token') || localStorage.getItem('adminToken'));

    // If token exists, verify 30-day session validity
    if (hasToken) {
      if (!isSessionValid()) {
        console.warn('30-day session timeout reached.');
        window.dispatchEvent(
          new CustomEvent('auth:session_expired', {
            detail: { message: 'Your session has timed out after 30 days. Please log in again.' }
          })
        );
        return Promise.reject(new Error('Session timed out after 30 days.'));
      }
      // Refresh sliding 30-day activity window
      touchSession();
    }

    // Preserve custom Authorization header if explicitly provided
    const existingAuth =
      config.headers?.Authorization ||
      config.headers?.authorization ||
      (typeof config.headers?.get === 'function' &&
        (config.headers.get('Authorization') || config.headers.get('authorization')));

    if (!existingAuth) {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for global error handling & token auto-renewal within 30-day window
api.interceptors.response.use(
  (response) => {
    // Touch session on successful API response
    touchSession();
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      const url = (originalRequest?.url || '').toLowerCase();
      const msg = (error.response.data?.message || error.response.data?.error || '').toString().toLowerCase();
      const status = error.response.status;

      // Do NOT trigger session_expired on auth endpoints (login, forgot, otp) or optional profile endpoints
      const isAuthOrOptionalRoute =
        url.includes('/login') ||
        url.includes('/forgot') ||
        url.includes('/verify-otp') ||
        url.includes('/profile');

      const isExplicitTokenExpired =
        msg.includes('jwt expired') ||
        msg.includes('token expired') ||
        msg.includes('jwt malformed') ||
        msg.includes('invalid token');

      const hasActiveToken = Boolean(localStorage.getItem('token') || localStorage.getItem('adminToken'));

      // If token expired on backend BUT session is still within 30 days, renew silently!
      if (!isAuthOrOptionalRoute && hasActiveToken && (isExplicitTokenExpired || (status === 401 && msg.includes('token')))) {
        if (isSessionValid() && originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;

          if (isRenewingToken) {
            return new Promise((resolve, reject) => {
              pendingQueue.push({ resolve, reject });
            })
              .then((newToken) => {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          isRenewingToken = true;
          try {
            const newToken = await attemptBackgroundTokenRenew();
            if (newToken) {
              isRenewingToken = false;
              processPendingQueue(null, newToken);
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return api(originalRequest);
            }
          } catch (renewErr) {
            processPendingQueue(renewErr, null);
          } finally {
            isRenewingToken = false;
          }
        }

        console.warn('Session expired or unauthorized token:', msg);
        window.dispatchEvent(
          new CustomEvent('auth:session_expired', {
            detail: { message: error.response.data?.message || 'Your session has expired. Please log in again.' }
          })
        );
      }
    }
    return Promise.reject(error);
  }
);

export default api;
