import React, { useEffect, useReducer, useContext, useRef, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import axios from 'axios';

import { Context } from '../context/_context';
import { ItemDetailReducer } from '../context/itemDetail-reducer';
import Rating from '../components/Rating';
import Loading from '../components/Loading';

const ItemDetail = () => {

    let reviewsRef = useRef();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const navigate = useNavigate();

    /** Item Details */
    const location = useLocation();
    const itemId = location.pathname.split("/")[2];

    /** Item Detail Reducer */
    const [{ loading, error, item, loadingReview }, dispatch] = useReducer(ItemDetailReducer, {
        loading: true,
        item: [],
        error: null
    });

    /** Fetch Item Details */
    useEffect(() => {
        const fetchingDetails = async () => {
            try {
                dispatch({
                    type: 'REQUEST_FETCHING'
                });

                const res = await axios.get(
                    `https://empress-api.onrender.com/server/items/item/` + itemId
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
        fetchingDetails();
    }, [itemId]);

    /** Cart Context */
    const { state, dispatch: cartDispatch } = useContext(Context);
    const { cart, userInfo } = state;

    /** Add to cart */
    const addToCartHandler = async () => {
        try {
            const existingItem = cart.cartItems.find((x) => x._id === item._id);
            const quantity = existingItem ? existingItem.quantity + 1 : 1; 
            const { data } = await axios.get(
                `https://empress-api.onrender.com/server/items/item/${item._id}`
            );

            if (data.inStock < quantity) {
                window.alert('Out Of Stock');
                return;
            };
            
            cartDispatch({
                type: "ADD_TO_CART",
                payload: {
                    ...item,
                    quantity
                }
            })
            navigate('/cart');
        } catch (error) {
            console.log(error);
        }
    };

    /** Review */
    const reviewSubmitHandler = async (e) => {
        e.preventDefault();
        if (!comment || !rating) {
            toast.error('Please enter comment and rating');
        };

        try {
            dispatch({ type: "REQUEST_REVIEW" });

            const { data } = await axios.post(
                `https://empress-api.onrender.com/server/items/${item._id}/reviews`, 
                { rating, comment, name: userInfo.name }, 
                { headers: { authorization: `Bearer ${userInfo.token}` } }
            );
            
            dispatch({ type: "SUCCESS_REVIEW" });
            toast.success("Review Submitted");

            item.reviews.unshift(data.review);
            item.numberOfReviews = data.numberOfReviews;
            item.rating = data.rating;
                
            dispatch({ 
                type: "REFRESH_ITEM",
                payload: item
            });

            window.scrollTo({
                behavior: 'smooth',
                top: reviewsRef.current.offsetTop
            })
        } catch (error) {
            dispatch({ type: "FAIL_REVIEW" });
            toast.error(error.message);
        }
    };

    return (
        <section className="px-6 py-6 md:px-[15%] 2xl:px-[20%]">
            <Helmet>
                <title>{item.name}</title>
            </Helmet>
            {
                loading ? (
                    <Loading />
                ) : error ? (
                        <p className="text-sm font-semibold text-center text-[#ef233c]">
                            {error}
                        </p>
                ) : ( 
                    <>
                        <div className=" mb-5 lg:grid lg:grid-cols-4 lg:gap-x-5">
                            <div className="shadow-CustomShadow py-6 rounded-md mb-5 lg:h-[55%] lg:mb-0 lg:col-span-2">
                                <img 
                                    src={item.image} 
                                    alt={item.name}
                                    className="w-[60%] lg:h-[100%] mx-auto"
                                />
                            </div>
                            <div className="flex flex-col gap-y-1 shadow-CustomShadow rounded-md py-4 px-4 lg:col-span-2">
                                <header className="text-lg font-[600]">
                                    {item.name}
                                </header>
                                <p>
                                    <span className="font-[600]">
                                        Brand: {" "}     
                                    </span> 
                                    {item.brand}
                                </p>
                                <p>
                                    <span className="font-[600]">
                                        Model: {" "}
                                    </span> 
                                    {item.modelName}
                                </p>
                                <p>
                                    <span className="font-[600]">
                                        Operating System: {" "}
                                    </span> 
                                    {item.operatingSystem}
                                </p>
                                <p>
                                    <span className="font-[600]">
                                        Graphic Card: {" "}
                                    </span> 
                                    {item.graphicCard}
                                </p>
                                <p>
                                <span className="font-[600]">
                                        Description: {" "}
                                    </span> 
                                    {item.description}
                                </p>
                                <p>
                                    <span className="font-[600]">
                                        $: {" "}
                                    </span> 
                                    {item.price}
                                </p>
                                <div className="flex gap-x-3 mb-2">
                                    <p className="font-[600]">
                                        Stock: {" "}  
                                    </p>
                                    {
                                        item.inStock > 0 ? (
                                            <p className="text-xs px-3 py-1 bg-[#80ed99] rounded-md">
                                                In Stock
                                            </p>
                                        ) : (
                                            <p className="text-white text-xs px-3 py-1 bg-[#ef233c] rounded-md">
                                                Out of Stock
                                            </p>
                                        )
                                    }
                                </div>
                                <Rating rating={item.rating} numberOfReviews={item.numberOfReviews} />
                                <hr className="my-3" />
                                {
                                    item.inStock > 0 ? (
                                        <motion.button 
                                            onClick={addToCartHandler}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-[100%] bg-white text-sm py-1 font-semibold rounded-md border hover:bg-[#3a86ff] hover:text-white transition-all duration-150"
                                        >
                                            Add To Cart
                                        </motion.button>
                                    ) : (
                                        <button disabled className="w-[100%] text-[#ef233c] font-semibold text-sm py-1 rounded-md border">
                                            Unavailable
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                        <div className="lg:grid lg:grid-cols-2 lg:gap-x-3">
                            <div className="shadow-CustomShadow rounded-md py-4 px-4 mb-5 h-[330px] overflow-y-scroll lg:mb-0 lg:col-span-1">
                                <p ref={reviewsRef} className="font-semibold underline text-lg mb-2">
                                    Reviews
                                </p>
                                {
                                    item.reviews.length === 0 && (
                                        <p className="">
                                            No reviews on this item.
                                        </p>
                                    )
                                }
                                <div>
                                    {
                                        item.reviews.map((review) => (
                                            <div key={review._id} className="border px-4 py-2 mb-2 rounded-md">
                                                <p>
                                                    {review.createdAt.substring(0, 10)}
                                                </p>
                                                <p className="font-semibold">
                                                    {review.name}
                                                </p>
                                                <Rating rating={review.rating} caption=" " />
                                                <p>
                                                    {review.comment}
                                                </p>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="shadow-CustomShadow rounded-md py-4 px-4 lg:col-span-1">
                                {
                                    userInfo ? (
                                        <form onSubmit={reviewSubmitHandler}>
                                            <p className="font-semibold mb-2">
                                                Write A Review
                                            </p>
                                            <div className="mb-3">
                                                <select
                                                    value={rating}
                                                    onChange={(e) => setRating(e.target.value)}
                                                    className="border px-2 py-1 focus:outline-none rounded-md"
                                                >
                                                    <option value="">Rating</option>
                                                    <option value="1">1- Poor</option>
                                                    <option value="2">2- Fair</option>
                                                    <option value="3">3- Good</option>
                                                    <option value="4">4- Very good</option>
                                                    <option value="5">5- Excelent</option>
                                                </select>
                                            </div>
                                            <div className="mb-3">
                                                <label className="block mb-2 font-[500]">
                                                    Comment
                                                </label>
                                                <textarea
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    placeholder="Feedback"
                                                    className="border px-3 py-1 w-[100%] h-[130px] rounded focus:outline-none"
                                                >

                                                </textarea>
                                            </div>
                                            <button 
                                                type="submit"
                                                className="border rounded-md px-4 py-2 font-semibold text-sm hover:bg-[#3a86ff] hover:text-white duration-150 transition-all"
                                            >
                                                Comment
                                            </button>
                                            {
                                                loadingReview && (
                                                    <p className="text-center font-semibold text-sm">
                                                        Loading...
                                                    </p>
                                                )
                                            }
                                        </form> 
                                    ) : (
                                        <div className="w-[100%] flex items-center justify-center gap-x-1 lg:mt-5">
                                            <p className="text-sm">
                                                Please Login to post a review
                                            </p>
                                            <Link to={`/login`}>
                                                <span className="font-semibold text-sm text-[#3a86ff] underline">
                                                    login
                                                </span>
                                            </Link>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </>
                )
            }
        </section>
    )
};

export default ItemDetail;