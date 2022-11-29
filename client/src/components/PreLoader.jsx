import React from 'react';
import 'animate.css';

const PreLoader = () => {
    return (
        <section className="w-[100%] h-screen bg-black">
            <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
                <h1 className="text-white text-center text-[3rem] tracking-wider font-['Fuzzy_Bubbles']">
                    Empress
                </h1>
                <p className="text-white text-center text-[1.5rem]">
                    Your trusted partner.
                </p>
            </div>
        </section>
    )
};

export default PreLoader;