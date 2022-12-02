import React, { useContext, useEffect, useReducer } from 'react'
import { useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';

import { Context } from '../context/_context';
import { UserListReducer } from '../context/userList-reducer';
import Loading from '../components/Loading';

const AdminUserList = () => {

    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);

    const page = searchParams.get('page') || 1;

    const { state } = useContext(Context);
    const { userInfo } = state;

    const [{ loading, error, usersList, pages, loadingDelete, successDelete }, dispatch] = useReducer(UserListReducer, {
        loading: true,
        error: ''
    });

    useEffect(() => {
        const fetchUserList = async () => {
            try {
                dispatch({ type: "REQUEST_USER_LIST" });
                const { data } = await axios.get(
                    `https://empress-api.onrender.com/server/user/userslist?page=${page}`, {
                        headers: { authorization: `Bearer ${userInfo.token}` }
                    }
                );

                dispatch({ 
                    type: "SUCCESS_USER_LIST",
                    payload: data
                });
            } catch (error) {
                dispatch({ 
                    type: "FAIL_USER_LIST",
                    payload: error.res && error.res.data.message 
                        ? error.res.data.message 
                        : error.message
                })
            }
        }

        if (successDelete) {
            dispatch({ type: "RESET_DELETE_USER" });
        } else {
            fetchUserList();
        }
    }, [userInfo, successDelete, page]);

    const deleteUserHandler = async (user) => {
        try {
            dispatch({ type: "REQUEST_DELETE_USER" });

            await axios.delete(
                `https://empress-api.onrender.com/server/user/userslist/${user._id}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                }
            );

            dispatch({ type: "SUCCESS_DELETE_USER" });
            toast.success('Successfully Deleted');
        } catch (error) {
            dispatch({ type: "FAIL_DELETE_USER" });
            toast.error(error.message);
        }
    };

    return (
        <section className="px-6 py-6 md:px-[15%] 2xl:px-[20%]">
            <Helmet>
                <title>Users List</title>
            </Helmet>
            <header className="font-semibold text-left text-lg mb-4">
                Users List
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
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    usersList.map((user) => (
                                        <tr 
                                            key={user._id}
                                            className="border hover:bg-[#eaf4f4] transition-all duration-150"
                                        >
                                            <td className="px-4 py-3">
                                                {user._id}
                                            </td>
                                            <td>
                                                {user.name}
                                            </td>
                                            <td>
                                                {user.email}
                                            </td>
                                            <td>
                                                {user.isAdmin ? 'Admin' : 'User'}
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    disabled={user.idAdmin === true}
                                                    onClick={() => deleteUserHandler(user)}    
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
                                    to={`/userslist?page=${ x + 1 }`}
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

export default AdminUserList;