import React, { useEffect, useState } from 'react';
import { getOrders } from '../../api/adminApi';
import { ExternalLink } from 'lucide-react';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await getOrders(page);
            setOrders(data.orders);
            setTotalPages(data.pages);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching orders", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Order Management</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-600">Order ID</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Product</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Buyer</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Farmer</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Total</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-xs text-slate-500">
                                    {order._id.substring(0, 8).toUpperCase()}
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-800">
                                    {order.product?.cropName || 'Unknown Product'}
                                    <span className="block text-xs text-slate-500">{order.quantityKg}kg</span>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{order.buyer?.name || 'Unknown'}</td>
                                <td className="px-6 py-4 text-slate-600">{order.farmer?.name || 'Unknown'}</td>
                                <td className="px-6 py-4 font-medium text-slate-800">₹{order.totalPrice}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                        ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                                            order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    order.status === 'disputed' ? 'bg-red-600 text-white' :
                                                        'bg-blue-100 text-blue-800'}`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-sm">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {orders.length === 0 && !loading && (
                    <div className="p-8 text-center text-slate-500">No orders found.</div>
                )}
            </div>

            <div className="flex justify-between items-center">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 border border-slate-200 rounded-lg disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-slate-600">Page {page} of {totalPages}</span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 border border-slate-200 rounded-lg disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AdminOrders;
