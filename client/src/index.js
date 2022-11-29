import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import App from "./App";
import { ContextProvider } from "./context/_context";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ContextProvider>
        <HelmetProvider>
            <PayPalScriptProvider deferLoading={true} >
                <App />
            </PayPalScriptProvider>
        </HelmetProvider>
    </ContextProvider>
);