import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BiShow, BiHide } from 'react-icons/bi'
import { Helmet } from 'react-helmet-async';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

import { Context } from '../context/_context';

const Login = () => {

    const navigate = useNavigate();

    const { search } = useLocation();
    const redirectUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectUrl ? redirectUrl : '/';

    /** User Context */
    const { state, dispatch: authDispatch } = useContext(Context);
    const { userInfo } = state;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    /** Signup Form */
    const signupFormHandler = async (e) => {
        e.preventDefault();

        if (name === "") {
            toast.error("Name is required")
        } else if (email === "") {
            toast.error("Email is required")
        } else if (!email.includes("@")) {
            toast.warning("Includes @ in your email")
        } else if (password === "") {
            toast.error("Password is required")
        } else if (password.length < 6) {
            toast.error("Password must be 6 char")
        }

        setIsLoading(true);
        try {
            const { data } = await axios.post(
                'https://empress-api.onrender.com/server/auth/signup', {
                    name, email, password
                }
            );

            authDispatch({
                type: "REQUEST_LOGIN",
                payload: data
            });

            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect || '/');
        } catch (error) {
            toast.error('Email already exists');
        }
    };

    /** if user login redirect to current page */
    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [userInfo, navigate, redirect]);
    
    return (
        <>
            <section className="px-6 py-6 mb-10 md:mb-0 md:px-[15%] 2xl:px-[20%]">
                <ToastContainer position="bottom-center" limit={1} />
                <Helmet>
                    <title>Signup</title>
                </Helmet>
                <header className="font-semibold text-lg text-center mb-4">
                    Sign Up
                </header>
                <hr className="mb-4" />
                <div className="px-6 py-6 md:w-[450px] md:mx-auto">
                    <form onSubmit={signupFormHandler}>
                        <div className="mb-4">
                            <label className="block mb-2">
                                Name
                            </label>
                            <input 
                                type="text"
                                name="name"
                                value={name}
                                required
                                placeholder="Please enter your name"
                                onChange={(e) => setName(e.target.value)}
                                className="w-[100%] px-4 py-2 rounded-md border text-sm placeholder:text-sm focus:outline-none"
                                />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">
                                Email
                            </label>
                            <input 
                                type="email"
                                name="email"
                                value={email}
                                required
                                placeholder="Please enter your email"
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-[100%] px-4 py-2 rounded-md border text-sm placeholder:text-sm focus:outline-none"
                            />
                        </div>
                        <div className="mb-8">
                            <label className="block mb-2">
                                Password
                            </label>
                            <div className="flex items-center justify-between w-[100%] px-4 py-2 rounded-md border">
                                <input 
                                    type={!showPassword ? "password" : "text"}
                                    name="password"
                                    value={password}
                                    required
                                    placeholder="Please enter your password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-[100%] text-sm placeholder:text-sm focus:outline-none"
                                />
                                <div onClick={() => setShowPassword(!showPassword)}>
                                    {
                                        !showPassword ? (
                                            <BiHide size={23} color="#6c757d" />
                                        ) : (
                                            <BiShow size={23} color="#6c757d" />
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <button 
                            type="submit"
                            className="w-[100%] px-4 py-1 mb-4 text-sm font-semibold rounded-md border hover:bg-[#3a86ff] hover:text-white transition-all duration-150"
                        >
                            {isLoading ? "Loading..." : "Sign Up"}
                        </button>
                        <div className="flex items-center gap-x-2">
                            <p className="text-sm">
                                Already have an account?
                            </p>
                            <Link to={`/login?redirect=${redirect}`}>
                                <p className="text-sm underline text-[#3a86ff]">
                                    Login
                                </p>
                            </Link>
                        </div>
                    </form>
                </div>
            </section>
        </>
    )
};

export default Login;