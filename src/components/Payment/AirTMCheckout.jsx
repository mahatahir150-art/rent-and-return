import React, { useState } from "react";

const AirTMCheckout = ({ amount, currency = "USD", onSuccess }) => {
    const [email, setEmail] = useState("");
    const [processing, setProcessing] = useState(false);

    const handlePayment = (e) => {
        e.preventDefault();
        setProcessing(true);

        // Simulate AirTM Payment Flow
        setTimeout(() => {
            setProcessing(false);
            if (email.includes("@")) {
                alert(`Payment request sent to ${email} via AirTM.`);
                if (onSuccess) onSuccess({ transactionId: "ATM-" + Date.now(), amount, currency, method: "AirTM" });
            } else {
                alert("Please enter a valid AirTM email.");
            }
        }, 2000);
    };

    return (
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md border border-blue-400">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Pay with AirTM</h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">Global</span>
            </div>

            <p className="text-sm text-gray-600 mb-4">
                Pay securely using your AirTM balance. A request will be sent to your email.
            </p>

            <form onSubmit={handlePayment}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">AirTM Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@example.com"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition duration-200 disabled:opacity-50"
                >
                    {processing ? "Sending Request..." : `Pay ${currency} ${amount}`}
                </button>
            </form>
        </div>
    );
};

export default AirTMCheckout;
