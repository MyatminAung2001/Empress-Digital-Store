import React, { useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

import { Context } from '../context/_context';

const ItemsList = ({ items }) => {

    const navigate = useNavigate();

    const { state, dispatch: cartDispatch } = useContext(Context);
    const { cart: { cartItems } } = state;

    const addToCartHandler = async (item) => {
        try {
            const existingItem = cartItems.find((x) => x._id === items._id);
            const quantity = existingItem ? existingItem.quantity + 1 : 1; 
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
            });
            navigate('/cart')
        } catch (error) {
            console.log(error);
        }
    };

    return ( 
        <div key={items._id} className="w-[100%] bg-white shadow-CustomShadow px-6 py-3 rounded-md">
            <Link to={`/item/${items._id}`}>
                <motion.img 
                    whileHover={{ scale: 1.1 }}
                    src={items.image}
                    alt={items.name}
                    className="w-[65%] lg:w-[80%] lg:h-[40%] mx-auto my-2"
                />
            </Link>
            <div className="flex flex-col items-center gap-y-1">
                <header className="text-lg font-[600] mb-1">
                    {items.name}
                </header>
                <p className="text-sm mb-1">
                    {items.brand}
                </p>
                
                <p className="font-[500] mb-1">
                    $ {items.price}
                </p>
                {
                    items.inStock ? (
                        <motion.div
                            whileTap={{ scale: 0.95 }}
                        >
                            <button
                                onClick={() => addToCartHandler(items)}
                                className="border font-semibold text-sm px-16 py-1 rounded-md hover:bg-[#3a86ff] hover:text-white transition-all duration-150"
                            >
                                Order
                            </button>
                        </motion.div>
                    ) : (
                        <button
                            disabled
                            className="w-[100%] border text-[#ef233c] font-semibold text-sm py-1 rounded-md"
                        >
                            Out Of Stock
                        </button>
                    )
                }
            </div>
        </div>
    )
};

export default ItemsList;