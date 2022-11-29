import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { MdOutlineMenu, MdOutlineHistory, MdOutlineAdminPanelSettings, MdOutlineVerifiedUser, MdOutlineBorderColor, MdOutlineProductionQuantityLimits } from 'react-icons/md';
import { FiUser, FiSettings, FiLogOut, FiLogIn, FiShoppingCart } from 'react-icons/fi';
import axios from 'axios';

import { Context } from '../context/_context';
import SearchInput from './SearchInput';

const Navigation = () => {
    
    const navigate = useNavigate();

    const { state, dispatch: authDispatch } = useContext(Context);
    const { cart, userInfo } = state;

    const [modal, setModal] = useState(false);
    const [sidebar, setSidebar] = useState(false);
    const [categories, setCategories] = useState([]);
    
    const modalClickHandler = () => {
        setModal(!modal);
    };

    const logoutHandler = () => {
        authDispatch({
            type: "LOGOUT"
        });
        localStorage.removeItem('userInfo');
        localStorage.removeItem('cart');
        localStorage.removeItem('address');
        localStorage.removeItem('paymentMethod');
        navigate('/')
    };

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

    return (
        <nav className="px-6 py-3 md:px-[15%] 2xl:px-[20%] border-b">
            {/* Mobile Nav */}
            <div className="md:hidden">
                <Link to='/'>
                    <header className="text-xl font-[600] text-center mb-3">
                        Empress    
                    </header>
                </Link>    
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-x-2">
                        <MdOutlineMenu 
                            size={20} 
                            onClick={() => setSidebar(true)}
                            className="cursor-pointer"
                        />
                        {
                            sidebar && (
                                <>
                                    <div onClick={() => setSidebar(false)} className="fixed left-0 top-0 w-[100%] h-[100%]"></div>
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 3 }}
                                        exit={{ opacity: 1, y: 3 }}
                                        className="absolute z-10 bg-white rounded-md shadow-CustomShadow left-6 top-[85px] px-4 py-3"
                                    >
                                        <p className="w-[100%] gap-x-3 text-white bg-[#415a77] px-4 py-1 rounded-md mb-3">
                                            Categories    
                                        </p>
                                        <hr className="mb-2" />
                                        {
                                            categories.map((category) => (
                                                <Link to={`/shop?category=${category}`}>
                                                    <div 
                                                        key={category}
                                                        className="px-2 py-1 rounded-md hover:bg-[#e9ecef] transition-all duration-150 cursor-pointer"
                                                    >
                                                        <p className="font-light">
                                                            {category}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))
                                        }
                                    </motion.div>
                                </>
                            )
                        }
                        <Link to='/shop'>
                            <p className="">
                                Shop
                            </p>
                        </Link>
                    </div>
                    <div className="flex items-center gap-x-5">
                        <div className="relative">
                            <Link to='/cart'>
                                <FiShoppingCart size={22} />
                                {
                                    cart.cartItems.length > 0 && (
                                        <div className="absolute top-[-11px] right-[-13px] z-30 text-white text-xs bg-[#03045e] px-2 py-[1px] rounded-md">
                                            {cart.cartItems.reduce((accu, curItem) => accu + curItem.quantity, 0)}
                                        </div>
                                    )
                                }
                            </Link>
                        </div>
                        <div
                            className="font-[500] border px-2 py-1 rounded-md cursor-pointer"
                            onClick={modalClickHandler}
                        >
                            <FiUser size={20} />
                        </div>
                        {
                            userInfo ? (
                                <>
                                    {
                                        modal && (
                                            <>
                                                <div onClick={() => setModal(false)} className="fixed left-0 top-0 w-[100%] h-[100%]"></div>
                                                <motion.ul 
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 3 }}
                                                    exit={{ opacity: 1, y: 3 }}
                                                    className="absolute z-10 bg-white rounded-md shadow-CustomShadow right-6 top-[90px] px-4 py-2 w-[200px]"
                                                >
                                                    <li className="w-[100%] flex items-center gap-x-3 bg-[#415a77] px-2 py-1 rounded-md mb-3">
                                                        <FiUser size={18} color="#ffffff" />
                                                        <p className="text-white font-light">
                                                            {userInfo.name}
                                                        </p>
                                                    </li>
                                                    <Link to='/profile'>
                                                        <li className="w-[100%] flex items-center gap-x-3 px-2 py-1 rounded-md mb-3 hover:bg-[#e9ecef] transition-all duration-150 cursor-pointer">
                                                            <FiSettings size={20} />
                                                            <p className="font-light">
                                                                Account Info
                                                            </p>
                                                        </li>
                                                    </Link>
                                                    <Link to='/orderhistory'>
                                                        <li className="w-[100%] flex items-center gap-x-3 px-2 py-1 rounded-md mb-3 hover:bg-[#e9ecef] transition-all duration-150 cursor-pointer">
                                                            <MdOutlineHistory size={18} />
                                                            <p className="font-light">
                                                                Orders History
                                                            </p>
                                                        </li>
                                                    </Link>
                                                    <hr className="mb-3" />
                                                    <li 
                                                        onClick={logoutHandler}
                                                        className="w-[100%] flex items-center gap-x-3 px-2 py-1 rounded-md hover:bg-[#e9ecef] transition-all duration-150 cursor-pointer"
                                                    >
                                                        <FiLogOut size={18} />
                                                        <p className="font-light">
                                                            Logout
                                                        </p>
                                                    </li>
                                                </motion.ul>
                                            </>
                                        )
                                    }
                                </>
                            ) : (
                                <>
                                    {
                                        modal && (
                                            <>
                                                <div onClick={() => setModal(false)} className="fixed left-0 top-0 w-[100%] h-[100%]"></div>
                                                <motion.ul 
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 3 }}
                                                    exit={{ opacity: 1, y: 3 }}
                                                    className="absolute z-10 bg-white rounded-md shadow-CustomShadow right-6 top-[90px] px-4  py-2"
                                                >
                                                    <li className="w-[100%] flex items-center gap-x-3 bg-[#415a77] px-2 py-1 rounded-md mb-3">
                                                        <FiUser size={18} color="#ffffff" />
                                                        <p className="text-white font-light">
                                                            Username
                                                        </p>
                                                    </li>
                                                    <Link to='/login'>
                                                        <li className="w-[100%] flex items-center gap-x-3 px-2 py-1 rounded-md hover:bg-[#e9ecef] transition-all duration-150 cursor-pointer">
                                                            <FiLogIn size={18} />
                                                            <p className="font-light">
                                                                Login
                                                            </p>
                                                        </li>
                                                    </Link>
                                                </motion.ul>
                                            </>
                                        )
                                    }
                                </>
                            )
                        }
                        {/* Admin Modal */}
                        {
                            userInfo && userInfo.isAdmin && (
                                <>
                                    {
                                        modal && (
                                            <>
                                                <div onClick={() => setModal(false)} className="fixed left-0 top-0 w-[100%] h-[100%]"></div>
                                                <motion.ul 
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 3 }}
                                                    exit={{ opacity: 1, y: 3 }}
                                                    className="absolute z-10 bg-white rounded-md shadow-CustomShadow right-6 top-[90px] px-4 py-2 w-[200px]"
                                                >
                                                    <li className="w-[100%] flex items-center gap-x-3 bg-[#415a77] px-2 py-1 rounded-md mb-3">
                                                        <MdOutlineVerifiedUser size={18} color="#ffffff" />
                                                        <p className="text-white font-light">
                                                            Admin
                                                        </p>
                                                    </li>
                                                    <Link to='/admindashboard'>
                                                        <li className="w-[100%] mb-1 flex items-center gap-x-3 px-2 py-1 rounded-md hover:bg-[#e9ecef] transition-all duration-150 cursor-pointer">
                                                            <MdOutlineAdminPanelSettings size={18} />
                                                            <p className="font-light">
                                                                Dashboard
                                                            </p>
                                                        </li>
                                                    </Link>
                                                    <Link to='/itemslist'>
                                                        <li className="w-[100%] mb-1 flex items-center gap-x-3 px-2 py-1 rounded-md hover:bg-[#e9ecef] transition-all duration-150 cursor-pointer">
                                                            <MdOutlineProductionQuantityLimits size={18} />
                                                            <p className="font-light">
                                                                Items List
                                                            </p>
                                                        </li>
                                                    </Link>
                                                    <Link to='/userslist'>
                                                        <li className="w-[100%] mb-1 flex items-center gap-x-3 px-2 py-1 rounded-md hover:bg-[#e9ecef] transition-all duration-150 cursor-pointer">
                                                            <FiUser size={18} />
                                                            <p className="font-light">
                                                                Users List
                                                            </p>
                                                        </li>
                                                    </Link>
                                                    <Link to='/orderslist'>
                                                        <li className="w-[100%] mb-1 flex items-center gap-x-3 px-2 py-1 rounded-md hover:bg-[#e9ecef] transition-all duration-150 cursor-pointer">
                                                            <MdOutlineBorderColor size={18} />
                                                            <p className="font-light">
                                                                Orders List
                                                            </p>
                                                        </li>
                                                    </Link>
                                                    <hr className="my-3" />
                                                    <li 
                                                        onClick={logoutHandler}
                                                        className="w-[100%] mb-1 flex items-center gap-x-3 px-2 py-1 rounded-md hover:bg-[#e9ecef] transition-all duration-150 cursor-pointer"
                                                    >
                                                        <FiLogOut size={18} />
                                                        <p className="font-light">
                                                            Logout
                                                        </p>
                                                    </li>
                                                </motion.ul>
                                            </>
                                        )
                                    }
                                </>
                            )
                        }
                    </div>
                </div>
                <SearchInput />            
            </div>

            {/* Desktop & Laptop Nav */}
            <div className="hidden md:block">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-2">
                        <MdOutlineMenu 
                            size={20} 
                            onClick={() => setSidebar(true)}
                            className="cursor-pointer"
                        />
                        {
                            sidebar && (
                                <>
                                    <div onClick={() => setSidebar(false)} className="fixed left-0 top-0 w-[100%] h-[100%]"></div>
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 3 }}
                                        exit={{ opacity: 1, y: 3 }}
                                        className="absolute z-10 bg-white rounded-md shadow-CustomShadow left-[340px] top-[60px] px-6 py-3 md:left-[123px] xl:left-[203px] 2xl:left-[340px]"
                                    >
                                        <p className="w-[100%] gap-x-3 text-white bg-[#415a77] px-4 py-1 rounded-md mb-3">
                                            Categories    
                                        </p>
                                        <hr className="mb-2" />
                                        {
                                            categories.map((category) => (
                                                    <Link to={`/shop?category=${category}`}>
                                                        <div 
                                                            key={category}
                                                            className="px-2 py-1 rounded-md hover:bg-[#e9ecef] transition-all duration-150 cursor-pointer"
                                                        >   
                                                            <p>{category}</p>
                                                        </div>
                                                    </Link>
                                            ))
                                        }
                                    </motion.div>
                                </>
                            )
                        }
                        <Link to='/'>
                            <header className="text-xl font-[600] md:mr-3">
                                Empress    
                            </header>
                        </Link>    
                    </div>
                    <div className="flex items-center gap-x-5">
                        <SearchInput />
                        <div className="relative">
                            <Link to='/cart'>
                                <FiShoppingCart size={22} />
                                {
                                    cart.cartItems.length > 0 && (
                                        <div className="absolute top-[-11px] right-[-13px] z-30 text-white text-xs bg-[#03045e] px-2 py-[1px] rounded-md">
                                            {cart.cartItems.length}
                                        </div>
                                    )
                                }
                            </Link>
                        </div>
                        <Link to='/shop'>
                            <p className="">
                                Shop
                            </p>
                        </Link>
                        <p
                            className="font-[500] border px-3 py-1 rounded-md cursor-pointer"
                            onClick={modalClickHandler}
                        >
                            {
                                userInfo ? (
                                    <p className="md:w-[100px] text-center md:overflow-x-hidden md:text-ellipsis md:whitespace-nowrap lg:w-[100%]">
                                        {userInfo.name}
                                    </p>
                                ) : (
                                    <p>
                                        Username
                                    </p>
                                )
                            }
                        </p>
                        {
                            userInfo ? (
                                <>
                                    {
                                        modal && (
                                            <>
                                                <div onClick={() => setModal(false)} className="fixed left-0 top-0 w-[100%] h-[100%]"></div>
                                                <motion.ul 
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 7 }}
                                                    exit={{ opacity: 1, y: 7 }}
                                                    className="absolute z-10 bg-white rounded-md shadow-CustomShadow right-[340px] top-[55px] px-4 py-2 w-[200px] md:right-[123px] xl:right-[200px] 2xl:right-[340px]"
                                                >
                                                    <li className="w-[100%] flex items-center gap-x-3 bg-[#415a77] px-2 py-1 rounded-md mb-3">
                                                        <FiUser size={18} color="#ffffff" />
                                                        <p className="text-white font-light">
                                                            {userInfo.name}
                                                        </p>
                                                    </li>
                                                    <Link to='/profile'>
                                                        <li className="w-[100%] flex items-center gap-x-3 px-2 py-1 rounded-md mb-3 hover:bg-[#e9ecef] transition-all duration-150 cursor-pointer">
                                                            <FiSettings size={20} />
                                                            <p className="font-light">
                                                                Account Info
                                                            </p>
                                                        </li>
                                                    </Link>
                                                    <Link to='/orderhistory'>
                                                        <li className="w-[100%] flex items-center gap-x-3 px-2 py-1 rounded-md mb-3 hover:bg-[#e9ecef] transition-all duration-150 cursor-pointer">
                                                            <MdOutlineHistory size={18} />
                                                            <p className="font-light">
                                                                Orders History
                                                            </p>
                                                        </li>
                                                    </Link>
                                                    <hr className="mb-3" />
                                                    <li 
                                                        onClick={logoutHandler}
                                                        className="w-[100%] flex items-center gap-x-3 px-2 py-1 rounded-md hover:bg-[#e9ecef] transition-all duration-150 cursor-pointer"
                                                    >
                                                        <FiLogOut size={18} />
                                                        <p className="font-light">
                                                            Logout
                                                        </p>
                                                    </li>
                                                </motion.ul>
                                            </>
                                        )
                                    }
                                </>
                            ) : (
                                <>
                                    {
                                        modal && (
                                            <>
                                                <div onClick={() => setModal(false)} className="fixed left-0 top-0 w-[100%] h-[100%]"></div>
                                                <motion.ul 
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 7 }}
                                                    exit={{ opacity: 1, y: 7 }}
                                                    className="absolute z-10 bg-white rounded-md shadow-CustomShadow right-[340px] top-[55px] px-4 py-2 w-[200px] md:right-[123px] xl:right-[200px] 2xl:right-[340px]"
                                                >
                                                    <li className="w-[100%] flex items-center gap-x-3 bg-[#415a77] px-2 py-1 rounded-md mb-3">
                                                        <FiUser size={18} color="#ffffff" />
                                                        <p className="text-white font-light">
                                                            Username
                                                        </p>
                                                    </li>
                                                    <Link to='/login'>
                                                        <li className="w-[100%] flex items-center gap-x-3 px-2 py-1 rounded-md hover:bg-[#e9ecef] transition-all duration-150 cursor-pointer">
                                                            <FiLogIn size={18} />
                                                            <p className="font-light">
                                                                Login
                                                            </p>
                                                        </li>
                                                    </Link>
                                                </motion.ul>
                                            </>
                                        )
                                    }
                                </>
                            )
                        }
                        {/* Admin Modal */}
                        {
                            userInfo && userInfo.isAdmin && (
                                <>
                                    {
                                        modal && (
                                            <>
                                                <div onClick={() => setModal(false)} className="fixed left-0 top-0 w-[100%] h-[100%]"></div>
                                                <motion.ul 
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 7 }}
                                                    exit={{ opacity: 1, y: 7 }}
                                                    className="absolute z-10 bg-white rounded-md shadow-CustomShadow right-[340px] top-[55px] px-4 py-2 w-[200px] md:right-[123px] xl:right-[200px] 2xl:right-[340px]"
                                                >
                                                    <li className="w-[100%] flex items-center gap-x-3 bg-[#415a77] px-2 py-1 rounded-md mb-3">
                                                        <MdOutlineVerifiedUser size={18} color="#ffffff" />
                                                        <p className="text-white font-light">
                                                            Admin
                                                        </p>
                                                    </li>
                                                    <Link to='/admindashboard'>
                                                        <li className="w-[100%] mb-1 flex items-center gap-x-3 px-2 py-1 rounded-md hover:bg-[#e9ecef] transition-all duration-150 cursor-pointer">
                                                            <MdOutlineAdminPanelSettings size={18} />
                                                            <p className="font-light">
                                                                Dashboard
                                                            </p>
                                                        </li>
                                                    </Link>
                                                    <Link to='/itemslist'>
                                                        <li className="w-[100%] mb-1 flex items-center gap-x-3 px-2 py-1 rounded-md hover:bg-[#e9ecef] transition-all duration-150 cursor-pointer">
                                                            <MdOutlineProductionQuantityLimits size={18} />
                                                            <p className="font-light">
                                                                Items List
                                                            </p>
                                                        </li>
                                                    </Link>
                                                    <Link to='/userslist'>
                                                        <li className="w-[100%] mb-1 flex items-center gap-x-3 px-2 py-1 rounded-md hover:bg-[#e9ecef] transition-all duration-150 cursor-pointer">
                                                            <FiUser size={18} />
                                                            <p className="font-light">
                                                                Users List
                                                            </p>
                                                        </li>
                                                    </Link>
                                                    <Link to='/orderslist'>
                                                        <li className="w-[100%] mb-1 flex items-center gap-x-3 px-2 py-1 rounded-md hover:bg-[#e9ecef] transition-all duration-150 cursor-pointer">
                                                            <MdOutlineBorderColor size={18} />
                                                            <p className="font-light">
                                                                Orders List
                                                            </p>
                                                        </li>
                                                    </Link>
                                                    <hr className="my-3" />
                                                    <li 
                                                        onClick={logoutHandler}
                                                        className="w-[100%] mb-1 flex items-center gap-x-3 px-2 py-1 rounded-md hover:bg-[#e9ecef] transition-all duration-150 cursor-pointer"
                                                    >
                                                        <FiLogOut size={18} />
                                                        <p className="font-light">
                                                            Logout
                                                        </p>
                                                    </li>
                                                </motion.ul>
                                            </>
                                        )
                                    }
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </nav>
    )
};

export default Navigation;