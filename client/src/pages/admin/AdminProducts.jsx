import React, { useEffect, useState } from 'react';
import { getProducts, updateProductStatus } from '../../api/adminApi';
import { Check, X, Search, Filter } from 'lucide-react';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await getProducts(page, searchTerm, statusFilter);
            setProducts(data.products);
            setTotalPages(data.pages);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, searchTerm, statusFilter]);

    const handleApprove = async (id) => {
        try {
            await updateProductStatus(id, { status: 'approved' });
            fetchProducts();
        } catch (error) {
            alert('Failed to approve product');
        }
    };

    const handleReject = async (id) => {
        if (window.confirm('Reject this product?')) {
            try {
                await updateProductStatus(id, { status: 'rejected' });
                fetchProducts();
            } catch (error) {
                alert('Failed to reject product');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Product Management</h1>
                <div className="flex space-x-4">
                    <select
                        className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="flagged">Flagged</option>
                    </select>
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-600">Product</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Farmer</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Price/Qty</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {products.map((product) => (
                            <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-medium text-slate-800">{product.cropName}</p>
                                    <p className="text-xs text-slate-500">{product.category}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm text-slate-800">{product.farmer?.name || 'Unknown'}</p>
                                    <p className="text-xs text-slate-500">{product.farmer?.email}</p>
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    Rs.{product.pricePerKg}/kg <br />
                                    <span className="text-xs text-slate-500">{product.quantityKg}kg avail</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                        ${product.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                                            product.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                                product.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-slate-100 text-slate-800'}`}>
                                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-2">
                                        {product.status !== 'approved' && (
                                            <button
                                                onClick={() => handleApprove(product._id)}
                                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                title="Approve"
                                            >
                                                <Check className="w-5 h-5" />
                                            </button>
                                        )}
                                        {product.status !== 'rejected' && (
                                            <button
                                                onClick={() => handleReject(product._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Reject"
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
                {products.length === 0 && !loading && (
                    <div className="p-8 text-center text-slate-500">No products found.</div>
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

export default AdminProducts;
