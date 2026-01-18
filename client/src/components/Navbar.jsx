import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

const Navbar = () => {
    const { t } = useTranslation();
    const token = localStorage.getItem('token');
    // Simple check - in real app decode token to check role/expiry
    const isLoggedIn = !!token;

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <nav className="bg-white shadow p-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-green-700">Harvesta</Link>
            <div className="flex items-center gap-4">
                <LanguageSelector />
                {isLoggedIn ? (
                    <>
                        <Link to="/dashboard" className="text-gray-700 hover:text-green-600">{t('farmerDashboard')}</Link>
                        <button onClick={handleLogout} className="text-red-500 hover:text-red-700">{t('logout') || 'Logout'}</button>
                    </>
                ) : (
                    <Link to="/login" className="text-green-600">{t('login')}</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
