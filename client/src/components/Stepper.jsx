import React from 'react';

const Stepper = ({ LoginStep, DeliveryStep, PaymentStep, OrderStep}) => {

    const activeCss = "font-semibold text-[#3a86ff]";

    return (
        <div className="flex justify-between mb-4">
            <div className={LoginStep ? activeCss : "font-semibold"}>Login</div>
            <div className={DeliveryStep ? activeCss : "font-semibold"}>Delivery</div>
            <div className={PaymentStep ? activeCss : "font-semibold"}>Payment</div>
            <div className={OrderStep ? activeCss : "font-semibold"}>Order</div>
        </div>
    )
};

export default Stepper;