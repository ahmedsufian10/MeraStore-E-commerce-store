import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import SingleOrder from './pages/SingleOrder';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import CreateProduct from './pages/admin/CreateProduct';
import EditProduct from './pages/admin/EditProduct';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import NotFound from './pages/NotFound';

export default function App() {
  return <Routes><Route element={<Layout />}><Route path="/" element={<Home />} /><Route path="/products" element={<Products />} /><Route path="/products/:id" element={<ProductDetail />} /><Route path="/cart" element={<Cart />} /><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route element={<ProtectedRoute />}><Route path="/checkout" element={<Checkout />} /><Route path="/order-success/:id" element={<OrderSuccess />} /><Route path="/orders" element={<Orders />} /><Route path="/orders/:id" element={<SingleOrder />} /><Route path="/profile" element={<Profile />} /></Route><Route element={<AdminRoute />}><Route path="/admin" element={<Dashboard />} /><Route path="/admin/products" element={<AdminProducts />} /><Route path="/admin/products/create" element={<CreateProduct />} /><Route path="/admin/products/:id/edit" element={<EditProduct />} /><Route path="/admin/orders" element={<AdminOrders />} /><Route path="/admin/users" element={<AdminUsers />} /></Route><Route path="*" element={<NotFound />} /></Route></Routes>;
}
