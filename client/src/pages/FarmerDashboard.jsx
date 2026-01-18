import React, { useState } from 'react';
import AddProductForm from '../components/products/AddProductForm';
import MyProducts from '../components/products/MyProducts';
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
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 relative">
            <VoiceAssistant
                isVisible={showVoice}
                onClose={() => setShowVoice(false)}
                onProductData={handleVoiceData}
            />

            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">{t('farmerDashboard')}</h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowVoice(true)}
                            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg flex items-center gap-2 px-4 transition-all"
                        >
                            <Mic size={20} />
                            <span className="hidden md:inline">{t('voiceAssistant')}</span>
                        </button>
                        <LanguageSelector />
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
                </main>
            </div>
        </div>
    );
};

export default FarmerDashboard;
