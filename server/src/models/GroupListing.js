import mongoose from 'mongoose';

const groupListingSchema = new mongoose.Schema({
    cropName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    totalQuantityKg: {
        type: Number,
        default: 0
    },
    pricePerKg: {
        type: Number,
        required: true
    },
    farmers: [{
        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantityKg: {
            type: Number,
            required: true
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Compound index to ensure unique groups per crop+location
groupListingSchema.index({ cropName: 1, location: 1 }, { unique: true });

const GroupListing = mongoose.model('GroupListing', groupListingSchema);

export default GroupListing;
