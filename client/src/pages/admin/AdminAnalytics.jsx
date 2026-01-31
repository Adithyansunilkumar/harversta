import React, { useEffect, useState } from 'react';
import { getAnalytics } from '../../api/adminApi';
import { BarChart2, TrendingUp, Calendar, Package } from 'lucide-react';

const AdminAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const result = await getAnalytics();
                setData(result);
            } catch (error) {
                console.error("Error fetching analytics", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading Analytics...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Failed to load analytics.</div>;

    const { ordersPerDay, topSellingProducts, newFarmersTrend } = data;

    // Helper for max value to scale charts
    const getMaxValue = (arr, key) => Math.max(...arr.map(item => item[key]), 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Analytics & Insights</h1>
            </div>

            {/* Top Selling Products */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-emerald-500" />
                    Top Selling Products
                </h3>
                <div className="space-y-4">
                    {topSellingProducts.map((product) => (
                        <div key={product._id} className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
                                        {product.productName}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-semibold inline-block text-emerald-600">
                                        {product.totalQuantity} kg
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-emerald-100">
                                <div
                                    style={{ width: `${(product.totalQuantity / getMaxValue(topSellingProducts, 'totalQuantity')) * 100}%` }}
                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
                                ></div>
                            </div>
                        </div>
                    ))}
                    {topSellingProducts.length === 0 && <p className="text-slate-500 text-sm">No sales data available yet.</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Orders Per Day Chart (Simple Visualization) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                        <BarChart2 className="w-5 h-5 mr-2 text-blue-500" />
                        Orders (Last 7 Days)
                    </h3>
                    <div className="flex items-end space-x-2 h-48">
                        {ordersPerDay.map((day) => (
                            <div key={day._id} className="flex-1 flex flex-col items-center group relative">
                                <div
                                    className="w-full bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all"
                                    style={{ height: `${(day.count / (getMaxValue(ordersPerDay, 'count') || 1)) * 100}%` }}
                                ></div>
                                <span className="text-xs text-slate-500 mt-2 transform -rotate-45 origin-top-left translate-y-2">
                                    {new Date(day._id).toLocaleDateString(undefined, { weekday: 'short' })}
                                </span>
                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-800 text-white text-xs rounded px-2 py-1">
                                    {day.count} Orders - ₹{day.revenue}
                                </div>
                            </div>
                        ))}
                        {ordersPerDay.length === 0 && <p className="text-slate-500 text-sm w-full text-center self-center">No recent orders.</p>}
                    </div>
                </div>

                {/* Farmer Onboarding Trend */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-indigo-500" />
                        New Farmers (Last 7 Days)
                    </h3>
                    <div className="flex items-end space-x-2 h-48">
                        {newFarmersTrend.map((day) => (
                            <div key={day._id} className="flex-1 flex flex-col items-center group relative">
                                <div
                                    className="w-full bg-indigo-500 rounded-t-sm hover:bg-indigo-600 transition-all"
                                    style={{ height: `${(day.count / (getMaxValue(newFarmersTrend, 'count') || 1)) * 100}%` }}
                                ></div>
                                <span className="text-xs text-slate-500 mt-2 transform -rotate-45 origin-top-left translate-y-2">
                                    {new Date(day._id).toLocaleDateString(undefined, { weekday: 'short' })}
                                </span>
                                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-800 text-white text-xs rounded px-2 py-1">
                                    {day.count} New Farmers
                                </div>
                            </div>
                        ))}
                        {newFarmersTrend.length === 0 && <p className="text-slate-500 text-sm w-full text-center self-center">No recent registrations.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
