import React from 'react';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-b from-green-50/50 to-white pt-16 pb-32">
                <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-green-100 opacity-50 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-emerald-100 opacity-50 blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100 mb-8 animate-fade-in-up">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span className="text-sm font-medium text-green-700">Empowering Local Agriculture</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-tight">
                            {t('welcome')}
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 mt-2">Sustainable Future</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                            Connect directly with local farmers, access fresh produce, and build a more sustainable food supply chain. No middlemen, just fair prices.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="/register" className="px-8 py-4 rounded-full bg-green-600 text-white font-bold text-lg hover:bg-green-700 hover:shadow-lg hover:shadow-green-200 transition-all transform hover:-translate-y-1">
                                Join Harvesta
                            </a>
                            <a href="/login" className="px-8 py-4 rounded-full bg-white text-gray-700 border border-gray-200 font-bold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all">
                                Sign In
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                            <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="text-3xl">🌾</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">For Farmers</h3>
                            <p className="text-gray-600 leading-relaxed">
                                List your produce, manage inventory easily, and sell directly to buyers at fair market prices.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                            <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="text-3xl">🛒</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">For Buyers</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Access fresh, locally sourced produce. Order in bulk or retail quantities directly from the source.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                            <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="text-3xl">🤝</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Fair Trade</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Transparent pricing and direct connections ensuring fair returns for farmers and quality for buyers.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
