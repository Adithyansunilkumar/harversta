import express from 'express';
import Order from '../../models/Order.js';
import Product from '../../models/Product.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Middleware to check roles
const checkRole = (role) => (req, res, next) => {
    console.log('Checking role:', {
        requiredRole: role,
        userRole: req.user?.role,
        userId: req.user?._id
    });

    if (req.user && req.user.role === role) {
        next();
    } else {
        console.error('Role check failed:', {
            required: role,
            actual: req.user?.role
        });
        res.status(403).json({
            message: `Access denied. This action requires ${role} role. Your role: ${req.user?.role || 'unknown'}`
        });
    }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Buyer only)
router.post('/', protect, checkRole('buyer'), async (req, res) => {
    try {
        const { productId, quantityKg } = req.body;

        console.log('Creating order:', {
            buyer: req.user._id,
            buyerRole: req.user.role,
            productId,
            quantityKg
        });

        const product = await Product.findById(productId);

        if (!product) {
            console.error('Product not found:', productId);
            return res.status(404).json({ message: 'Product not found' });
        }

        console.log('Product found:', {
            id: product._id,
            cropName: product.cropName,
            availableQuantity: product.quantityKg,
            requestedQuantity: quantityKg,
            farmer: product.farmer
        });

        if (product.quantityKg < quantityKg) {
            console.error('Insufficient quantity:', {
                available: product.quantityKg,
                requested: quantityKg
            });
            return res.status(400).json({ message: 'Insufficient quantity available' });
        }

        const totalPrice = product.pricePerKg * quantityKg;

        const order = new Order({
            buyer: req.user._id,
            farmer: product.farmer,
            product: productId,
            quantityKg,
            pricePerKg: product.pricePerKg, // Snapshot price
            totalPrice
        });

        const createdOrder = await order.save();
        console.log('Order created successfully:', createdOrder._id);

        // Update product quantity without triggering validation
        // (Old products might not have the category field)
        product.quantityKg -= quantityKg;
        await product.save({ validateBeforeSave: false });
        console.log('Product quantity updated:', product.quantityKg);

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error('Error creating order:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Get logged in buyer orders
// @route   GET /api/orders/buyer
// @access  Private (Buyer only)
router.get('/buyer', protect, checkRole('buyer'), async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user._id })
            .populate('product', 'cropName location')
            .populate('farmer', 'name')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Get logged in farmer orders
// @route   GET /api/orders/farmer
// @access  Private (Farmer only)
router.get('/farmer', protect, checkRole('farmer'), async (req, res) => {
    try {
        const orders = await Order.find({ farmer: req.user._id })
            .populate('product', 'cropName')
            .populate('buyer', 'name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Farmer only)
router.put('/:id/status', protect, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            // Check authorization
            const isFarmer = req.user.role === 'farmer' && order.farmer.toString() === req.user._id.toString();
            const isBuyer = req.user.role === 'buyer' && order.buyer.toString() === req.user._id.toString();

            if (!isFarmer && !isBuyer) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            // Logic for status updates
            if (isFarmer) {
                // Farmers can change to accepted, rejected, shipped (if we had it)
                if (['accepted', 'rejected', 'shipped'].includes(status)) {
                    order.status = status;
                } else {
                    return res.status(400).json({ message: 'Invalid status update for farmer' });
                }
            } else if (isBuyer) {
                // Buyers can only change to 'delivered'
                if (status === 'delivered') {
                    order.status = status;
                } else {
                    return res.status(400).json({ message: 'Invalid status update for buyer' });
                }
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

export default router;
