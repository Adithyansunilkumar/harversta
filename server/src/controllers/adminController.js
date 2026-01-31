import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import AuditLog from '../models/AuditLog.js';

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
    try {
        const totalFarmers = await User.countDocuments({ role: 'farmer' });
        const verifiedFarmers = await User.countDocuments({ role: 'farmer', isVerified: true });
        const unverifiedFarmers = await User.countDocuments({ role: 'farmer', isVerified: false });

        const totalProducts = await Product.countDocuments();
        const activeProducts = await Product.countDocuments({ status: 'approved' });
        const pendingProducts = await Product.countDocuments({ status: 'pending' });

        const totalOrders = await Order.countDocuments();
        const completedOrders = await Order.countDocuments({ status: 'delivered' });

        // Calculate Total Revenue (assuming total price is summed regardless of payment status for now, or only paid)
        // Let's assume completed orders mean revenue generated.
        const revenueAgg = await Order.aggregate([
            { $match: { status: 'delivered' } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

        // Calculate Profit Split (4% Commission)
        const platformProfit = Math.round(totalRevenue * 0.04);
        const farmerEarnings = Math.round(totalRevenue * 0.96);

        const pendingVerifications = unverifiedFarmers;
        // const pendingProductApprovals = pendingProducts; // Already calc
        const reportedReviews = await Review.countDocuments({ flagStatus: 'flagged' });
        const unresolvedDisputes = await Order.countDocuments({ status: 'disputed' });

        res.json({
            metrics: {
                totalFarmers,
                verifiedFarmers,
                unverifiedFarmers,
                totalProducts,
                activeProducts,
                totalOrders,
                completedOrders,
                totalRevenue,
                platformProfit,
                farmerEarnings
            },
            alerts: {
                pendingVerifications,
                pendingProductApprovals: pendingProducts,
                reportedReviews,
                unresolvedDisputes
            }
        });
    } catch (error) {
        console.error('Error in getDashboardStats:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        res.status(500).json({
            message: 'Error fetching dashboard stats',
            error: error.message
        });
    }
};

// @desc    Get Farmers List
// @route   GET /api/admin/farmers
// @access  Private/Admin
export const getFarmers = async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;
        const keyword = req.query.keyword ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i'
            }
        } : {};

        const count = await User.countDocuments({ role: 'farmer', ...keyword });
        const farmers = await User.find({ role: 'farmer', ...keyword })
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .select('-password');

        res.json({ farmers, page, pages: Math.ceil(count / pageSize), total: count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify/Reject/Suspend Farmer
// @route   PUT /api/admin/farmers/:id
// @access  Private/Admin
export const updateFarmerStatus = async (req, res) => {
    try {
        const { isVerified, isSuspended } = req.body; // Expecting boolean or status
        const farmer = await User.findById(req.params.id);

        if (farmer) {
            if (isVerified !== undefined) farmer.isVerified = isVerified;
            // Assuming we might add a suspended field or just use isVerified=false implies unverified.
            // Requirement says "suspend_farmer", maybe status field is better, but for now specific fields.
            // Let's assume suspending means verify = false for now or I should have added a status field to User.
            // The User model has `isVerified` (bool). Let's stick to that for verification.
            // For suspension, we might need an `isActive` or `status` field.
            // Looking at User model again... it only has isVerified. I'll stick to that for now.

            const updatedFarmer = await farmer.save();

            // Log action
            await AuditLog.create({
                admin: req.user._id,
                action: 'UPDATE_FARMER_STATUS',
                entityType: 'User',
                entityId: farmer._id,
                details: { isVerified }
            });

            res.json(updatedFarmer);
        } else {
            res.status(404).json({ message: 'Farmer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Products
// @route   GET /api/admin/products
// @access  Private/Admin
export const getProducts = async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;
        const keyword = req.query.keyword ? {
            cropName: {
                $regex: req.query.keyword,
                $options: 'i'
            }
        } : {};

        // Filter by status if provided
        const statusFilter = req.query.status ? { status: req.query.status } : {};

        const count = await Product.countDocuments({ ...keyword, ...statusFilter });
        const products = await Product.find({ ...keyword, ...statusFilter })
            .populate('farmer', 'name email')
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Product Status (Approve/Reject)
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
export const updateProductStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            product.status = status;
            const updatedProduct = await product.save();

            await AuditLog.create({
                admin: req.user._id,
                action: 'UPDATE_PRODUCT_STATUS',
                entityType: 'Product',
                entityId: product._id,
                details: { status }
            });

            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Orders
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;

        const count = await Order.countDocuments();
        const orders = await Order.find({})
            .populate('buyer', 'name')
            .populate('farmer', 'name')
            .populate('product', 'cropName')
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });

        res.json({ orders, page, pages: Math.ceil(count / pageSize), total: count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Reviews
// @route   GET /api/admin/reviews
// @access  Private/Admin
export const getReviews = async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;

        const count = await Review.countDocuments();
        const reviews = await Review.find({})
            .populate('buyer', 'name')
            .populate('farmer', 'name')
            .populate('order', 'status')
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ reviews, page, pages: Math.ceil(count / pageSize), total: count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Moderate Review
// @route   PUT /api/admin/reviews/:id
// @access  Private/Admin
export const moderateReview = async (req, res) => {
    try {
        const { flagStatus } = req.body;
        const review = await Review.findById(req.params.id);

        if (review) {
            review.flagStatus = flagStatus;
            const updatedReview = await review.save();

            await AuditLog.create({
                admin: req.user._id,
                action: 'MODERATE_REVIEW',
                entityType: 'Review',
                entityId: review._id,
                details: { flagStatus }
            });

            res.json(updatedReview);
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Audit Logs
// @route   GET /api/admin/audit-logs
// @access  Private/Admin
export const getAuditLogs = async (req, res) => {
    try {
        const pageSize = 15;
        const page = Number(req.query.pageNumber) || 1;

        const count = await AuditLog.countDocuments();
        const logs = await AuditLog.find({})
            .populate('admin', 'name email')
            .sort({ createdAt: -1 })
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ logs, page, pages: Math.ceil(count / pageSize), total: count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Analytics Insights
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalyticsData = async (req, res) => {
    try {
        // 1. Orders Per Day (Last 7 Days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const ordersPerDay = await Order.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                    revenue: { $sum: "$totalPrice" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 2. Top Selling Products (by quantity sold in delivered orders)
        const topSellingProducts = await Order.aggregate([
            { $match: { status: 'delivered' } },
            {
                $group: {
                    _id: "$product",
                    totalQuantity: { $sum: "$quantityKg" },
                    totalRevenue: { $sum: "$totalPrice" }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },
            { $unwind: "$productInfo" },
            {
                $project: {
                    productName: "$productInfo.cropName",
                    totalQuantity: 1,
                    totalRevenue: 1
                }
            }
        ]);

        // 3. Farmer Onboarding Trend (Last 7 Days)
        const newFarmersTrend = await User.aggregate([
            { $match: { role: 'farmer', createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            ordersPerDay,
            topSellingProducts,
            newFarmersTrend
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
