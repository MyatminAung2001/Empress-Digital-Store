import React, { useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import axios from 'axios';

import { ItemReducer } from '../context/ItemReducer';
import ItemsList from '../components/ItemsList';
import Ads from '../components/Ads';
import Brand from '../components/Brand';
import Loading from '../components/Loading';
import Featured from '../components/Featured';

const Item = () => {
    
    const [{ loading, error, items }, dispatch] = useReducer(ItemReducer, {
        items: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchingItems = async () => {
            try {
                dispatch({
                    type: 'REQUEST_FETCHING'
                });

                const res = await axios.get(
                    'https://empress-api.onrender.com/server/items'
                );
                
                dispatch({
                    type: 'SUCCESS_FETCHING',
                    payload: res.data
                })
            } catch (error) {
                dispatch({
                    type: 'FAIL_FETCHING',
                    payload: error.res && error.res.data.message 
                        ? error.res.data.message 
                        : error.message
                })
            }
        }
        fetchingItems();
    }, []);

    return (
        <section className="px-6 py-6 md:px-[15%] 2xl:px-[20%]">
            <Helmet>
                <title>Empress</title>
            </Helmet>
            <Featured />
            <Ads />
            <header className="font-semibold text-lg text-center mb-4">
                New Arrivals
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
                    <div className="grid grid-cols-1 gap-y-3 md:grid-cols-2 md:gap-3 lg:grid-cols-4 lg:gap-3">
                        {
                            items.slice(items.length - 8).reverse().map((item) => (
                                <ItemsList items={item} />
                            ))
                        }
                    </div>
                )
            }
            <Link to='/shop'>
                <motion.p 
                    whileTap={{ scale: 0.95 }}
                    className="w-[100px] text-center mx-auto px-4 py-1 mt-5 border rounded-md bg-[#3a86ff] text-white"
                    >
                    View All
                </motion.p>
            </Link>
            <Brand />
        </section>
    )
};

export default Item;