import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    ShoppingCart,
    Star,
    BarChart2,
    LogOut,
    Settings,
    ClipboardList,
    TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
    const { logout } = useAuth();

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Farmers', path: '/admin/farmers', icon: Users },
        { name: 'Products', path: '/admin/products', icon: ShoppingBag },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
        { name: 'Reviews', path: '/admin/reviews', icon: Star },
        { name: 'Analytics', path: '/admin/analytics', icon: BarChart2 },
        { name: 'Market Prices', path: '/admin/market-prices', icon: TrendingUp },
        { name: 'Audit Logs', path: '/admin/audit-logs', icon: ClipboardList },
    ];

    return (
        <div className="h-screen w-64 bg-slate-900 text-white fixed left-0 top-0 flex flex-col shadow-xl z-50">
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                    Admin Panel
                </h1>
                <p className="text-xs text-slate-400 mt-1">Harvesta Management</p>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-lg shadow-emerald-500/20'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-slate-800 rounded-xl transition-colors"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
