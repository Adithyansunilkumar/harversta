import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../../api/adminApi';
import {
    Users,
    CheckCircle,
    XCircle,
    ShoppingBag,
    DollarSign,
    AlertTriangle,
    TrendingUp
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, subValue, subLabel }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
                {subValue && (
                    <p className="text-xs text-slate-400 mt-2">
                        <span className={subValue > 0 ? "text-emerald-500" : "text-slate-400"}>
                            {subValue}
                        </span> {subLabel}
                    </p>
                )}
            </div>
            <div className={`p-4 rounded-xl ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading Dashboard...</div>;
    if (!stats) return <div className="p-8 text-center text-red-500">Failed to load stats.</div>;

    const { metrics, alerts } = stats;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
                    <p className="text-slate-500">Welcome back, Admin</p>
                </div>
                <div className="text-sm text-slate-400">
                    Last updated: {new Date().toLocaleTimeString()}
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Total Transaction Value"
                    value={`₹${metrics.totalRevenue.toLocaleString()}`}
                    subValue={metrics.completedOrders}
                    subLabel="Completed Orders"
                    icon={DollarSign}
                    color="bg-emerald-500"
                />
                <StatCard
                    title="Platform Profit"
                    value={`₹${metrics.platformProfit.toLocaleString()}`}
                    subValue="4%"
                    subLabel="Commission"
                    icon={TrendingUp} // Will need to import TrendingUp
                    color="bg-purple-500"
                />
                <StatCard
                    title="Farmer Earnings"
                    value={`₹${metrics.farmerEarnings.toLocaleString()}`}
                    subValue="96%"
                    subLabel="Payout"
                    icon={Users}
                    color="bg-indigo-500"
                />
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                <StatCard
                    title="Total Orders"
                    value={metrics.totalOrders}
                    subValue={metrics.completedOrders}
                    subLabel="Completed"
                    icon={ShoppingBag}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Farmers"
                    value={metrics.totalFarmers}
                    subValue={metrics.verifiedFarmers}
                    subLabel="Verified"
                    icon={Users}
                    color="bg-teal-500"
                />
                <StatCard
                    title="Products"
                    value={metrics.totalProducts}
                    subValue={metrics.activeProducts}
                    subLabel="Active"
                    icon={CheckCircle}
                    color="bg-orange-500"
                />
            </div>

            {/* Alerts Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
                    Action Required
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-center justify-between">
                        <div>
                            <p className="text-amber-800 font-medium">Pending Verifications</p>
                            <p className="text-sm text-amber-600">Farmer Documents</p>
                        </div>
                        <span className="text-2xl font-bold text-amber-900">{alerts.pendingVerifications}</span>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between">
                        <div>
                            <p className="text-blue-800 font-medium">Product Approvals</p>
                            <p className="text-sm text-blue-600">Waiting for review</p>
                        </div>
                        <span className="text-2xl font-bold text-blue-900">{alerts.pendingProductApprovals}</span>
                    </div>
                    <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-center justify-between">
                        <div>
                            <p className="text-red-800 font-medium">Reported Reviews</p>
                            <p className="text-sm text-red-600">Need moderation</p>
                        </div>
                        <span className="text-2xl font-bold text-red-900">{alerts.reportedReviews}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
