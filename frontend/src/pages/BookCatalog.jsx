import { useState, useEffect } from 'react';
import api from '../services/api';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';

const BookCatalog = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // What user types
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(''); // What gets sent to API
  const [searchType, setSearchType] = useState('all');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(12);

  // Search type options
  const searchTypes = [
    { value: 'all', label: 'All Fields' },
    { value: 'title', label: 'Title' },
    { value: 'author', label: 'Author' },
    { value: 'genre', label: 'Genre' },
    { value: 'publisher', label: 'Publisher' }
  ];

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch books when debounced search term, search type, or page changes
  useEffect(() => {
    fetchBooks();
  }, [currentPage, debouncedSearchTerm, searchType]);

  // Reset to first page when search term changes (immediate, not debounced)
  useEffect(() => {
    if (currentPage !== 0) {
      setCurrentPage(0);
    }
  }, [debouncedSearchTerm, searchType]);

  const getApiEndpoint = () => {
    if (!debouncedSearchTerm.trim()) {
      return '/catalog';
    }
    
    switch (searchType) {
      case 'title':
        return '/catalog/title';
      case 'author':
        return '/catalog/author';
      case 'genre':
        return '/catalog/genre';
      case 'publisher':
        return '/catalog/publisher';
      case 'all':
      default:
        return '/catalog/search';
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        size: pageSize,
      };
      
      // Add search parameter if search term exists
      if (debouncedSearchTerm.trim()) {
        params.q = debouncedSearchTerm.trim();
      }
      
      const endpoint = getApiEndpoint();
      const response = await api.get(endpoint, { params });
      const data = response.data;
      
      setBooks(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setError('Failed to load books. Please try again later.');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm); // Update immediately for UI responsiveness
    // Don't reset page here - let the useEffect handle it when debouncedSearchTerm changes
  };

  const handleSearchTypeChange = (newSearchType) => {
    setSearchType(newSearchType);
    // Page reset will be handled by useEffect
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDebouncedSearchTerm(''); // Clear immediately to stop any pending search
    setSearchType('all');
    setCurrentPage(0);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button
            onClick={fetchBooks}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Book Catalog
            </h1>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Books
              </label>
              <input
                type="text"
                id="search"
                placeholder="Enter your search term..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Search Type Filter */}
            <div className="sm:w-64">
              <label htmlFor="searchType" className="block text-sm font-medium text-gray-700 mb-2">
                Search By
              </label>
              <select
                id="searchType"
                value={searchType}
                onChange={(e) => handleSearchTypeChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {searchTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Info */}
          <div className="mt-4 flex items-center justify-end">
            {searchTerm && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Clear search
              </button>
            )}
          </div>
        </div>

        {/* Books Grid or Loading */}
        {loading && books.length === 0 ? (
          <LoadingSpinner />
        ) : (
          <>
            {books.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">
                  {debouncedSearchTerm ? `No books found matching "${debouncedSearchTerm}" in ${searchTypes.find(t => t.value === searchType)?.label.toLowerCase()}.` : 'No books available.'}
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {books.map(book => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                    itemName="books"
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookCatalog; 