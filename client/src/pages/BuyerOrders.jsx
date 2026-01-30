import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import LanguageSelector from '../components/LanguageSelector';

const BuyerOrders = () => {
    const { t } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/buyer');
                setOrders(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'accepted': return 'bg-blue-100 text-blue-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <header className="flex flex-col md:flex-row justify-between items-center mb-8 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">{t('myOrders')}</h1>
                {/* <LanguageSelector /> */}
            </header>

            <div className="max-w-6xl mx-auto">
                {loading ? <p>{t('loading')}</p> : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        <th className="p-4 font-semibold text-gray-600">{t('cropName')}</th>
                                        <th className="p-4 font-semibold text-gray-600">{t('quantityKg')}</th>
                                        <th className="p-4 font-semibold text-gray-600">{t('totalPrice')}</th>
                                        <th className="p-4 font-semibold text-gray-600">{t('farmerName')}</th>
                                        <th className="p-4 font-semibold text-gray-600">{t('orderStatus')}</th>
                                        <th className="p-4 font-semibold text-gray-600">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {orders.map(order => (
                                        <tr key={order._id} className="hover:bg-gray-50">
                                            <td className="p-4">{order.product?.cropName}</td>
                                            <td className="p-4">{order.quantityKg}</td>
                                            <td className="p-4">{order.totalPrice}</td>
                                            <td className="p-4">{order.farmer?.name}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                    {t(order.status)}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-500 text-sm">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {orders.length === 0 && <p className="text-center p-8 text-gray-500">No orders found.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BuyerOrders;
