import React, { useState, useEffect, useReducer } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { MdOutlineCancel } from 'react-icons/md';
import axios from 'axios';

import { ItemSearchReducer } from '../context/itemSearch-reducer';
import { prices } from '../utils/data';
import { ratings } from '../utils/data';
import Rating from '../components/Rating';
import ItemsList from '../components/ItemsList';
import Loading from '../components/Loading';

const Shop = () => {

    const navigate = useNavigate();

    /** search?category=laptops */
    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);

    const category = searchParams.get('category') || 'all';
    const query = searchParams.get('query') || 'all';
    const price = searchParams.get('price') || 'all';
    const rating = searchParams.get('rating') || 'all';
    const order = searchParams.get('order') || 'newest';
    const page  = searchParams.get('page') || 1;

    /** Item Search Reducer */
    const [{ loading, error, items, pages, countItems }, dispatch] = useReducer(ItemSearchReducer, {
        loading: true,
        error: ''
    });

    /** Fetch Search Item */
    useEffect(() => {
        const fetchSearchItem = async () => {
            try {
                dispatch({ type: "FETCH_SEARCH_ITEM" })

                const { data } = await axios.get(
                    `https://empress-api.onrender.com/server/items/shop?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
                );

                dispatch({
                    type: "SUCCESS_SEARCH_ITEM",
                    payload: data
                })
            } catch (error) {
                dispatch({
                    type: "FAIL_SEARCH_ITEM",
                    payload: error.res && error.res.data.message 
                        ? error.res.data.message 
                        : error.message
                })
            }
        };
        fetchSearchItem();
    }, [query, price, rating, category, page, order, error]);

    /** Categories */
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(
                    'https://empress-api.onrender.com/server/items/categories'
                );
                setCategories(data);
            } catch (error) {
                toast.error(error.message);
            }
        };
        fetchCategories();
    }, []);

    /** Filter Url */
    const filteringURL = (filter) => {
        const filterPage = filter.page || page;
        const filterCategory = filter.category || category;
        const filterQuery = filter.query || query;
        const filterPrice = filter.price || price;
        const filterRating = filter.rating || rating;
        const sortOrder = filter.order || order;

        return `/shop?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
    };

    return (
        <section className="px-6 py-6 lg:mb-16 md:px-[15%] 2xl:px-[20%] lg:grid lg:grid-cols-4 lg:gap-x-3">
            <Helmet>
                <title>Search Items</title>
            </Helmet>
            <div className="lg:col-span-1">
                <div className="shadow-CustomShadow rounded-md px-3 py-4 mb-4">
                    <header className="font-semibold text-lg mb-2 underline">
                        Categories
                    </header>
                    <ul className="flex flex-wrap items-center justify-between lg:flex-col lg:items-start">
                        <Link to={filteringURL({ category: 'all' })}>
                            <li className="mb-1 font-[500]">
                                All
                            </li>
                        </Link>
                        {
                            categories.map((c) => (
                                <Link to={filteringURL({ category: c })}>
                                    <li 
                                        key={c}
                                        className={c === category ? "font-[500] mb-1 text-[#3a86ff]" : "font-[500] mb-1"}
                                    >
                                        {c}
                                    </li>
                                </Link>
                            ))
                        }
                    </ul>
                </div>
                {/* <hr /> */}
                <div className="shadow-CustomShadow rounded-md px-3 py-4 mb-4">
                    <header className="font-semibold text-lg mb-2 underline">
                        Price
                    </header>
                    <ul className="flex flex-wrap items-center justify-between lg:flex-col lg:items-start">
                        <Link to={filteringURL({ price: 'all' })}>
                            <li className="mb-1 font-[500]">
                                All
                            </li>
                        </Link>
                        {
                            prices.map((p) => (
                                <Link to={filteringURL({ price: p.value })}>
                                    <li 
                                        key={p.value}
                                        className={p.value === price ? "font-[500] mb-1 text-[#3a86ff]" : "font-[500] mb-1"}
                                    >
                                        {p.name}
                                    </li>
                                </Link>
                            ))
                        }
                    </ul>
                </div>
                {/* <hr /> */}
                <div className="shadow-CustomShadow rounded-md px-3 py-4 mb-4">
                    <header className="font-semibold text-lg mb-2 underline">
                        Customer Rating
                    </header>
                    <ul>
                        {
                            ratings.map((rating) => (
                                <Link to={filteringURL({ rating: rating.rating })}> 
                                    <li key={rating.name}>
                                        <Rating caption={'Up'} rating={rating.rating} />
                                    </li>
                                </Link>
                            ))
                        }
                        <Link to={filteringURL({ rating: 'all' })}>
                            <li>
                                <Rating caption={'Up'} rating={0} />
                            </li>
                        </Link>
                    </ul>
                </div>
            </div>
            <div className="w-[100%] lg:col-span-3">
                <div className="mb-5 lg:mb-3 lg:px-4 lg:py-2 lg:bg-white lg:rounded-md lg:shadow-CustomShadow lg:flex lg:justify-between lg:items-center">
                    <div className="px-3 py-4 mb-3 bg-white rounded-md shadow-CustomShadow flex items-center lg:p-0 lg:m-0 lg:bg-none lg:rounded-none lg:shadow-none">
                        <p className="">
                            {countItems === 0 ? 'No' : countItems} Results
                        </p>
                        {query !== 'all' && ' : ' + query}
                        {category !== 'all' && ' : ' + category}
                        {price !== 'all' && ' : Price ' + price}
                        {rating !== 'all' && ' : Rating ' + rating + ' & up'}
                        { 
                            query !== 'all' || category !== 'all' || rating !== 'all' || price !== 'all' ? (
                                <button 
                                    onClick={() => navigate('/shop')}
                                    className="ml-3 bg-white rounded-md shadow-CustomShadow px-2 py-1"
                                >
                                    <MdOutlineCancel size={20} />
                                </button>
                            ) : (
                                null
                            )
                        }
                    </div>
                    <div className="px-3 py-4 bg-white rounded-md shadow-CustomShadow lg:p-0 lg:bg-none lg:rounded-none lg:shadow-none lg:flex lg:items-center">
                        <p className="text-center mb-1 lg:mb-0 lg:mr-3">
                            Sort by
                        </p>
                        <select 
                            value={order}
                            onChange={(e) => {navigate(filteringURL({ order: e.target.value }))}}
                            className="w-[100%] lg:w-auto border px-2 py-1 rounded-md focus:outline-none"
                        >
                            <option value="newest">New Arrivals</option>
                            <option value="lowest">Price: Low to High</option>
                            <option value="highest">Price: High to Low</option>
                            <option value="toprated">Customer Rating</option>
                        </select>
                    </div>
                </div>
                {
                    loading ? (
                        <Loading />
                    ) : error ? (
                        <p className="text-sm font-semibold text-center text-[#ef233c]"> 
                            {error}
                        </p>
                    ) : (
                        <div className="xl:relative xl:h-[550px]">
                            {
                                items.length === 0 && (
                                    <p className="font-semibold text-center">
                                        No Product Found!
                                    </p>
                                )
                            }
                            <div className="mb-5 grid lg:grid-cols-3 gap-3">
                                {
                                    items.map((item) => (
                                        <ItemsList items={item} key={item._id} />
                                        
                                    ))
                                }
                            </div>
                            <div className="flex items-center gap-x-3 lg:absolute lg:bottom-[-50px]">
                                {[...Array(pages).keys()].map((x) => (
                                    <Link 
                                        key={x + 1}
                                        to={filteringURL({ page: x + 1 })}
                                    >
                                        <button 
                                            className={Number(page) === x + 1 ? "w-[30px] px-2 py-1 font-semibold rounded-md text-white bg-[#3a86ff] shadow-CustomShadow" : "w-[30px] px-2 py-1 shadow-CustomShadow rounded-md"}
                                        >
                                            {x + 1}
                                        </button>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )
                }
            </div>
        </section>
    )
};

export default Shop;