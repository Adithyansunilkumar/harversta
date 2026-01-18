import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const Register = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'farmer',
        language: 'en'
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/register', formData);
            localStorage.setItem('token', data.token);
            if (data.role === 'farmer') {
                navigate('/dashboard');
            } else if (data.role === 'buyer') {
                navigate('/marketplace');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || t('error'));
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left Side - Image/Branding (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 bg-green-600 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-800 opacity-90 z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1625246333195-bf7305d23315?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
                    alt="Farm fields"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-20 text-white p-12 max-w-lg">
                    <h1 className="text-5xl font-bold mb-6 tracking-tight">Join Harvesta Today</h1>
                    <p className="text-xl text-green-50 mb-8 font-light">Start your journey towards fairer trade and fresher produce. Whether you're growing or buying, we've got you covered.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-12 lg:w-1/2 bg-white">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">Harvesta</Link>
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">{t('register')}</h2>
                        <p className="mt-2 text-sm text-gray-500">Create your account to get started</p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
                            <input type="text" name="name" onChange={handleChange} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all sm:text-sm" placeholder="John Doe" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                            <input type="email" name="email" onChange={handleChange} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all sm:text-sm" placeholder="you@example.com" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
                            <input type="password" name="password" onChange={handleChange} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all sm:text-sm" placeholder="••••••••" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('role')}</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'farmer' })}
                                    className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all flex flex-col items-center justify-center gap-2 ${formData.role === 'farmer' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <span className="text-lg">👨‍🌾</span>
                                    {t('farmer')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'buyer' })}
                                    className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all flex flex-col items-center justify-center gap-2 ${formData.role === 'buyer' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <span className="text-lg">🛒</span>
                                    {t('buyer')}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:-translate-y-0.5 mt-6">
                            {t('register')}
                        </button>
                    </form>
                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-green-600 hover:text-green-500 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
