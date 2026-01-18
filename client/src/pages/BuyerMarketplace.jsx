import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import PlaceOrder from '../components/orders/PlaceOrder';
import LanguageSelector from '../components/LanguageSelector';

const BuyerMarketplace = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [filters, setFilters] = useState({
        cropName: '',
        location: '',
        maxPrice: ''
    });

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/products');
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        let res = products;
        if (filters.cropName) {
            res = res.filter(p => p.cropName.toLowerCase().includes(filters.cropName.toLowerCase()));
        }
        if (filters.location) {
            res = res.filter(p => p.location.toLowerCase().includes(filters.location.toLowerCase()));
        }
        if (filters.maxPrice) {
            res = res.filter(p => p.pricePerKg <= Number(filters.maxPrice));
        }
        setFilteredProducts(res);
    }, [filters, products]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <header className="flex flex-col md:flex-row justify-between items-center mb-8 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">{t('buyerMarketplace')}</h1>
                <LanguageSelector />
            </header>

            <div className="max-w-6xl mx-auto mb-8 bg-white p-4 rounded shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        name="cropName"
                        placeholder={t('filterByCrop')}
                        value={filters.cropName}
                        onChange={handleFilterChange}
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder={t('filterByLocation')}
                        value={filters.location}
                        onChange={handleFilterChange}
                        className="p-2 border rounded"
                    />
                    <input
                        type="number"
                        name="maxPrice"
                        placeholder={t('maxPrice')}
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        className="p-2 border rounded"
                    />
                </div>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? <p>{t('loading')}</p> : filteredProducts.map(product => (
                    <div key={product._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{product.cropName}</h3>
                        <div className="text-gray-600 space-y-1 mb-4">
                            <p><span className="font-semibold">{t('pricePerKg')}:</span> {product.pricePerKg}</p>
                            <p><span className="font-semibold">{t('quantityKg')}:</span> {product.quantityKg}</p>
                            <p><span className="font-semibold">{t('location')}:</span> {product.location}</p>
                            <p><span className="font-semibold">{t('farmerName')}:</span> {product.farmer?.name}</p>
                        </div>
                        <button
                            onClick={() => setSelectedProduct(product)}
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            {t('placeOrder')}
                        </button>
                    </div>
                ))}
            </div>

            {!loading && filteredProducts.length === 0 && (
                <p className="text-center text-gray-500 mt-8">{t('noProductsFound')}</p>
            )}

            {selectedProduct && (
                <PlaceOrder
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onOrderPlaced={() => {
                        fetchProducts();
                        setSelectedProduct(null);
                    }}
                />
            )}
        </div>
    );
};

export default BuyerMarketplace;
