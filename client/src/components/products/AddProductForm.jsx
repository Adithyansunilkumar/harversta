import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';

const AddProductForm = ({ onProductAdded, editingProduct, onCancel }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        cropName: '',
        quantityKg: '',
        pricePerKg: '',
        harvestDate: '',
        location: '',
        isGroupEligible: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    React.useEffect(() => {
        if (editingProduct) {
            setFormData({
                cropName: editingProduct.cropName,
                quantityKg: editingProduct.quantityKg,
                pricePerKg: editingProduct.pricePerKg,
                harvestDate: editingProduct.harvestDate ? editingProduct.harvestDate.split('T')[0] : '',
                location: editingProduct.location,
                isGroupEligible: editingProduct.isGroupEligible
            });
        } else {
            setFormData({
                cropName: '',
                quantityKg: '',
                pricePerKg: '',
                harvestDate: '',
                location: '',
                isGroupEligible: false
            });
        }
    }, [editingProduct]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct._id}`, formData);
            } else {
                await api.post('/products', formData);
            }

            setFormData({
                cropName: '',
                quantityKg: '',
                pricePerKg: '',
                harvestDate: '',
                location: '',
                isGroupEligible: false
            });
            if (onProductAdded) onProductAdded();
        } catch (err) {
            console.error(err);
            setError(t('error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{editingProduct ? t('edit') + ' ' + t('addProduct').split(' ')[1] : t('addProduct')}</h2>
                {loading && <span className="text-sm text-green-600 animate-pulse font-medium">{t('loading')}...</span>}
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">{t('cropName')}</label>
                    <input
                        type="text"
                        name="cropName"
                        value={formData.cropName}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                        placeholder="e.g. Organic Tomatoes"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">{t('quantityKg')}</label>
                    <input
                        type="number"
                        name="quantityKg"
                        value={formData.quantityKg}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                        placeholder="0"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">{t('pricePerKg')}</label>
                    <input
                        type="number"
                        name="pricePerKg"
                        value={formData.pricePerKg}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                        placeholder="0.00"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">{t('harvestDate')}</label>
                    <input
                        type="date"
                        name="harvestDate"
                        value={formData.harvestDate}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                        required
                    />
                </div>
                <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-700">{t('location')}</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                        placeholder="Enter farm location"
                        required
                    />
                </div>
                <div className="md:col-span-2">

                </div>
            </div>

            <div className="flex gap-4 mt-8">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-gray-200"
                >
                    {loading ? t('loading') : (editingProduct ? t('save') : t('submit'))}
                </button>
                {editingProduct && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 bg-white text-gray-700 py-3 px-6 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 transition-all"
                    >
                        {t('cancel')}
                    </button>
                )}
            </div>
        </form>
    );
};

export default AddProductForm;
