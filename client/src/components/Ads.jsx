import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import ImageOne from '../images/sec-desktops.jpg';
import ImageTwo from '../images/sec-notebooks.jpg';

const Ads = () => {
    return (
        <section className="mb-8 lg:grid lg:grid-cols-2 lg:gap-x-3">
            <div className="relative w-[100%] h-[200px] lg:h-[250px] mb-3 lg:mb-0">
                <img 
                    src={ImageOne}
                    alt="" 
                    className="w-[100%] h-[100%] object-cover rounded-md brightness-[70%]"
                />
                <div className="absolute bottom-[70px] px-8">
                    <p className="font-bold text-[#3a86ff] mb-2">
                        DESKTOPS
                    </p>
                    <p className="text-white mb-4">
                        Build your PC at the best price!
                    </p>
                    <Link to='/shop'>
                        <motion.button 
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#3a86ff] text-white text-sm font-semibold px-4 py-2 rounded-md"
                        >
                            Show More
                        </motion.button>
                    </Link>
                </div>
            </div>
            <div className="relative w-[100%] h-[200px] lg:h-[250px]">
                <img 
                    src={ImageTwo}
                    alt="" 
                    className="w-[100%] h-[100%] object-cover rounded-md brightness-[70%]"
                />
                <div className="absolute bottom-[70px] px-8">
                    <p className="font-bold text-[#3a86ff] mb-2">
                        NOTEBOOKS
                    </p>
                    <p className="text-white mb-4">
                        Choose the ideal laptop for you!
                    </p>
                    <Link to='/shop'>
                        <motion.button 
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#3a86ff] text-white text-sm font-semibold px-4 py-2 rounded-md"
                        >
                            Show More
                        </motion.button>
                    </Link>
                </div>
            </div>
        </section>
    )
};

export default Ads;