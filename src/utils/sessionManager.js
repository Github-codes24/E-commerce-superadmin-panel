/**
 * Session Manager for Super Admin Dashboard
 * Enforces a 30-day session timeout with sliding activity window
 * and seamless background token renewal.
 */

export const SESSION_TIMEOUT_DAYS = 30;
export const SESSION_TIMEOUT_MS = SESSION_TIMEOUT_DAYS * 24 * 60 * 60 * 1000; // 30 days = 2,592,000,000 ms

/**
 * Initialize or refresh the 30-day session expiry timestamp
 */
export const touchSession = () => {
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    if (!token) return;
    const now = Date.now();
    const newExpiry = now + SESSION_TIMEOUT_MS;
    localStorage.setItem('sessionExpiry', String(newExpiry));
    localStorage.setItem('lastActiveTime', String(now));
    if (!localStorage.getItem('sessionStartTime')) {
      localStorage.setItem('sessionStartTime', String(now));
    }
  } catch {}
};

/**
 * Check if the current session is still valid (within 30 days)
 * @returns {boolean}
 */
export const isSessionValid = () => {
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    if (!token) return false;

    const expiryStr = localStorage.getItem('sessionExpiry');
    if (!expiryStr) {
      // If token exists but no expiry set yet, grant 30 days from now
      touchSession();
      return true;
    }

    const expiry = Number(expiryStr);
    if (isNaN(expiry) || Date.now() > expiry) {
      return false;
    }
    return true;
  } catch {
    return true;
  }
};

/**
 * Clear all session-related storage on logout or timeout
 */
export const clearSession = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('sessionExpiry');
    localStorage.removeItem('sessionStartTime');
    localStorage.removeItem('lastActiveTime');
  } catch {}
};

