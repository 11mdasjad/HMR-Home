// Client-side authentication and session state utilities

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('hmr_token');
  }
  return null;
};

export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('hmr_token', token);
  }
};

export const getAuthUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('hmr_user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const setAuthUser = (user: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('hmr_user', JSON.stringify(user));
  }
};

export const clearAuth = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('hmr_token');
    localStorage.removeItem('hmr_user');
  }
};

// API Endpoint Helper
export const API_BASE = 'http://localhost:5001/api';
export const SOCKET_BASE = 'http://localhost:5001';
