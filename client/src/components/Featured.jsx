import React from 'react';

import Delivery from '../images/shipping.png';
import Secure from '../images/secure.png';
import Support from '../images/support.png';

const Featured = () => {
    return (
        <section className="mb-8 md:grid md:grid-cols-3 md:gap-x-3">
            <div className="flex items-center justify-center gap-x-2 shadow-CustomShadow px-4 py-3 mb-3 rounded-md md:mb-0">
                <img 
                    src={Delivery} 
                    alt="" 
                    className=""
                />
                <div>
                    <p className="font-semibold">
                        Free Delivery
                    </p>
                    <p className="text-sm text-[#2f313a]">
                        Over $3000
                    </p>
                </div>
            </div>
            <div className="flex items-center justify-center gap-x-2 shadow-CustomShadow px-4 py-3 mb-3 rounded-md md:mb-0">
                <img 
                    src={Secure} 
                    alt="" 
                    className="w-[15%]"
                />
                <div>
                    <p className="font-semibold">
                        Secure Payment
                    </p>
                    <p className="text-sm text-[#2f313a]">
                        Paypal & Credit
                    </p>
                </div>
            </div>
            <div className="flex items-center justify-center gap-x-2 shadow-CustomShadow px-4 py-3 mb-3 rounded-md md:mb-0">
                <img 
                    src={Support} 
                    alt="" 
                    className="w-[15%]"
                />
                <div>
                    <p className="font-semibold">
                        Online Support
                    </p>
                    <p className="text-sm text-[#2f313a]">
                        Support 24/7
                    </p>
                </div>
            </div>     
        </section>
    )
};

export default Featured