import React, { useContext, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

import { Context } from '../context/_context';
import { OrderHistoryReducer } from '../context/orderHistory-reducer';
import Loading from '../components/Loading';

const OrderHistory = () => {

    const { state } = useContext(Context);
    const { userInfo } = state;

    const navigate = useNavigate();

    const [{ loading, error, orders }, dispatch] = useReducer(OrderHistoryReducer, {
        loading: true,
        error: '',
    });

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                dispatch({ type: "REQUEST_ORDER_HISTORY" });

                const { data } = await axios.get(
                    `https://empress-api.onrender.com/server/orders/client`, {
                        headers: { authorization: `Bearer ${userInfo.token}` }
                    }
                );

                dispatch({
                    type: "SUCCESS_ORDER_HISTORY",
                    payload: data
                });
            } catch (error) {
                dispatch({
                    type: "FAIL_ORDER_HISTORY",
                    payload: error.res && error.res.data.message 
                        ? error.res.data.message 
                        : error.message
                })
            }
        };
        fetchOrderHistory();
    }, [userInfo])

    return (
        <section className="px-6 py-6 md:px-[15%] 2xl:px-[20%]">
            <Helmet>
                <title>Order History</title>
            </Helmet>
            <header className="font-semibold text-lg text-center mb-4">
                Order History
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
                                    <th>Total</th>
                                    <th>Date</th>
                                    <th>Paid</th>
                                    <th>Delivered</th>
                                    <th>Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    orders.map((order) => (
                                        <tr 
                                            key={order._id}
                                            className="border hover:bg-[#eaf4f4] transition-all duration-150"
                                        >
                                            <td className="px-4 py-3">
                                                {order._id}
                                            </td>
                                            <td>
                                                {order.createdAt.substring(0, 10)}
                                            </td>
                                            <td>
                                                {order.totalPrice.toFixed(2)}
                                            </td>
                                            <td>
                                                {order.isPaid ? 'Paid' : 'NOT'}
                                            </td>
                                            <td>
                                                {order.isDelivered ? order.deliveredAt.substring(0, 10) : 'NOT'}
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    onClick={() => {navigate(`/order/${order._id}`)}}    
                                                    className=""
                                                >
                                                    Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table> 
                    </div>
                )
            }  
        </section>
    )
};

export default OrderHistory;