// Migration Script: Add category to existing products
// Run this once to fix old products in the database

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product.js';

dotenv.config();

const fixProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');

        // Find all products without a category
        const productsWithoutCategory = await Product.find({
            $or: [
                { category: { $exists: false } },
                { category: null },
                { category: '' }
            ]
        });

        console.log(`Found ${productsWithoutCategory.length} products without category`);

        if (productsWithoutCategory.length === 0) {
            console.log('✅ All products already have categories!');
            process.exit(0);
        }

        // Update each product with a default category
        let updated = 0;
        for (const product of productsWithoutCategory) {
            product.category = 'Other'; // Default category
            await product.save({ validateBeforeSave: false });
            updated++;
            console.log(`Updated: ${product.cropName} -> category: Other`);
        }

        console.log(`\n✅ Successfully updated ${updated} products!`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixProducts();
