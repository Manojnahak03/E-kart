import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from 'react-router-dom';

import { useSelector } from 'react-redux';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Verify from './pages/Verify';

import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import Profile from './pages/Profile';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';


const chrome = (page) => (
  <>
    <Navbar />
    {page}
    <Footer />
  </>
);


// Admin protection
function RequireAdmin() {
  const user = useSelector((state) => state.user.user);

  return user?.role === 'admin'
    ? chrome(<Admin />)
    : <Navigate to="/login" replace />;
}


// User protection
function RequireUser({ children }) {
  const user = useSelector((state) => state.user.user);

  return user
    ? chrome(children)
    : <Navigate to="/login" replace />;
}


const router = createBrowserRouter([
  {
    path: '/',
    element: chrome(<Home />)
  },

  {
    path: '/dashboard',
    element: chrome(<Dashboard />)
  },

  {
    path: '/products',
    element: chrome(<Products />)
  },

  {
    path: '/cart',
    element: chrome(<Cart />)
  },

  {
    path: '/checkout',
    element: (
      <RequireUser>
        <Checkout />
      </RequireUser>
    )
  },

  {
    path: '/profile',
    element: (
      <RequireUser>
        <Profile />
      </RequireUser>
    )
  },

  {
    path: '/admin',
    element: <RequireAdmin />
  },

  // Authentication
  {
    path: '/signup',
    element: <Signup />
  },

  {
    path: '/login',
    element: <Login />
  },

  // Registration OTP
  {
    path: '/verify',
    element: <Verify />
  },

  // Forgot password
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },

  // Forgot password OTP + new password
  {
    path: '/reset-password',
    element: <ResetPassword />
  }
]);


export default function App() {
  return <RouterProvider router={router} />;
}