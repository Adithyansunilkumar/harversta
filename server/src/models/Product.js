import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    cropName: {
        type: String,
        required: true
    },
    quantityKg: {
        type: Number,
        required: true
    },
    pricePerKg: {
        type: Number,
        required: true
    },
    harvestDate: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    images: [{
        type: String
    }],
    description: {
        type: String
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'flagged'],
        default: 'pending'
    },
    isGroupEligible: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
