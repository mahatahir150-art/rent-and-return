import React from 'react'; // Removed useEffect as it was unused
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"; // Removed usePayPalScriptReducer as it was unused

const PayPalButtonComponent = ({ amount, onSuccess }) => {
    // const [{ options, isPending }, dispatch] = usePayPalScriptReducer(); // Not strictly needed for basic button

    const initialOptions = {
        "client-id": "YOUR_PAYPAL_CLIENT_ID", // Replace with your Client ID
        currency: "USD",
        intent: "capture",
    };

    return (
        <PayPalScriptProvider options={initialOptions}>
            <div className="w-full max-w-md mx-auto z-0 relative"> {/* z-0 to fix potential overlay issues */}
                <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">Pay with PayPal</h3>
                <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            purchase_units: [
                                {
                                    amount: {
                                        value: amount || "10.00",
                                    },
                                },
                            ],
                        });
                    }}
                    onApprove={(data, actions) => {
                        return actions.order.capture().then((details) => {
                            const name = details.payer.name.given_name;
                            alert(`Transaction completed by ${name}`);
                            if (onSuccess) onSuccess(details);
                        });
                    }}
                />
            </div>
        </PayPalScriptProvider>
    );
};

export default PayPalButtonComponent;
