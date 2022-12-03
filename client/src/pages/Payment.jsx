import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { Context } from '../context/_context';
import Stepper from '../components/Stepper';

const Payment = () => {

    const navigate = useNavigate();
    
    /** Delivery Context */
    const { state, dispatch: paymentDispatch } = useContext(Context);
    const { cart: { deliveryAddress, paymentMethod } } = state;

    const [paymentName, setPaymentName] = useState(paymentMethod || '');

    /** if address is not filled */
    useEffect(() => {
        if (!deliveryAddress.address) {
            navigate('/delivery')
        }
    }, [deliveryAddress, navigate]);

    /** Payment Form */
    const paymentFormHandler = (e) => {
        e.preventDefault();
        
        paymentDispatch({
            type: "SAVE_PAYMENT_METHOD",
            payload: paymentName
        });

        localStorage.setItem('paymentMethod', paymentName);
        navigate('/order');
    };

    return (
        <section className="px-6 py-6 md:px-[15%] 2xl:px-[20%]">
            <Helmet>
                <title>Payment</title>
            </Helmet>
            <Stepper LoginStep DeliveryStep PaymentStep />
            <hr className="mb-4" />
            <header className="font-semibold text-lg text-center mb-4">
                Select Payment
            </header>
            <div className="md:w-[450px] md:mx-auto">
                <form onSubmit={paymentFormHandler}>
                    <div className="flex items-center gap-x-2 mb-4">
                        <input 
                            type="checkbox"
                            id="Paypal"
                            value="Paypal"
                            checked={paymentName === 'Paypal'}
                            onChange={(e) => setPaymentName(e.target.value)}
                        />
                        <label>
                            PayPal
                        </label>
                    </div>
                    <div className="flex items-center gap-x-2 mb-4">
                        <input 
                            type="checkbox"
                            id="Stripe"
                            value="Stripe"
                            checked={paymentName === 'Stripe'}
                            onChange={(e) => setPaymentName(e.target.value)}
                        />
                        <label>
                            Stripe
                        </label>
                    </div>
                    <button 
                        type="submit"
                        className="w-[100%] px-4 py-1 mb-4 text-sm font-semibold rounded-md border hover:bg-[#3a86ff] hover:text-white transition-all duration-150"
                    >
                        Continue
                    </button>
                </form>
            </div>
        </section>
    )
};

export default Payment;