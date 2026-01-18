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
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || t('error'));
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{t('register')}</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">{t('name')}</label>
                    <input type="text" name="name" onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">{t('email')}</label>
                    <input type="email" name="email" onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">{t('password')}</label>
                    <input type="password" name="password" onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">{t('role')}</label>
                    <select name="role" onChange={handleChange} value={formData.role} className="w-full p-2 border rounded">
                        <option value="farmer">{t('farmer')}</option>
                        <option value="buyer">{t('buyer')}</option>
                    </select>
                </div>

                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                    {t('register')}
                </button>
            </form>
        </div>
    );
};

export default Register;
