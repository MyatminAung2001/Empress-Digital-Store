import React, { useContext, useReducer, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import axios from 'axios';

import { OrderReducer } from '../context/order-reducer';
import { Context } from '../context/_context';
import Stepper from '../components/Stepper';

const Order = () => {

    const navigate = useNavigate();

    const { state, dispatch: orderDispatch } = useContext(Context);
    const { cart, userInfo } = state;

    const [{ loading }, dispatch] = useReducer(OrderReducer, {
        loading: false,
    });

    // Price Handler
    const round = (num) => Math.round(num * 100 + Number.EPSILON) / 100  //123.456 => 123.45

    cart.itemsPrice =  round(
        cart.cartItems.reduce((accu, curItem) => accu + curItem.quantity * curItem.price, 0)
    );
    cart.deliveryPrice = cart.itemsPrice > 3000 ? round(0) : round(2.5);
    cart.taxPrice = round(0.002 * cart.itemsPrice)
    cart.totalPrice = cart.itemsPrice + cart.deliveryPrice + cart.taxPrice;

    const confirmOrderHandler = async () => {
        const orderData = {
            orderItems: cart.cartItems,
            deliveryAddress: cart.deliveryAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            deliveryPrice: cart.deliveryPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice
        }

        try {
            const { data } = await axios.post(
                'https://empress-api.onrender.com/server/orders/new/', orderData, {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                }
            );

            orderDispatch({
                type: "CLEAR_CART"
            });

            dispatch({
                type: "SUCCESS_ORDER"
            });

            localStorage.removeItem('cart');
            navigate(`/order/${data.order._id}`);
        } catch (error) {
            dispatch({
                type: "FAIL_ORDER"
            });
            toast.error(error.message);
        }   
    };

    useEffect(() => {
        if (!cart.paymentMethod) {
            navigate('/payment')
        }
    }, [cart, navigate])

    return (
        <section className="px-6 py-6 md:px-[15%] 2xl:px-[20%]">
            <Helmet>
                <title>Order</title>
            </Helmet>
            <Stepper LoginStep DeliveryStep PaymentStep OrderStep />
            <hr className="mb-4" />
            <div className="lg:grid lg:grid-cols-5 lg:gap-x-5">
                <div className="lg:col-span-3">
                    <div className="shadow-CustomShadow px-3 py-3 mb-2 rounded-md">
                        <header className="text-lg underline font-semibold mb-2">
                            Delivery
                        </header>
                        <p className="mb-1">
                            <span className="font-[600]">
                                Name: {" "}     
                            </span> 
                            {cart.deliveryAddress.fullName}
                        </p>
                        <p className="mb-3">
                            <span className="font-[600]">
                                Address: {" "}     
                            </span> 
                            {cart.deliveryAddress.address}
                        </p>
                        <Link to='/delivery'>
                            <p className="text-[#3a86ff] underline">
                                Edit
                            </p>
                        </Link>
                    </div>
                    <div className="shadow-CustomShadow px-3 py-3 mb-2 rounded-md">
                        <header className="text-lg underline font-semibold mb-2">
                            Payment
                        </header>
                        <p className="mb-3">
                            <span className="font-[600]">
                                CashDown: {" "}     
                            </span> 
                            {cart.paymentMethod}
                        </p>
                        <Link to='/payment'>
                            <p className="text-[#3a86ff] underline">
                                Edit
                            </p>
                        </Link>
                    </div>
                    <div className="shadow-CustomShadow px-3 py-3 mb-2 rounded-md">
                        <header className="text-lg underline font-semibold mb-2">
                            Items
                        </header>
                        <div className="mb-3">
                            {
                                cart.cartItems.map((item) => (
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
                                                {item.quantity}
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
                        <Link to='/cart'>
                            <p className="text-[#3a86ff] underline">
                                Edit
                            </p>
                        </Link>
                    </div>
                </div>
                <div className="shadow-CustomShadow px-3 pt-3 pb-6 mb-2 rounded-md lg:h-[250px] lg:col-span-2">
                    <header className="text-lg underline font-semibold mb-2">
                        Order
                    </header>
                    <p className="mb-1 flex justify-between items-center font-[500]">
                        <span className="font-[600]">
                            Items Price: {" "}     
                        </span> 
                        ${cart.itemsPrice.toFixed(2)}
                    </p>
                    <p className="mb-1 flex justify-between items-center font-[500]">
                        <span className="font-[600]">
                            Delivery Fee: {" "}     
                        </span> 
                        ${cart.deliveryPrice}
                    </p>
                    <p className="mb-2 flex justify-between items-center font-[500]">
                        <span className="font-[600]">
                            Tax Fee: {" "}    
                        </span> 
                        ${cart.taxPrice}
                    </p>
                    <hr className="mb-2" />
                    <p className="mb-4 flex justify-between items-center font-[500]">
                        <span className="font-[600]">
                            Total Price: {" "}     
                        </span> 
                        ${cart.totalPrice.toFixed(2)}
                    </p>
                    <button 
                        type="button"
                        onClick={confirmOrderHandler}
                        className="w-[100%] border py-1 font-semibold rounded-md hover:bg-[#3a86ff] hover:text-white transition-all duration-150"
                    >
                        Confirm Order
                    </button>
                    { 
                        loading && (
                            <p className="text-sm font-semibold text-center">
                                Loading...
                            </p> 
                        )
                    }
                </div>
            </div>
        </section>
    )
};

export default Order;