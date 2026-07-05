import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && token !== 'undefined') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

export const authApi = {
  signup: (data) => apiClient.post('/auth/signup', data),
  login: (data) => apiClient.post('/auth/login', data),
  verifyEmail: (data) => apiClient.post('/auth/verify-email', data),
  resendOtp: (data) => apiClient.post('/auth/resend-otp', data),
  refreshToken: () => apiClient.post('/auth/refresh-token'),
  logout: () => apiClient.post('/auth/logout'),
};

export const projectApi = {
  searchProjects: (params) => apiClient.get('/projects/search', { params }),
  getProjectDetails: (id) => apiClient.get(`/projects/${id}`),
  createProject: (data) => apiClient.post('/projects', data),
  getMyProjects: () => apiClient.get('/projects/me'),
  updateProject: (id, data) => apiClient.patch(`/projects/${id}`, data),
  closeProject: (id) => apiClient.patch(`/projects/${id}/close`),
};

export const contractorApi = {
  createContractorProfile: (data) => apiClient.post('/contractors/profile', data),
  getMyContractorProfile: () => apiClient.get('/contractors/me'),
  updateMyContractorProfile: (data) => apiClient.patch('/contractors/me', data),
  searchContractors: (params) => apiClient.get('/contractors/search', { params }),
  getContractorById: (id) => apiClient.get(`/contractors/${id}`),
};

export const bidApi = {
  createBid: (data) => apiClient.post('/bids', data),
  getMyBids: () => apiClient.get('/bids/me'),
  getProjectBids: (projectId) => apiClient.get(`/bids/project/${projectId}`),
  acceptBid: (bidId) => apiClient.patch(`/bids/${bidId}/accept`),
  rejectBid: (bidId) => apiClient.patch(`/bids/${bidId}/reject`),
  withdrawBid: (bidId) => apiClient.patch(`/bids/${bidId}/withdraw`),
};

export const reviewApi = {
  createReview: (data) => apiClient.post('/reviews', data),
  getReviews: (params) => apiClient.get('/reviews', { params }),
  getReviewById: (id) => apiClient.get(`/reviews/${id}`),
  updateReview: (id, data) => apiClient.patch(`/reviews/${id}`, data),
  deleteReview: (id) => apiClient.delete(`/reviews/${id}`),
};

export const chatApi = {
  getCustomerChats: () => apiClient.get('/chats/customer'),
  getContractorChats: () => apiClient.get('/chats/contractor'),
  getMessages: (chatId) => apiClient.get(`/chats/${chatId}/messages`),
  sendMessage: (chatId, data) => apiClient.post(`/chats/${chatId}/messages`, data),
  markChatRead: (chatId) => apiClient.patch(`/chats/${chatId}/read`),
};

export const workOrderApi = {
  getCustomerWorkOrders: () => apiClient.get('/work-orders/customer'),
  getContractorWorkOrders: () => apiClient.get('/work-orders/contractor'),
  completeWorkOrder: (workOrderId) => apiClient.patch(`/work-orders/${workOrderId}/complete`),
};

export const notificationApi = {
  getNotifications: () => apiClient.get('/notifications'),
  getUnreadCount: () => apiClient.get('/notifications/unread-count'),
  markAllRead: () => apiClient.patch('/notifications/read-all'),
  markRead: (id) => apiClient.patch(`/notifications/${id}/read`),
  deleteNotification: (id) => apiClient.delete(`/notifications/${id}`),
};

export const uploadApi = {
  uploadAadhar: (formData) => apiClient.post('/upload/aadhar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadPan: (formData) => apiClient.post('/upload/pan', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadPortfolio: (formData) => apiClient.post('/upload/portfolio', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadProjectImages: (projectId, formData) => apiClient.post(`/upload/project/${projectId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};
