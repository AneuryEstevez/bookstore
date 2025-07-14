import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ReviewModal from '../components/ReviewModal';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { StarIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

const PurchaseHistory = () => {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewAllOrders, setViewAllOrders] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [viewAllOrders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const endpoint = viewAllOrders ? '/order/all' : '/order';
      const response = await api.get(endpoint);
      setOrders(response.data);
    } catch (err) {
      setError('Failed to load purchase history. Please try again.');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button
            onClick={fetchOrders}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const handleReviewBook = (book) => {
    setSelectedBook(book);
    setShowReviewModal(true);
  };

  const submitReview = async (reviewData) => {
    if (!selectedBook) return;

    try {
      setSubmittingReview(true);
      await api.post('/review', {
        bookId: selectedBook.bookId,
        bookTitle: selectedBook.title,
        rating: reviewData.rating,
        content: reviewData.content
      });
      
      setShowReviewModal(false);
      setSelectedBook(null);
      toast.success('Review submitted successfully!');
    } catch (err) {
      console.error('Error submitting review:', err);
      const errorMessage = err.response?.data || 'Failed to submit review. Please try again.';
      toast.error(`${errorMessage}`);
    } finally {
      setSubmittingReview(false);
      closeReviewModal();
    }
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedBook(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Purchase History
              </h1>
              <p className="text-gray-600 mt-2">
                {viewAllOrders ? 'View all orders from all users' : 'View your past orders and purchase details'}
              </p>
            </div>
            
            {/* Admin Toggle */}
            {isAdmin && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">My Orders</span>
                <button
                  onClick={() => setViewAllOrders(!viewAllOrders)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    viewAllOrders ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      viewAllOrders ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-700">All Orders</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {orders.length === 0 ? (
          /* No Orders */
          <div className="flex flex-col items-center justify-center py-12 ">
            <div className="text-6xl mb-4">
              <ShoppingBagIcon className="h-16 w-16 text-gray-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {viewAllOrders ? 'No orders found' : 'No orders yet'}
            </h2>
            <p className="text-gray-600 mb-6">
              {viewAllOrders ? 'No orders have been placed yet.' : "You haven't made any purchases yet."}
            </p>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.purchaseDate).toLocaleDateString()} at {new Date(order.purchaseDate).toLocaleTimeString()}
                    </p>
                    {/* Show customer info for admin viewing all orders */}
                    {viewAllOrders && order.userEmail && (
                      <p className="text-sm text-blue-600 mt-1">
                        Customer: {order.userEmail}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      ${order.totalAmount?.toFixed(2)}
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'COMPLETED' 
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                {order.items && order.items.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Items:</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              by {item.author}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm text-gray-900">
                                Qty: {item.quantity} × ${item.price?.toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-500">
                                ${(item.quantity * item.price).toFixed(2)}
                              </p>
                            </div>
                            {/* Review Button - Only show for non-admin view */}
                            {!viewAllOrders && (
                              <button
                                onClick={() => handleReviewBook(item)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center"
                              >
                                <StarIcon className="h-4 w-4 mr-2 text-yellow-300" />
                                Review
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={closeReviewModal}
        onSubmit={submitReview}
        book={selectedBook}
        isSubmitting={submittingReview}
      />
    </div>
  );
};

export default PurchaseHistory; 