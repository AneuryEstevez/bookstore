import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import PayPalCheckoutButton from '../components/PayPalCheckoutButton';
import ConfirmationModal from '../components/ConfirmationModal';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState({});
  const [showClearModal, setShowClearModal] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/cart');
      setCart(response.data);
    } catch (err) {
      setError('Failed to load cart. Please try again.');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (bookId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdateLoading(prev => ({ ...prev, [bookId]: true }));
    try {
      await api.put('/cart/update', { bookId, quantity: newQuantity });
      setCart(prevCart => ({
        ...prevCart,
        items: prevCart.items.map(item =>
          item.bookId === bookId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      }));
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Failed to update item quantity.');
    } finally {
      setUpdateLoading(prev => ({ ...prev, [bookId]: false }));
    }
  };

  const removeItem = async (bookId) => {
    setUpdateLoading(prev => ({ ...prev, [bookId]: true }));
    try {
      await api.delete('/cart/remove', { params: { bookId } });
      setCart(prevCart => ({
        ...prevCart,
        items: prevCart.items.filter(item => item.bookId !== bookId)
      }));
      toast.success('Book removed from cart!');
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item from cart.');
    } finally {
      setUpdateLoading(prev => ({ ...prev, [bookId]: false }));
    }
  };

  const handleClearCart = () => {
    setShowClearModal(true);
  };

  const clearAllItems = async () => {
    setLoading(true);
    try {
      await api.delete('/cart/empty');
      setCart({ ...cart, items: [] });
      toast.success('Cart cleared successfully!');
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to clear cart.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  // After successful PayPal payment, clear cart in UI
  const handlePaymentSuccess = () => {
    setCart(prev => (prev ? { ...prev, items: [] } : prev));
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
            onClick={fetchCart}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const cartItems = cart?.items || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Shopping Cart
              </h1>
              <p className="text-gray-600 mt-2">
                {cartItems.length === 0 
                  ? 'Your cart is empty' 
                  : `${getTotalItems()} item${getTotalItems() !== 1 ? 's' : ''} in your cart`
                }
              </p>
            </div>
            <Link
              to="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="flex flex-col items-center justify-center py-12 ">
            <div className="text-6xl mb-4">
              <ShoppingCartIcon className="h-16 w-16 text-gray-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link
              to="/"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Cart Items</h2>
                  {cartItems.length > 0 && (
                    <button
                      onClick={handleClearCart}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Book Info */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            by {item.author}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                            disabled={updateLoading[item.bookId] || item.quantity <= 1}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                            disabled={updateLoading[item.bookId]}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>

                        {/* Price and Remove */}
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500 mb-2">
                            ${item.price.toFixed(2)} each
                          </div>
                          <button
                            onClick={() => removeItem(item.bookId)}
                            disabled={updateLoading[item.bookId]}
                            className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                          >
                            {updateLoading[item.bookId] ? 'Removing...' : 'Remove'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({getTotalItems()} items)</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${(calculateTotal()).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* PayPal Checkout Button */}
                <div className="mb-3">
                  {cartItems.length > 0 && (
                    <PayPalCheckoutButton amount={(calculateTotal()).toFixed(2)} onSuccess={handlePaymentSuccess} />
                  )}
                </div>
                
                <Link
                  to="/"
                  className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md font-medium transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={clearAllItems}
        title="Clear Cart"
        message="Are you sure you want to clear your entire cart? This action cannot be undone and all items will be removed."
        confirmText="Clear Cart"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
};

export default Cart;