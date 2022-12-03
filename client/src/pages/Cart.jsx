import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaTrashAlt } from 'react-icons/fa';

import EmptyCart from '../images/empty_cart.svg';
import { Context } from '../context/_context';

const Cart = () => {

    const navigate = useNavigate();

    /** Cart Context */
    const { state, dispatch: cartDispatch } = useContext(Context);
    const { cart: { cartItems } } = state;

    /** Increase & Decrease Cart Items */
    const cartItemHandler = async (item, quantity) => {
        try {
            const { data } = await axios.get(
                `https://empress-api.onrender.com/server/items/item/${item._id}`
            )

            if (data.inStock < quantity) {
                window.alert('Out of Stock')
            };

            cartDispatch({
                type: "ADD_TO_CART",
                payload: {
                    ...item,
                    quantity
                }
            })
        } catch (error) {
            console.log(error);
        }
    };

    /** Remove Cart Item */ 
    const removeCartItemHandler = (item) => {
        cartDispatch({
            type: "REMOVE_FROM_CART",
            payload: item
        })
    };

    /** Checkout */
    const checkoutHandler = () => {
        navigate('/login?redirect=/delivery')
    };

    return (
        <section className="px-6 py-6 md:px-[15%] 2xl:px-[20%]">
            <Helmet>
                <title>Cart</title>
            </Helmet>
            <header className="font-semibold text-lg text-center mb-4">
                Shopping Cart
            </header>
            <hr className="mb-4" />
            <div>
                {
                    cartItems.length === 0 ? (
                        <div>
                            <img 
                                src={EmptyCart}
                                alt="" 
                                className="mb-8 md:w-[36%] md:mx-auto"
                            />
                            <div className="md:flex md::items-center md:justify-center md:gap-x-1">
                                <p className="font-semibold">
                                    Cart is Empty!
                                </p>
                                <Link to='/shop'>
                                    <p className="text-sm font-semibold text-[#3a86ff]">
                                        Click here to go shopping
                                    </p>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="lg:grid lg:grid-cols-5 lg:gap-x-5">
                            <div className="shadow-CustomShadow px-3 py-6 rounded-md flex flex-col gap-y-1 lg:col-span-3 mb-5 lg:mb-0">
                                {
                                    cartItems.map((item) => (
                                        <>
                                            <div 
                                                key={item._id}
                                                className="flex items-center gap-x-5 mb-3"
                                            >
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name} 
                                                    className="w-[50%] lg:w-[30%]"
                                                />
                                                <div className="w-[100%] flex flex-col gap-y-2">
                                                    <Link to={`/item/${item._id}`}>
                                                        <header className="font-semibold">
                                                            {item.name}
                                                        </header>
                                                    </Link>
                                                    <hr className="mb-2" />
                                                    <div className="flex items-center justify-between mb-3">
                                                        <motion.button 
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => cartItemHandler(item, item.quantity + 1)}
                                                            disabled={item.quantity === item.inStock}
                                                            className="border px-4 rounded-lg font-semibold hover:border-[#3a86ff] hover:bg-[#3a86ff] hover:text-white transition-all duration-150"
                                                        >
                                                            +
                                                        </motion.button>
                                                        <span className="">
                                                            {item.quantity}
                                                        </span>
                                                        <motion.button 
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => cartItemHandler(item, item.quantity - 1)}
                                                            disabled={item.quantity === 1}
                                                            className="border px-4 rounded-lg font-semibold hover:border-[#3a86ff] hover:bg-[#3a86ff] hover:text-white transition-all duration-150"
                                                        >
                                                            -
                                                        </motion.button>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <p className="font-semibold">
                                                            $: {item.price}
                                                        </p>
                                                        <button 
                                                            onClick={() => removeCartItemHandler(item)}
                                                        >
                                                            <FaTrashAlt size={20} color="#ef233c" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr />
                                        </>
                                    ))
                                }
                            </div>
                            <div className="shadow-CustomShadow px-3 pt-3 pb-6 mb-2 rounded-md lg:h-[180px] lg:col-span-2">
                                <div className="flex justify-between mb-2">
                                    <p className="font-semibold">
                                        Total Items:    
                                    </p> 
                                    <p className="font-semibold">
                                        {cartItems.reduce((accu, curItem) => accu + curItem.quantity, 0)}
                                    </p>
                                </div>
                                <div className="flex justify-between mb-4">
                                    <p className="font-semibold">
                                        Total Payment:    
                                    </p> 
                                    <p className="font-semibold">
                                        $ {cartItems.reduce((accu, curItem) => accu + curItem.price * curItem.quantity, 0)}
                                    </p>
                                </div>
                                <hr className="mb-4" />
                                <button 
                                    onClick={checkoutHandler}
                                    className="w-[100%] border py-1 font-semibold text-sm rounded-md hover:bg-[#3a86ff] hover:text-white transition-all duration-150"
                                >
                                    Confirm Checkout
                                </button>
                            </div>
                        </div>
                    )
                }
            </div>
        </section>
    )
};

export default Cart;