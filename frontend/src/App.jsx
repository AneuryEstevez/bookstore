import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
import BookCatalog from './pages/BookCatalog'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import PurchaseHistory from './pages/PurchaseHistory'
import Dashboard from './pages/Dashboard'
import UserManagement from './pages/UserManagement'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<BookCatalog />} />
        <Route 
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/purchase-history"
          element={
            <ProtectedRoute>
              <PurchaseHistory />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user-management"
          element={
            <ProtectedRoute adminOnly={true}>
              <UserManagement />
            </ProtectedRoute>
          } 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </BrowserRouter>
  )
}

export default App
