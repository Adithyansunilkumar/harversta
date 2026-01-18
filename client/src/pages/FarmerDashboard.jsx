import React, { useState } from 'react';
import AddProductForm from '../components/products/AddProductForm';
import MyProducts from '../components/products/MyProducts';
import LanguageSelector from '../components/LanguageSelector';
import { useTranslation } from 'react-i18next';

const FarmerDashboard = () => {
    const { t } = useTranslation();
    const [refreshKey, setRefreshKey] = useState(0);
    const [editingProduct, setEditingProduct] = useState(null);

    const handleProductAddedOrUpdated = () => {
        setRefreshKey(old => old + 1);
        setEditingProduct(null);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        window.scrollTo(0, 0); // Scroll to form
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">{t('farmerDashboard')}</h1>
                    <LanguageSelector />
                </header>

                <main>
                    <AddProductForm
                        onProductAdded={handleProductAddedOrUpdated}
                        editingProduct={editingProduct}
                        onCancel={handleCancelEdit}
                    />
                    <MyProducts
                        refreshTrigger={refreshKey}
                        onEdit={handleEdit}
                    />
                </main>
            </div>
        </div>
    );
};

export default FarmerDashboard;
