import React, { useEffect, useState } from 'react';
import { getFarmers, updateFarmerStatus } from '../../api/adminApi';
import { Check, X, Search, ShieldCheck } from 'lucide-react';

const AdminFarmers = () => {
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchFarmers = async () => {
        try {
            setLoading(true);
            const data = await getFarmers(page, searchTerm);
            setFarmers(data.farmers);
            setTotalPages(data.pages);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching farmers", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFarmers();
    }, [page, searchTerm]);

    const handleVerify = async (id) => {
        if (window.confirm('Are you sure you want to verify this farmer?')) {
            try {
                await updateFarmerStatus(id, { isVerified: true });
                fetchFarmers();
            } catch (error) {
                alert('Failed to verify farmer');
            }
        }
    };

    const handleReject = async (id) => {
        if (window.confirm('Are you sure you want to revoke verification?')) {
            try {
                await updateFarmerStatus(id, { isVerified: false });
                fetchFarmers();
            } catch (error) {
                alert('Failed to revoke verification');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Farmer Management</h1>
                <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search farmers..."
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-600">Farmer</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Email</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Location</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {farmers.map((farmer) => (
                            <tr key={farmer._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold mr-3">
                                            {farmer.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-800">{farmer.name}</p>
                                            <p className="text-xs text-slate-500">ID: {farmer._id.substring(0, 8)}...</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{farmer.email}</td>
                                <td className="px-6 py-4 text-slate-600">{farmer.location || 'N/A'}</td>
                                <td className="px-6 py-4">
                                    {farmer.isVerified ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                            <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                            Unverified
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-2">
                                        {!farmer.isVerified && (
                                            <button
                                                onClick={() => handleVerify(farmer._id)}
                                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                title="Verify Farmer"
                                            >
                                                <Check className="w-5 h-5" />
                                            </button>
                                        )}
                                        {farmer.isVerified && (
                                            <button
                                                onClick={() => handleReject(farmer._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Revoke Verification"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {farmers.length === 0 && !loading && (
                    <div className="p-8 text-center text-slate-500">No farmers found.</div>
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

export default AdminFarmers;
