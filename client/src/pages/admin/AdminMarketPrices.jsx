import React, { useState } from 'react';
import { RefreshCw, Save, TrendingUp, AlertCircle } from 'lucide-react';

const AdminMarketPrices = () => {
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleString());

    // Mock Data
    const [prices, setPrices] = useState([
        { id: 1, crop: 'Wheat', variety: 'Lokwan', state: 'Madhya Pradesh', marketPrice: 2200, lastUpdate: '2025-05-20' },
        { id: 2, crop: 'Rice', variety: 'Basmati', state: 'Punjab', marketPrice: 4500, lastUpdate: '2025-05-20' },
        { id: 3, crop: 'Cotton', variety: 'H-4', state: 'Gujarat', marketPrice: 6100, lastUpdate: '2025-05-19' },
        { id: 4, crop: 'Maize', variety: 'Desi', state: 'Bihar', marketPrice: 1850, lastUpdate: '2025-05-18' },
        { id: 5, crop: 'Onion', variety: 'Nasik Red', state: 'Maharashtra', marketPrice: 1200, lastUpdate: '2025-05-20' },
    ]);

    const handleSync = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setLastUpdated(new Date().toLocaleString());
            alert('Market prices successfully synced with Government e-NAM database.');
        }, 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Government Market Prices</h1>
                    <p className="text-slate-500">Manage and sync daily mandi rates (e-NAM integration)</p>
                </div>
                <button
                    onClick={handleSync}
                    disabled={loading}
                    className="flex items-center px-6 py-4 h-14 text-lg font-medium bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-md active:scale-95"
                >
                    <RefreshCw className={`w-6 h-6 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Syncing...' : 'Sync from Govt API'}
                </button>
            </div>

            {/* Status Card */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                    <h4 className="font-semibold text-blue-800">Data Source Status: Connected</h4>
                    <p className="text-sm text-blue-600 mt-1">
                        Connected to <span className="font-mono bg-blue-100 px-1 rounded">api.enam.gov.in/v2/prices</span>.
                        Last successful sync: {lastUpdated}.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-600">Crop</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Variety</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">State/Market</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Market Price (₹/Quintal)</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Trend</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {prices.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-800">{item.crop}</td>
                                <td className="px-6 py-4 text-slate-600">{item.variety}</td>
                                <td className="px-6 py-4 text-slate-600">{item.state}</td>
                                <td className="px-6 py-4 font-mono font-medium text-slate-800">₹{item.marketPrice}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                        <TrendingUp className="w-3 h-3 mr-1" /> +1.2%
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-slate-400 hover:text-emerald-600 transition-colors">
                                        <Save className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="text-center text-xs text-slate-400">
                * Prices are updated daily at 09:00 AM IST based on mandi arrivals.
            </div>
        </div>
    );
};

export default AdminMarketPrices;
