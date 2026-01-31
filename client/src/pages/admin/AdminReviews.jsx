import React, { useEffect, useState } from 'react';
import { getReviews, moderateReview } from '../../api/adminApi';
import { Star, Flag, EyeOff } from 'lucide-react';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const data = await getReviews(page);
            setReviews(data.reviews);
            setTotalPages(data.pages);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching reviews", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [page]);

    const handleFlag = async (id) => {
        if (window.confirm('Flag this review?')) {
            try {
                await moderateReview(id, { flagStatus: 'flagged' });
                fetchReviews();
            } catch (error) {
                alert('Failed to flag review');
            }
        }
    };

    const handleHide = async (id) => {
        if (window.confirm('Hide this review?')) {
            try {
                await moderateReview(id, { flagStatus: 'hidden' });
                fetchReviews();
            } catch (error) {
                alert('Failed to hide review');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Review Management</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review) => (
                    <div key={review._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center">
                                <div className="flex text-amber-400 mr-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-bold text-slate-700">{review.rating}/5</span>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${review.flagStatus === 'clean' ? 'bg-slate-100 text-slate-500' :
                                    review.flagStatus === 'flagged' ? 'bg-amber-100 text-amber-800' :
                                        'bg-red-100 text-red-800'
                                }`}>
                                {review.flagStatus.toUpperCase()}
                            </span>
                        </div>

                        <p className="text-slate-600 mb-4 line-clamp-3">
                            "{review.comment}"
                        </p>

                        <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-100 pt-4">
                            <div>
                                <span className="font-medium text-slate-700">{review.buyer?.name}</span>
                                <span className="mx-1">reviewed</span>
                                <span className="font-medium text-slate-700">{review.farmer?.name}</span>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleFlag(review._id)}
                                    className="p-1 hover:bg-amber-50 text-amber-500 rounded transition-colors"
                                    title="Flag Content"
                                >
                                    <Flag className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleHide(review._id)}
                                    className="p-1 hover:bg-red-50 text-red-500 rounded transition-colors"
                                    title="Hide Content"
                                >
                                    <EyeOff className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {reviews.length === 0 && !loading && (
                <div className="p-8 text-center text-slate-500">No reviews found.</div>
            )}

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

export default AdminReviews;
