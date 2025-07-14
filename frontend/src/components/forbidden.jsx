import { Link } from 'react-router-dom';

const Forbidden = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          403 - Forbidden
        </h1>
        <p className="text-gray-600 mb-6 text-lg">
          You don't have permission to access this page.
        </p>
        <p className="text-gray-500 mb-8">
          This page requires admin privileges that your account doesn't have.
        </p>
        <div className="space-x-4">
          <Link
            to="/"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            Go Home
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
