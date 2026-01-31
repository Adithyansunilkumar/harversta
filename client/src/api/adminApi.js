import api from './axios';

export const getDashboardStats = async () => {
    const response = await api.get('/admin/stats');
    return response.data;
};

export const getFarmers = async (pageNumber = 1, keyword = '') => {
    const response = await api.get(`/admin/farmers`, {
        params: { pageNumber, keyword }
    });
    return response.data;
};

export const updateFarmerStatus = async (id, statusData) => {
    const response = await api.put(`/admin/farmers/${id}`, statusData);
    return response.data;
};

export const getProducts = async (pageNumber = 1, keyword = '', status = '') => {
    const response = await api.get(`/admin/products`, {
        params: { pageNumber, keyword, status }
    });
    return response.data;
};

export const updateProductStatus = async (id, statusData) => {
    const response = await api.put(`/admin/products/${id}`, statusData);
    return response.data;
};

export const getOrders = async (pageNumber = 1) => {
    const response = await api.get(`/admin/orders`, {
        params: { pageNumber }
    });
    return response.data;
};

export const getReviews = async (pageNumber = 1) => {
    const response = await api.get(`/admin/reviews`, {
        params: { pageNumber }
    });
    return response.data;
};

export const moderateReview = async (id, statusData) => {
    const response = await api.put(`/admin/reviews/${id}`, statusData);
    return response.data;
};

export const getAuditLogs = async (pageNumber = 1) => {
    const response = await api.get(`/admin/audit-logs`, {
        params: { pageNumber }
    });
    return response.data;
};

export const getAnalytics = async () => {
    const response = await api.get('/admin/analytics');
    return response.data;
};
