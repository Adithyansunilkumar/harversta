import React from 'react';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{t('welcome')}</h1>
            <p className="text-xl text-gray-600 mb-8">Empowering Farmers, Connecting Buyers.</p>
        </div>
    );
};

export default Home;
