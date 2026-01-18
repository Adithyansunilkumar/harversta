import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

const Navbar = () => {
    const { t } = useTranslation();
    const token = localStorage.getItem('token');
    const [role, setRole] = useState(null);

    React.useEffect(() => {
        if (token) {
            // Fetch role to decide links
            // We use fetch here to avoid circular dep if we use the axios instance
            fetch('http://localhost:5000/api/auth/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => setRole(data.role))
                .catch(err => console.error(err));
        }
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <nav className="bg-white shadow p-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-green-700">Harvesta</Link>
            <div className="flex items-center gap-4">
                <LanguageSelector />
                {token ? (
                    <>
                        {role === 'farmer' && (
                            <Link to="/dashboard" className="text-gray-700 hover:text-green-600">{t('farmerDashboard')}</Link>
                        )}
                        {role === 'buyer' && (
                            <>
                                <Link to="/marketplace" className="text-gray-700 hover:text-green-600">{t('buyerMarketplace')}</Link>
                                <Link to="/orders" className="text-gray-700 hover:text-green-600">{t('myOrders')}</Link>
                            </>
                        )}
                        <button onClick={handleLogout} className="text-red-500 hover:text-red-700">{t('logout')}</button>
                    </>
                ) : (
                    <Link to="/login" className="text-green-600">{t('login')}</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
