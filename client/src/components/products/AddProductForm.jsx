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
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">{editingProduct ? t('edit') + ' ' + t('addProduct').split(' ')[1] : t('addProduct')}</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 mb-2">{t('cropName')}</label>
                    <input
                        type="text"
                        name="cropName"
                        value={formData.cropName}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">{t('quantityKg')}</label>
                    <input
                        type="number"
                        name="quantityKg"
                        value={formData.quantityKg}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">{t('pricePerKg')}</label>
                    <input
                        type="number"
                        name="pricePerKg"
                        value={formData.pricePerKg}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">{t('harvestDate')}</label>
                    <input
                        type="date"
                        name="harvestDate"
                        value={formData.harvestDate}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">{t('location')}</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>
                <div className="md:col-span-2 flex items-center">
                    <input
                        type="checkbox"
                        name="isGroupEligible"
                        checked={formData.isGroupEligible}
                        onChange={handleChange}
                        className="mr-2 h-4 w-4"
                        id="isGroupEligible"
                    />
                    <label htmlFor="isGroupEligible" className="text-gray-700">{t('isGroupEligible')}</label>
                </div>
            </div>

            <div className="flex gap-4 mt-6">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200"
                >
                    {loading ? t('loading') : (editingProduct ? t('save') : t('submit'))}
                </button>
                {editingProduct && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
                    >
                        {t('cancel')}
                    </button>
                )}
            </div>
        </form>
    );
};

export default AddProductForm;
