import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import {
    getDashboardStats,
    getFarmers,
    updateFarmerStatus,
    getProducts,
    updateProductStatus,
    getOrders,
    getReviews,
    moderateReview,
    getAuditLogs,
    getAnalyticsData
} from '../controllers/adminController.js';

const router = express.Router();

// Protect all admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/analytics', getAnalyticsData);

router.get('/farmers', getFarmers);
router.put('/farmers/:id', updateFarmerStatus);

router.get('/products', getProducts);
router.put('/products/:id', updateProductStatus);

router.get('/orders', getOrders);

router.get('/reviews', getReviews);
router.put('/reviews/:id', moderateReview);

router.get('/audit-logs', getAuditLogs);

export default router;
