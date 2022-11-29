import React, { useContext, useEffect, useReducer } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaTrashAlt, FaRegEdit } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import { ItemListReducer } from '../context/ItemListReducer';
import { Context } from '../context/_context';
import Loading from '../components/Loading';

const AdminItemList = () => {

    const navigate = useNavigate();

    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);

    const page = searchParams.get('page') || 1;

    const [{ loading, error, itemList, pages, loadingCreate, loadingDelete, successDelete }, dispatch] = useReducer(ItemListReducer, {
        loading: true,
        error: ''
    });

    const { state } = useContext(Context);
    const { userInfo } = state;

    useEffect(() => {
        const fetchItemList = async () => {
            try {
                dispatch({ type: "REQUEST_ITEM_LIST" });

                const { data } = await axios.get(
                    `https://empress-api.onrender.com/server/items/admin?page=${page}`, {
                        headers: { authorization: `Bearer ${userInfo.token}` }
                    }
                );

                dispatch({
                    type: "SUCCESS_ITEM_LIST",
                    payload: data
                })
            } catch (error) {
                dispatch({
                    type: "FAIL_ITEM_LIST",
                    payload: error.res && error.res.data.message 
                        ? error.res.data.message 
                        : error.message
                })
            }
        };
        if (successDelete) {
            dispatch({ type: "RESET_DELETE_ITEM" })
        } else {
            fetchItemList();
        }
    }, [userInfo, page, successDelete]);

    // Post New Item
    const createNewItemHandler = async () => {
        try {
            dispatch({ type: "REQUEST_CREATE_ITEM" });

            const { data } = await axios.post(
                'https://empress-api.onrender.com/server/items/create', {}, {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                }
            );

            toast.success('Success');
            dispatch({ type: "SUCCESS_CREATE_ITEM" });
            navigate(`/itemslist/${data.item._id}`);
        } catch (error) {
            toast.error(error.message);
            dispatch({ type: "FAIL_CREATE_ITEM" });
        }
    };

    // Delete Item
    const deleteItemHandler = async (item) => {
        try {
            dispatch({ type: "REQUEST_DELETE_ITEM" });

            await axios.delete(
                `https://empress-api.onrender.com/server/items/item/${item._id}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                }
            );

            dispatch({ type: "SUCCESS_DELETE_ITEM" });
            toast.success('Successfully Deleted');
        } catch (error) {
            dispatch({ type: "FAIL_DELETE_ITEM" });
            toast.error(error.message);
        }
    };

    return (
        <section className="px-6 py-6 md:px-[15%] 2xl:px-[20%]">
            <ToastContainer position="bottom-center" limit={1} />
            <Helmet>
                <title>Item Lists</title>
            </Helmet>
            <div className="mb-4 flex items-center justify-between">
                <header className="font-semibold text-lg">
                    Items List
                </header>
                <button 
                    type="button"
                    onClick={createNewItemHandler}
                    className="px-4 py-1 font-semibold text-[#4361ee] border border-[#4361ee] rounded-md hover:bg-[#4361ee] hover:text-white transition-all duration-150"
                >
                    New Item
                </button>
            </div>
            <hr className="mb-4" />
            {
                loadingCreate && (
                    <p className="text-center font-semibold text-sm mb-3">
                        Loading...
                    </p>
                )
            }
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
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Category</th>
                                    <th>Brand</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    itemList.map((item) => (
                                        <tr 
                                            key={item._id}
                                            className="border hover:bg-[#eaf4f4] transition-all duration-150"
                                        > 
                                            <td className="px-4 py-3">
                                                {item._id}
                                            </td>
                                            <td>
                                                {item.name}
                                            </td>
                                            <td>
                                                ${item.price}
                                            </td>
                                            <td>
                                                {item.category}
                                            </td>
                                            <td>
                                                {item.brand}
                                            </td>
                                            <td className="">
                                                <button 
                                                    type="button"
                                                    onClick={() => navigate(`/itemslist/${item._id}`)}
                                                    className="px-3"
                                                >
                                                    <FaRegEdit size={17} color="#4361ee" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => deleteItemHandler(item)}    
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
                                <p className="text-center text-sm font-semibold">
                                    Loading...
                                </p>
                            )
                        }
                        <div className="flex items-center gap-x-3 absolute bottom-[10px] left-1">
                            {[...Array(pages).keys()].map((x) => (
                                <Link 
                                    key={x + 1}
                                    to={`/itemslist?page=${ x + 1 }`}
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

export default AdminItemList;