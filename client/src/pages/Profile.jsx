import React, { useContext, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import { Context } from '../context/_context';
import { UpdateProfileReducer } from '../context/ProfileUpdateReducer';

const Profile = () => {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { state, dispatch: updateDispatch } = useContext(Context);
    const { userInfo } = state;

    const [{ loading }, dispatch] = useReducer(UpdateProfileReducer, {
        loading: false
    })

    const updateProfileHandler = async (e) => {
        e.preventDefault();

        try {
            dispatch({ type: "REQUEST_UPDATE_PROFILE" });

            const { data } = await axios.put(
                'https://empress-api.onrender.com/server/user/profile', { name, email, password }, {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                }
            );

            updateDispatch({
                type: "REQUEST_LOGIN",
                payload: data
            });

            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Successfully Updated');
            navigate('/');
        } catch (error) {
            dispatch({ type: "FAIL_UPDATE_PROFILE" });
            toast.error(error.message);
        }
    };

    return (
        <section className="px-6 py-6 md:px-[15%] 2xl:px-[20%]">
            <ToastContainer position="bottom-center" limit={1} />
            <Helmet>
                <title>Login</title>
            </Helmet>
            <header className="font-semibold text-lg text-center mb-4">
                Account Info
            </header>
            <hr className="mb-4" />
            <div className="px-6 py-6 md:w-[450px] md:mx-auto">
                <form onSubmit={updateProfileHandler}>
                    <div className="mb-4">
                        <label className="block mb-2">
                            Name
                        </label>
                        <input 
                            type="text"
                            name="name"
                            value={name}
                            required
                            placeholder={userInfo.name}
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
                            placeholder={userInfo.email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-[100%] px-4 py-2 rounded-md border text-sm placeholder:text-sm focus:outline-none"
                        />
                    </div>
                    <div className="mb-8">
                        <label className="block mb-2">
                            Password
                        </label>
                        <input 
                            type="password" 
                            name="password"
                            value={password}
                            required
                            placeholder="Please enter your update password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-[100%] px-4 py-2 rounded-md border text-sm placeholder:text-sm focus:outline-none"
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-[100%] px-4 py-1 mb-4 text-sm font-semibold rounded-md border hover:bg-[#4361ee] hover:text-white transition-all duration-150"
                    >
                        Save Changes
                    </button>
                </form>
                {
                    loading && (
                        <p className="text-sm font-semibold text-center">
                            Loading...
                        </p>
                    )
                }
            </div>
        </section>
    )
};

export default Profile;