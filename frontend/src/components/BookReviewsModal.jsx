import { useState, useEffect } from 'react';
import { XMarkIcon, StarIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const BookReviewsModal = ({ 
  isOpen, 
  onClose, 
  book
}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetchReviews();
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, book]);

  const fetchReviews = async () => {
    if (!book?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/review/book/${book.id}`);
      const reviewsData = response.data;
      setReviews(reviewsData);
      setTotalReviews(reviewsData.length);
      
      // Calculate average rating
      if (reviewsData.length > 0) {
        const avg = reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length;
        setAverageRating(avg);
      } else {
        setAverageRating(0);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index}>
        {index < Math.floor(rating) ? (
          <StarIconSolid className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 inline" />
        ) : (
          <StarIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-300 inline" />
        )}
      </span>
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-500/75 transition-opacity duration-300 ease-out"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="flex min-h-full items-end justify-center p-2 text-center sm:items-center sm:p-4">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all duration-300 ease-out w-full max-w-sm sm:max-w-2xl lg:max-w-3xl sm:my-8">
          {/* Header */}
          <div className="bg-white px-3 pt-4 pb-3 sm:px-6 sm:pt-5 sm:pb-4">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div className="flex-1 pr-3">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Book Reviews
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                  {book.title} by {book.author}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded flex-shrink-0"
              >
                <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            {/* Rating Summary */}
            {totalReviews > 0 && (
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {renderStars(averageRating)}
                    </div>
                    <span className="text-base sm:text-lg font-semibold text-gray-900">
                      {averageRating.toFixed(1)}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500">
                      ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Content */}
            <div className="max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-6 sm:py-8">
                  <LoadingSpinner />
                </div>
              ) : error ? (
                <div className="text-center py-6 sm:py-8">
                  <p className="text-red-500 mb-3 sm:mb-4 text-sm sm:text-base">{error}</p>
                  <button
                    onClick={fetchReviews}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium"
                  >
                    Try Again
                  </button>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <div className="text-gray-400 text-3xl sm:text-4xl mb-3 sm:mb-4 flex justify-center items-center">
                    <PencilSquareIcon className="h-16 w-16 text-gray-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                    No reviews yet
                  </h3>
                  <p className="text-gray-500 text-sm sm:text-base">
                    Be the first to review this book!
                  </p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-3 sm:pb-4 last:border-b-0">
                      <div className="flex items-start justify-between mb-2 space-x-2">
                        <div className="flex items-center space-x-1 sm:space-x-2 min-w-0 flex-1">
                          <div className="flex items-center flex-shrink-0">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                            {review.userEmail || 'Anonymous'}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 text-xs sm:text-sm italic">
                        {review.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 px-3 py-3 sm:px-6">
            <div className="flex justify-center sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto inline-flex justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookReviewsModal; 