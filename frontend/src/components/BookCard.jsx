import { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import BookReviewsModal from './BookReviewsModal';

const BookCard = ({ book }) => {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showReviewsModal, setShowReviewsModal] = useState(false);

  const handleAddToCart = async () => {
    if (adding) return;
    try {
      setAdding(true);
      await api.post('/cart/add', {
        bookId: book.id,
        quantity: quantity,
      });
      setAdded(true);
      toast.success(`Added ${quantity} ${quantity === 1 ? 'book' : 'books'} to cart!`);
      setTimeout(() => setAdded(false), 1500);
      setQuantity(1);
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      {/* Book Title */}
      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
        {book.title}
      </h3>
      
      {/* Author */}
      <p className="text-gray-600 text-sm mb-3">
        by <span className="font-medium">{book.author}</span>
      </p>
      
      {/* Genre and Publisher */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {book.genre}
          </span>
        </div>
        <p className="text-xs text-gray-500">
          Published by {book.publisher}
        </p>
      </div>
      
      {/* Price */}
      <div className="mb-4">
        <span className="text-2xl font-bold text-green-600">
          ${book.price.toFixed(2)}
        </span>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Qty:</span>
          <button
            onClick={decreaseQuantity}
            disabled={quantity <= 1 || adding}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            −
          </button>
          <span className="w-8 text-center font-medium text-gray-900">
            {quantity}
          </span>
          <button
            onClick={increaseQuantity}
            disabled={adding}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={adding}
        className={`w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 mb-2 ${adding ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {adding ? 'Adding...' : added ? 'Added!' : `Add ${quantity} to Cart`}
      </button>

      {/* View Reviews Button */}
      <button
        onClick={() => setShowReviewsModal(true)}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200"
      >
        View Reviews
      </button>

      {/* Reviews Modal */}
      <BookReviewsModal
        isOpen={showReviewsModal}
        onClose={() => setShowReviewsModal(false)}
        book={book}
      />
    </div>
  );
};

export default BookCard; 