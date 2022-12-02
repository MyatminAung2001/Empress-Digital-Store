import React, { useEffect, useReducer, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import axios from 'axios';

import { Context } from '../context/_context';
import { InvoiceReducer } from '../context/invoice-reducer';
import Loading from '../components/Loading';

const Invoice = () => {

    const { state } = useContext(Context);
    const { userInfo } = state;

    const navigate = useNavigate();

    const params = useParams();
    const { id: orderId } = params;

    const [{ loading, error, order, loadingPayment, successPayment, loadingDelivery, successDelivery }, dispatch] = useReducer(InvoiceReducer, {
        loading: true,
        order: {},
        error: false,
        loadingPayment: false,
        successPayment: false
    });

    // Paypal
    const [{ pending }, paypalDispatch] = usePayPalScriptReducer();

    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [{
                amount: { value: order.totalPrice }
            }]
        })
        .then((orderId) => {
            return orderId
        })
    };

    const onApprove = (data, actions) => {
        return actions.order.capture().then(async function (details) {
            try {
                dispatch({ type: "REQUEST_PAYMENT" });

                const { data } = await axios.put(
                    `https://empress-api.onrender.com/server/orders/${orderId}/pay`, details, {
                        headers: { authorization: `Bearer ${userInfo.token}` }
                    }
                );

                dispatch({
                    type: "SUCCESS_PAYMENT",
                    payload: data
                });

                toast.success('Successfully Paid');
            } catch (error) {
                dispatch({
                    type: "FAIL_PAYMENT",
                    payload: error.res && error.res.data.message 
                        ? error.res.data.message 
                        : error.message
                });

                toast.error(error.message);
            }
        })
    };

    const onError = (error) => {
        toast.error(error.message)
    };

    // Fetch Order Details
    useEffect(() => {
        const fetchingInvoice = async () => {
            try {
                dispatch({ type: "REQUEST_INVOICE" });

                const { data } = await axios.get(
                    `https://empress-api.onrender.com/server/orders/${orderId}`, {
                        headers: { authorization: `Bearer ${userInfo.token}` }
                    }
                );

                dispatch({
                    type: "SUCCESS_INVOICE",
                    payload: data
                })
            } catch (error) {
                dispatch({
                    type: "FAIL_INVOICE",
                    payload: error.message
                })
            }
        }

        if (!userInfo) {
            navigate('/login');
        };

        if (!order._id || successPayment || successDelivery || (order._id && order._id !== orderId)) {
            fetchingInvoice();

            if (successPayment) {
                dispatch({ type: "RESET_PAYMENT" });
            };

            if (successDelivery) {
                dispatch({ type: "RESET_DELIVERY" });
            };
        } else {
            // Paypal
            const loadingPaypal = async () => {
                const { data: clientId } = await axios.get(
                    'https://empress-api.onrender.com/server/keys/paypal', {
                        headers: { authorization: `Bearer ${userInfo.token}` }
                    }
                );

                paypalDispatch({
                    type: "resetOptions",
                    value: {
                        'client-id': clientId,
                        currency: 'USD'
                    }
                });
                paypalDispatch({
                    type: "setLoadingStatus",
                    value: "pending"
                })
            };

            loadingPaypal();
        }
    }, [navigate, order, orderId, userInfo, paypalDispatch, successPayment, successDelivery]);

    // Deliver Order
    const deliverHandler = async () => {
        try {
            dispatch({ type: "REQUEST_DELIVERY" });

            const { data } = await axios.put(
                `https://empress-api.onrender.com/server/orders/${order._id}/delivery`, {} , {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                }
            );

            dispatch({
                type: "SUCCESS_DELIVERY",
                payload: data
            });
            toast.success('Success Delivery');
        } catch (error) {   
            dispatch({ type: "FAIL_DELIVERY" });
            toast.error(error.message)
        }
    };

    return (
        <section className="px-6 py-6 md:px-[15%] 2xl:px-[20%]">
            {
                loading ? (
                    <Loading />
                ) : error ? (
                    <p className="text-sm font-semibold text-center text-[#ef233c]">
                        {error}
                    </p>
                ) : (
                    <div>
                        <Helmet>
                            <title>Invoice {orderId}</title>
                        </Helmet>
                        <header className="font-semibold text-lg text-center mb-4">
                            Invoice Number: {orderId}
                        </header>
                        <hr className="mb-4" />
                        <div className="lg:grid lg:grid-cols-5 lg:gap-x-5">
                            <div className="lg:col-span-3">
                                <div className="px-3 py-3 mb-3 rounded-md shadow-CustomShadow">
                                    <header className="text-lg underline font-semibold mb-2">
                                        Delivery
                                    </header>
                                    <p className="mb-1">
                                        <span className="font-[600]">
                                            Name: {" "}     
                                        </span> 
                                        {order.deliveryAddress.fullName}
                                    </p>
                                    <p className="mb-2">
                                        <span className="font-[600]">
                                            Address: {" "}     
                                        </span> 
                                        {order.deliveryAddress.address}
                                    </p>
                                    {
                                        order.isDelivered ? (
                                            <p className="font-semibold rounded-md text-[#57cc99]">
                                                Delivered At {order.deliveredAt}
                                            </p>
                                        ) : (
                                            <p className="font-semibold rounded-md text-[#e63946]">
                                                Not Delivered
                                            </p>
                                        )
                                    }
                                </div>
                                <div className="px-3 py-3 mb-3 rounded-md shadow-CustomShadow">
                                    <header className="text-lg underline font-semibold mb-2">
                                        Payment
                                    </header>
                                    <p className="mb-3">
                                        <span className="font-[600]">
                                            CashDown: {" "}     
                                        </span> 
                                        {order.paymentMethod}
                                    </p>
                                    {
                                        order.isPaid ? (
                                            <p className="font-semibold rounded-md text-[#57cc99]">
                                                Paid {order.paidAt}
                                            </p>
                                        ) : (
                                            <p className="font-semibold rounded-md text-[#e63946]">
                                                Not Paid
                                            </p>
                                        )
                                    } 
                                </div>
                                <div className="px-3 py-3 mb-3 rounded-md shadow-CustomShadow">
                                    <header className="text-lg underline font-semibold mb-2">
                                        Items
                                    </header>
                                    <div className="mb-1">
                                        {
                                            order.orderItems.map((item) => (
                                                <div className="flex items-center gap-x-2 lg:gap-x-[5rem]">
                                                    <img 
                                                        src={item.image} 
                                                        alt={item.name}
                                                        className="w-[45%] lg:w-[30%]" 
                                                    />
                                                    <div>
                                                        <p className="font-[600]">
                                                            {item.name}
                                                        </p>
                                                        <p className="mb-1">
                                                            <span className="font-[600]">
                                                                Total: {" "}     
                                                            </span> 
                                                            ( {item.quantity} ) 
                                                        </p>
                                                        <p className="mb-1">
                                                            <span className="font-[600]">
                                                                $: {" "}     
                                                            </span> 
                                                            {item.price}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-2">
                                <div className="px-3 pt-3 pb-8 mb-2 shadow-CustomShadow rounded-md lg:col-span-2">
                                    <header className="text-lg underline font-semibold mb-2">
                                        Order
                                    </header>
                                    <p className="mb-1 flex justify-between items-center font-[500]">
                                        <span className="font-[600]">
                                            Items Price: {" "}     
                                        </span> 
                                        ${order.itemsPrice.toFixed(2)}
                                    </p>
                                    <p className="mb-1 flex justify-between items-center font-[500]">
                                        <span className="font-[600]">
                                            Delivery Fee: {" "}     
                                        </span> 
                                        ${order.deliveryPrice}
                                    </p>
                                    <p className="mb-2 flex justify-between items-center font-[500]">
                                        <span className="font-[600]">
                                            Tax Fee: {" "}    
                                        </span> 
                                        ${order.taxPrice}
                                    </p>
                                    <hr className="mb-2" />
                                    <p className="mb-4 flex justify-between items-center font-[500]">
                                        <span className="font-[600]">
                                            Total Payment: {" "}     
                                        </span> 
                                        ${order.totalPrice.toFixed(2)}
                                    </p>
                                    <div>
                                        {
                                            !order.isPaid && (
                                                <div>
                                                    {
                                                        pending ? (
                                                            <p className="text-sm font-semibold text-center">
                                                                Loading...
                                                            </p>
                                                        ) : (
                                                            <div>
                                                                <PayPalButtons 
                                                                    createOrder={createOrder}
                                                                    onApprove={onApprove}
                                                                    onError={onError}
                                                                />
                                                            </div>
                                                        )
                                                    }
                                                    { 
                                                        loadingPayment &&  (
                                                            <p className="text-sm font-semibold text-center">
                                                                Loading...
                                                            </p>
                                                        )
                                                    }
                                                </div>
                                            ) 
                                        }
                                        {
                                            userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                                <motion.div whileTap={{ scale: 0.95 }}>
                                                    {
                                                        loadingDelivery && (
                                                            <p className="text-sm font-semibold text-center">
                                                                Loading...
                                                            </p>
                                                        )
                                                    }
                                                    <button 
                                                        type="button"
                                                        onClick={deliverHandler}
                                                        className="w-[100%] border px-6 py-1 font-semibold text-sm rounded-md hover:bg-[#3a86ff] hover:text-white transition-all duration-150"
                                                        >
                                                        Deliver Order
                                                    </button>
                                                </motion.div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </section>
    )
};

export default Invoice;