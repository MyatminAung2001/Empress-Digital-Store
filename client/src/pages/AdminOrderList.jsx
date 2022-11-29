import React, { useContext, useEffect, useReducer } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrashAlt, FaRegEdit } from 'react-icons/fa';
import axios from 'axios';

import { Context } from '../context/_context';
import { OrderListReducer } from '../context/OrderListReducer';
import Loading from '../components/Loading';

const AdminOrderList = () => {

    const navigate = useNavigate();

    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);

    const page = searchParams.get('page') || 1;

    const { state } = useContext(Context);
    const { userInfo } = state;

    const [{ loading, error, ordersList, pages, loadingDelete, successDelete }, dispatch] = useReducer(OrderListReducer, {
        loading: true,
        error: ''
    });

    useEffect(() => {
        const fetchOrderList = async () => {
            try {
                dispatch({ type: "REQUEST_ORDER_LIST" });

                const { data } = await axios.get(
                    `https://empress-api.onrender.com/server/orders/admin?page=${page}`, {
                        headers: { authorization: `Bearer ${userInfo.token}` }
                    }
                );

                dispatch({
                    type: "SUCCESS_ORDER_LIST",
                    payload: data
                });
            } catch (error) {
                dispatch({
                    type: "FAIL_ORDER_LIST",
                    payload: error.res && error.res.data.message 
                        ? error.res.data.message 
                        : error.message
                })
            }
        }
        if (successDelete) {
            dispatch({ type: "RESET_DELETE" })
        } else {
            fetchOrderList();
        }
    }, [userInfo, page, successDelete]);

    // Order Delete
    const deleteOrderHandler = async (order) => {
        try {
            dispatch({ type: "REQUEST_DELETE_ORDER" });

            await axios.delete(
                `https://empress-api.onrender.com/server/orders/order/${order._id}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                }
            );

            dispatch({ type: "SUCCESS_DELETE_ORDER" });
            toast.success('Successfully Deleted');
        } catch (error) {
            dispatch({ type: "FAIL_DELETE_ORDER" });
            toast.error(error.message)
        }
    };

    return (
        <section className="px-6 py-6 md:px-[15%] 2xl:px-[20%]">
            <ToastContainer position="bottom-center" limit={1} />
            <Helmet>
                <title>Orders List</title>            
            </Helmet>
            <header className="font-semibold text-left text-lg mb-4">
                Orders List
            </header>
            <hr className="mb-4" />
            {
                loading ? (
                    <Loading />
                ) : error ? (
                    <p className="text-sm font-semibold text-center text-[#ef233c]">
                        {error}
                    </p>
                ) : (
                    <div className="overflow-x-scroll scrollbar-none lg:overflow-hidden relative h-[550px]">
                        <table className="w-[800px] lg:mb-10 lg:w-[100%] border border-collapse border-spacing-2.5 table-auto">
                            <thead className="text-left">
                                <tr className="border">
                                    <th className="px-4 py-2">
                                        ID
                                    </th>
                                    <th>User</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Paid</th>
                                    <th>Deliver</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    ordersList.map((order) => (
                                        <tr 
                                            key={order._id}
                                            className="border hover:bg-[#eaf4f4] transition-all duration-150"
                                        >
                                            <td className="px-4 py-3">
                                                {order._id}
                                            </td>
                                            <td>
                                                {order.user ? order.user.name : 'DELETE USER'}
                                            </td>
                                            <td>
                                                {order.createdAt.substring(0, 10)}
                                            </td>
                                            <td>
                                                ${order.totalPrice.toFixed(2)}
                                            </td>
                                            <td>
                                                {order.isPaid ? 'Paid' : 'NOT'}
                                            </td>
                                            <td>
                                                {order.isDelivered ? order.deliveredAt.substring(0, 10) : 'NOT'}
                                            </td>
                                            <td className="">
                                                <button 
                                                    type="button"
                                                    onClick={() => navigate(`/order/${order._id}`)}
                                                    className=""
                                                >
                                                    <FaRegEdit size={17} color="#4361ee" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => deleteOrderHandler(order)}    
                                                    className="px-3"
                                                >
                                                    <FaTrashAlt size={17} color="#ef233c" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {
                            loadingDelete && (
                                <p className="text-sm font-semibold text-center">
                                    Loading...
                                </p>
                            )
                        }
                        <div className="flex items-center gap-x-3 absolute bottom-[10px] left-1">
                            {[...Array(pages).keys()].map((x) => (
                                <Link 
                                    key={x + 1}
                                    to={`/orderslist?page=${ x + 1 }`}
                                >
                                    <button 
                                        className={Number(page) === x + 1 ? "w-[30px] px-2 py-1 font-semibold rounded-md text-white bg-[#4361ee] shadow-CustomShadow" : "w-[30px] px-2 py-1 shadow-CustomShadow rounded-md"}
                                    >
                                        {x + 1}
                                    </button>
                                </Link>
                            ))}
                        </div>
                    </div>
                )
            }
        </section>
    )
};

export default AdminOrderList;