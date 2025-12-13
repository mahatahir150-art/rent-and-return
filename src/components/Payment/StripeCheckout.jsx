import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY'); // Replace with your Key

const CheckoutForm = ({ onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);

        const card = elements.getElement(CardElement);

        if (card == null) {
            setProcessing(false);
            return;
        }

        // Use your card Element with other Stripe.js APIs
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) {
            console.log('[error]', error);
            setError(error.message);
            setProcessing(false);
        } else {
            console.log('[PaymentMethod]', paymentMethod);
            setError(null);
            setProcessing(false);
            if (onSuccess) onSuccess(paymentMethod);
            alert('Payment Successful (Demo Mode)');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Pay with Card</h3>
            <div className="mb-4 p-3 border border-gray-300 rounded-md">
                <CardElement options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    },
                }} />
            </div>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition duration-200 disabled:opacity-50"
            >
                {processing ? 'Processing...' : 'Pay Now'}
            </button>
        </form>
    );
};

const StripeCheckout = ({ onSuccess }) => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm onSuccess={onSuccess} />
        </Elements>
    );
};

export default StripeCheckout;
