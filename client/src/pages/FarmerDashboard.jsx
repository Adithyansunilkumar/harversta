import React, { useState } from 'react';
import AddProductForm from '../components/products/AddProductForm';
import MyProducts from '../components/products/MyProducts';
import GroupSellingSection from '../components/groups/GroupSellingSection';
import LanguageSelector from '../components/LanguageSelector';
import VoiceAssistant from '../components/voice/VoiceAssistant';
import { useTranslation } from 'react-i18next';
import { Mic } from 'lucide-react';
import api from '../api/axios';

const FarmerDashboard = () => {
    const { t } = useTranslation();
    const [refreshKey, setRefreshKey] = useState(0);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showVoice, setShowVoice] = useState(false);

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

    const handleVoiceData = async (data) => {
        // Voice returns partial data, we define isGroupEligible false by default
        const newProduct = {
            ...data,
            isGroupEligible: false
        };
        try {
            await api.post('/products', newProduct);
            handleProductAddedOrUpdated();
        } catch (error) {
            console.error(error);
            alert(t('error'));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-12">
            {/* <VoiceAssistant
                isVisible={showVoice}
                onClose={() => setShowVoice(false)}
                onProductData={handleVoiceData}
            /> */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t('farmerDashboard')}</h1>
                        <p className="text-gray-500 mt-1">Manage your products and listings</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* <button
                            onClick={() => setShowVoice(true)}
                            className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white p-3 md:px-6 md:py-3 rounded-full shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 flex items-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                            <div className="bg-white/20 p-1 rounded-full group-hover:scale-110 transition-transform">
                                <Mic size={18} />
                            </div>
                            <span className="hidden md:inline font-medium">{t('voiceAssistant')}</span>
                        </button> */}
                    </div>
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
                    <GroupSellingSection
                        refreshTrigger={refreshKey}
                        onGroupAction={handleProductAddedOrUpdated}
                    />
                </main>
            </div>
        </div>
    );
};

export default FarmerDashboard;
