import express from 'express';
import Product from '../../models/Product.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Middleware to ensure user is a farmer
const isFarmer = (req, res, next) => {
    if (req.user && req.user.role === 'farmer') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as a farmer' });
    }
};

// @desc    Get all products (Marketplace)
// @route   GET /api/products
// @access  Private (All active users)
router.get('/', protect, async (req, res) => {
    try {
        const products = await Product.find({})
            .populate('farmer', 'name averageRating totalReviews')
            .sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Farmer only)
router.post('/', protect, isFarmer, async (req, res) => {
    try {
        const {
            cropName,
            quantityKg,
            pricePerKg,
            harvestDate,
            location,
            isGroupEligible,
            category,      // Required field
            description,   // Optional
            images         // Optional
        } = req.body;

        // Check for required fields manually to provide better error message
        if (!category) {
            return res.status(400).json({ message: 'Category is required' });
        }

        const product = new Product({
            farmer: req.user._id,
            cropName,
            quantityKg,
            pricePerKg,
            harvestDate,
            location,
            isGroupEligible,
            category,
            description,
            images
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error('Error creating product:', {
            message: error.message,
            stack: error.stack,
            body: req.body
        });
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Get all products for the logged-in farmer
// @route   GET /api/products/my
// @access  Private (Farmer only)
router.get('/my', protect, isFarmer, async (req, res) => {
    try {
        const products = await Product.find({ farmer: req.user._id }).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Farmer only)
router.put('/:id', protect, isFarmer, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            // Ensure the logged-in farmer owns the product
            if (product.farmer.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to update this product' });
            }

            product.cropName = req.body.cropName || product.cropName;
            product.quantityKg = req.body.quantityKg || product.quantityKg;
            product.pricePerKg = req.body.pricePerKg || product.pricePerKg;
            product.harvestDate = req.body.harvestDate || product.harvestDate;
            product.location = req.body.location || product.location;
            product.category = req.body.category || product.category;
            product.description = req.body.description || product.description;
            product.images = req.body.images || product.images;

            if (req.body.isGroupEligible !== undefined) {
                product.isGroupEligible = req.body.isGroupEligible;
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Farmer only)
router.delete('/:id', protect, isFarmer, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            // Ensure the logged-in farmer owns the product
            if (product.farmer.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to delete this product' });
            }

            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

export default router;
