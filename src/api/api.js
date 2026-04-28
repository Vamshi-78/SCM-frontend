import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

const tryRequest = async (requestFns) => {
  let lastError;
  for (const requestFn of requestFns) {
    try {
      return await requestFn();
    } catch (err) {
      lastError = err;
      const status = err?.response?.status;
      // Stop fallback chain for auth/validation style responses.
      if (status && status >= 400 && status < 500 && status !== 404) {
        throw err;
      }
    }
  }
  throw lastError;
};

// Auto-attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const url = String(config.url || '');
  const isAuthRoute = /\/auth\//.test(url);
  if (token && !isAuthRoute) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default {
  // Auth
  register: (data) => {
    const basePayload = {
      username: data?.username,
      email: data?.email,
      password: data?.password,
      role: data?.role || 'student',
    };

    return tryRequest([
      () => api.post('/auth/register', basePayload),
      () => api.post('/api/auth/register', basePayload),
      () => api.post('/auth/signup', basePayload),
      () => api.post('/register', basePayload),
      () => api.post('/auth/register', { ...basePayload, name: basePayload.username }),
    ]);
  },
  loginStudent: (data) =>
    tryRequest([
      () => api.post('/auth/login/student', data),
      () => api.post('/api/auth/login/student', data),
      () => api.post('/auth/login', { ...data, role: 'student' }),
      () => api.post('/api/auth/login', { ...data, role: 'student' }),
      () => api.post('/auth/student/login', data),
      () => api.post('/login/student', data),
      () => api.post('/auth/login/student', { username: data?.email, password: data?.password }),
    ]),
  loginAdmin: (data) =>
    tryRequest([
      () => api.post('/auth/login/admin', data),
      () => api.post('/api/auth/login/admin', data),
      () => api.post('/auth/login', { ...data, role: 'admin' }),
      () => api.post('/api/auth/login', { ...data, role: 'admin' }),
      () => api.post('/auth/admin/login', data),
      () => api.post('/login/admin', data),
      () => api.post('/auth/login/admin', { username: data?.email, password: data?.password }),
    ]),

  // Courses
  getCourses: () =>
    tryRequest([
      () => api.get('/api/courses'),
      () => api.get('/courses'),
    ]),
  addCourse: (data) =>
    tryRequest([
      () => api.post('/api/courses', data),
      () => api.post('/courses', data),
    ]),
  deleteCourse: (code) =>
    tryRequest([
      () => api.delete(`/api/courses/${code}`),
      () => api.delete(`/courses/${code}`),
    ]),
  updateCourse: (code, data) =>
    tryRequest([
      () => api.put(`/api/courses/${code}`, data),
      () => api.put(`/courses/${code}`, data),
    ]),

  // Enroll
  enroll: (data) =>
    tryRequest([
      () => api.post('/api/enroll', data),
      () => api.post('/enroll', data),
    ]),
  getEnrollments: (email) =>
    tryRequest([
      () => api.get(`/api/enrollments/${email}`),
      () => api.get(`/enrollments/${email}`),
    ]),
  unenroll: (data) =>
    tryRequest([
      () => api.post('/api/unenroll', data),
      () => api.post('/unenroll', data),
    ]),

  // Waitlist
  getWaitlist: () =>
    tryRequest([
      () => api.get('/api/waitlist'),
      () => api.get('/waitlist'),
    ]),
  joinWaitlist: (data) =>
    tryRequest([
      () => api.post('/api/waitlist', data),
      () => api.post('/waitlist', data),
    ]),

  // Registration approvals
  getPendingRegistrations: () =>
    tryRequest([
      () => api.get('/api/admin/registrations'),
      () => api.get('/admin/registrations'),
    ]),
  approveRegistration: (id) =>
    tryRequest([
      () => api.post(`/api/admin/registrations/${id}/approve`),
      () => api.post(`/admin/registrations/${id}/approve`),
    ]),
  rejectRegistration: (id) =>
    tryRequest([
      () => api.post(`/api/admin/registrations/${id}/reject`),
      () => api.post(`/admin/registrations/${id}/reject`),
    ]),
  submitRegistrationRequest: (data) =>
    tryRequest([
      () => api.post('/registration/request', data),
      () => api.post('/api/registration/request', data),
      () => api.post('/registration', data),
      () => api.post('/api/registration', data),
    ]),

  // Notifications
  getNotifications: (userId) =>
    tryRequest([
      () => api.get(`/api/notifications/${userId}`),
      () => api.get(`/notifications/${userId}`),
    ]),
  addNotification: (data) =>
    tryRequest([
      () => api.post('/api/notifications', data),
      () => api.post('/notifications', data),
    ]),
  markNotificationAsRead: (notificationId) =>
    tryRequest([
      () => api.post(`/api/notifications/${notificationId}/read`),
      () => api.post(`/notifications/${notificationId}/read`),
    ]),
  clearNotifications: () =>
    tryRequest([
      () => api.post('/api/notifications/clear'),
      () => api.post('/notifications/clear'),
    ]),

  // Support Tickets
  getSupportTickets: (email) =>
    tryRequest([
      () => api.get(`/api/support-tickets/${email}`),
      () => api.get(`/support-tickets/${email}`),
    ]),
  getAllSupportTickets: () =>
    tryRequest([
      () => api.get('/api/support-tickets/all'),
      () => api.get('/support-tickets/all'),
    ]),
  createSupportTicket: (data) =>
    tryRequest([
      () => api.post('/api/support-tickets', data),
      () => api.post('/support-tickets', data),
      () => api.post('/support-ticket', data),
      () => api.post('/api/support-ticket', data),
    ]),
  respondToTicket: (ticketId, data) =>
    tryRequest([
      () => api.post(`/api/support-tickets/${ticketId}/respond`, data),
      () => api.post(`/support-tickets/${ticketId}/respond`, data),
    ]),
  updateTicketStatus: (ticketId, data) =>
    tryRequest([
      () => api.post(`/api/support-tickets/${ticketId}/status`, data),
      () => api.post(`/support-tickets/${ticketId}/status`, data),
    ]),

  // Generic
  post: (url, data) => api.post(url, data),
  get: (url) => api.get(url),
  put: (url, data) => api.put(url, data),
  delete: (url) => api.delete(url)
};
