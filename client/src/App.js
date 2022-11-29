import React, { lazy, Suspense, useState, useRef, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import 'animate.css';

import './App.css';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import PreLoader from './components/PreLoader';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ItemDetail = lazy(() => import('./pages/ItemDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Delivery = lazy(() => import('./pages/Delivery'));
const Payment = lazy(() => import('./pages/Payment'));
const Order = lazy(() => import('./pages/Order'));
const Shop = lazy(() => import('./pages/Shop'));
const Invoice = lazy(() => import('./pages/Invoice'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminItemList = lazy(() => import('./pages/AdminItemList'));
const AdminItemEdit = lazy(() => import('./pages/AdminItemEdit'));
const AdminOrderList = lazy(() => import('./pages/AdminOrderList'));
const AdminUserList = lazy(() => import('./pages/AdminUserList'));

const App = () => {

    const [preloader, setPreloader] = useState(true);
    const [timer, setTimer] = useState(2);

    const id = useRef(null);

    const clear = () => {
        window.clearInterval(id.current);
        setPreloader(false);
    };

    useEffect(() => {
        id.current = window.setInterval(() => {
            setTimer((timer) => timer - 1)
        }, 1000)
    }, []);

    useEffect(() => {
        if (timer === 0) {
            clear();
        }
    }, [timer]);

    return (
        <>
            {
                preloader ? (
                    <PreLoader />
                ) : (
                    <div className="flex flex-col justify-between h-screen animate__animated animate__fadeIn animate__slow">
                        <Router>
                            <Suspense fallback={
                                <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
                                    <Box sx={{ display: 'flex' }}>
                                        <CircularProgress />
                                    </Box>
                                </div>
                            }>
                                <main>
                                    <Navigation /> 
                                    <Routes>
                                        <Route path='/' element={<Home />} />
                                        <Route path='login' element={<Login />} />
                                        <Route path='signup' element={<Signup />} />
                                        <Route path='/item/:id' element={<ItemDetail />} />
                                        <Route path='/cart' element={<Cart />} />
                                        <Route path='/delivery' element={<Delivery />} />
                                        <Route path='/payment' element={<Payment />} />
                                        <Route path='/order' element={<Order />} />
                                        <Route path='/shop' element={<Shop />} />
                                        <Route path='/order/:id' element={
                                            <ProtectedRoute>
                                                <Invoice />
                                            </ProtectedRoute>
                                        } />
                                        <Route path='/orderhistory' element={
                                            <ProtectedRoute>
                                                <OrderHistory />
                                            </ProtectedRoute>
                                        } />
                                        <Route path='/profile' element={
                                            <ProtectedRoute>
                                                <Profile />
                                            </ProtectedRoute>
                                        } />
                                        {/* Admin */}
                                        <Route path='/admindashboard' element={
                                            <AdminRoute>
                                                <AdminDashboard />
                                            </AdminRoute>
                                        } />
                                        <Route path='/itemslist' element={
                                            <AdminRoute>
                                                <AdminItemList />
                                            </AdminRoute>
                                        } />
                                        <Route path='/itemslist/:id' element={
                                            <AdminRoute>
                                                <AdminItemEdit />
                                            </AdminRoute>
                                        } />
                                        <Route path='/orderslist' element={
                                            <AdminRoute>
                                                <AdminOrderList />
                                            </AdminRoute>
                                        } />
                                        <Route path='/userslist' element={
                                            <AdminRoute>
                                                <AdminUserList />
                                            </AdminRoute>
                                        } />
                                    </Routes>
                                </main>
                                <div>
                                    <Footer />
                                </div>
                            </Suspense> 
                        </Router>
                    </div>
                )
            }
        </>
    )
};

export default App;