import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';

const FarmerOrders = () => {
    const { t } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders/farmer');
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            fetchOrders(); // Refresh list
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'accepted': return 'bg-blue-100 text-blue-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="text-center py-8">{t('loading')}</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-800">{t('receivedOrders')}</h2>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {orders.length} {t('ordersCount')}
                </span>
            </div>

            {orders.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                    {t('noOrdersReceived')}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                            <tr>
                                <th className="p-4">{t('tableProduct')}</th>
                                <th className="p-4">{t('tableBuyer')}</th>
                                <th className="p-4">{t('tableQuantity')}</th>
                                <th className="p-4">{t('tableTotalPrice')}</th>
                                <th className="p-4">{t('tableDate')}</th>
                                <th className="p-4">{t('tableStatus')}</th>
                                <th className="p-4 text-center">{t('tableActions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map(order => (
                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-900">{order.product?.cropName}</td>
                                    <td className="p-4 text-gray-600">
                                        <div className="font-medium">{order.buyer?.name}</div>
                                        <div className="text-xs text-gray-500">{order.buyer?.email}</div>
                                    </td>
                                    <td className="p-4 text-gray-600">{order.quantityKg} kg</td>
                                    <td className="p-4 text-green-600 font-medium">₹{order.totalPrice}</td>
                                    <td className="p-4 text-gray-500 text-sm">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                            {t(order.status) || order.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-2">
                                            {order.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => updateStatus(order._id, 'accepted')}
                                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors shadow-sm"
                                                    >
                                                        {t('accept')}
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus(order._id, 'rejected')}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors shadow-sm"
                                                    >
                                                        {t('reject')}
                                                    </button>
                                                </>
                                            )}
                                            {order.status === 'accepted' && (
                                                <span className="text-xs text-gray-400 italic">
                                                    {t('waitingDelivery')}
                                                </span>
                                            )}
                                            {order.status === 'delivered' && (
                                                <span className="text-xs text-green-600 font-medium">
                                                    ✓ {t('completed')}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default FarmerOrders;
