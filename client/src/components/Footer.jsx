import React from 'react';
import { MdOutlineEmail, MdOutlinePhone, MdOutlineLocationOn } from 'react-icons/md';
import { FaTwitter, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
        <section className="pt-12 pb-8 px-6 md:px-[15%] 2xl:px-[20%] bg-[#0F2027]">
            <div className="mb-10 lg:grid lg:grid-cols-3">
                <div className="mb-8 lg:col-span-1">
                    <header className="text-white text-xl font-semibold mb-2">
                        Empress
                    </header>
                    <ul className="">
                        <li className="flex items-center gap-x-1 mb-1 text-[#adb5bd] hover:text-white transition-all duration-150 cursor-pointer">
                            <MdOutlineEmail size={20} />
                            <p className="">
                                empress@gmail.com
                            </p>
                        </li>
                        <li className="flex items-center gap-x-1 mb-1 text-[#adb5bd] hover:text-white transition-all duration-150 cursor-pointer">
                            <MdOutlinePhone size={20} />
                            <p className="">
                                +95-9123-456-789
                            </p>
                        </li>
                        <li className="flex items-center gap-x-1 mb-1 text-[#adb5bd] hover:text-white transition-all duration-150 cursor-pointer">
                            <MdOutlineLocationOn size={20} />
                            <p className="">
                                Yangon, Myanmar
                            </p>
                        </li>
                    </ul>
                </div>
                <div className="mb-8 lg:col-span-1">
                    <header className="text-white text-xl font-semibold mb-2">
                        Customer Service
                    </header>
                    <ul className="">
                        <li className="text-[#adb5bd] text-sm mb-1 hover:text-white transition-all duration-150 cursor-pointer">
                            Terms & Conditions
                        </li>
                        <li className="text-[#adb5bd] text-sm mb-1 hover:text-white transition-all duration-150 cursor-pointer">
                            Contact Us
                        </li>
                        <li className="text-[#adb5bd] text-sm mb-1 hover:text-white transition-all duration-150 cursor-pointer">
                            About Us
                        </li>
                        <li className="text-[#adb5bd] text-sm mb-1 hover:text-white transition-all duration-150 cursor-pointer">
                            Services
                        </li>
                    </ul>
                </div>
                <div className="lg:col-span-1">
                    <header className="text-white text-xl font-semibold mb-2">
                        Subscribe
                    </header>
                    <div className="mb-2">
                        <p className="text-[#adb5bd] text-sm mb-1 cursor-pointer">
                            Subscribe to receive updates on our store and special offers
                        </p>
                        <input 
                            type="email" 
                            placeholder="Your email address"
                            className="w-[100%] bg-[#2f313a] text-white rounded-md py-2 px-3 text-sm focus:outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-x-2">
                        <FaTwitter size={45} className="bg-[#2f313a] text-white px-1 py-3 rounded-[50px] cursor-pointer" />
                        <FaFacebook size={45} className="bg-[#2f313a] text-white px-1 py-3 rounded-[50px] cursor-pointer" />
                        <FaInstagram size={45} className="bg-[#2f313a] text-white px-1 py-3 rounded-[50px] cursor-pointer" />
                        <FaYoutube size={45} className="bg-[#2f313a] text-white px-1 py-3 rounded-[50px] cursor-pointer" />
                    </div>
                </div>
            </div>
            <p className="text-center text-sm text-[#adb5bd]">
                © 2022 MERN Ecommerce. All rights reserved
            </p>
        </section>
    )
};

export default Footer;