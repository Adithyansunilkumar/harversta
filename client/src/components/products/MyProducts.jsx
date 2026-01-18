import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';

const MyProducts = ({ refreshTrigger, onEdit }) => {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/products/my');
            setProducts(response.data);
        } catch (err) {
            console.error(err);
            setError(t('error'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [refreshTrigger]);

    const handleDelete = async (id) => {
        if (window.confirm(t('delete') + '?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts();
            } catch (err) {
                console.error(err);
                alert(t('error'));
            }
        }
    };

    if (loading) return <div className="text-center py-4">{t('loading')}</div>;
    if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{t('myProducts')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product._id} className="bg-white p-6 rounded-lg shadow-md border hover:border-green-400 transition">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{product.cropName}</h3>
                        <p className="text-gray-600 mb-1"><span className="font-semibold">{t('quantityKg')}:</span> {product.quantityKg}</p>
                        <p className="text-gray-600 mb-1"><span className="font-semibold">{t('pricePerKg')}:</span> {product.pricePerKg}</p>
                        <p className="text-gray-600 mb-1"><span className="font-semibold">{t('location')}:</span> {product.location}</p>
                        <p className="text-gray-600 mb-4"><span className="font-semibold">{t('harvestDate')}:</span> {new Date(product.harvestDate).toLocaleDateString()}</p>

                        <div className="flex space-x-2">
                            <button
                                onClick={() => onEdit(product)}
                                className="flex-1 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                            >
                                {t('edit')}
                            </button>
                            <button
                                onClick={() => handleDelete(product._id)}
                                className="flex-1 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                            >
                                {t('delete')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {products.length === 0 && <p className="text-gray-500 text-center py-8">No products found.</p>}
        </div>
    );
};

export default MyProducts;
