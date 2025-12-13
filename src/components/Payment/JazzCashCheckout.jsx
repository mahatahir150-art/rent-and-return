import React, { useState } from "react";

const JazzCashCheckout = ({ amount, onSuccess }) => {
    const [mobileNumber, setMobileNumber] = useState("");
    const [cnic, setCnic] = useState("");
    const [processing, setProcessing] = useState(false);

    // NOTE: In a real production app, you DO NOT process payments directly from the frontend 
    // like this for security reasons. You should send a request to your backend, 
    // which then talks to JazzCash API.
    // This is a simulation/sandbox frontend implementation.

    const handlePayment = (e) => {
        e.preventDefault();
        setProcessing(true);

        // Simulate API call delay
        setTimeout(() => {
            setProcessing(false);
            // Basic validation simulation
            if (mobileNumber.length >= 11 && cnic.length >= 6) {
                alert("JazzCash Payment Request Sent! Check your mobile for MPIN prompt.");
                if (onSuccess) onSuccess({ transactionId: "JC-" + Date.now(), amount, method: "JazzCash" });
            } else {
                alert("Please enter valid details.");
            }
        }, 2000);
    };

    return (
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md border border-orange-500">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Pay with JazzCash</h3>
                <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded">PKR ONLY</span>
            </div>

            <form onSubmit={handlePayment}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">JazzCash Mobile Number</label>
                    <input
                        type="text"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="03001234567"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last 6 Digits of CNIC</label>
                    <input
                        type="text"
                        value={cnic}
                        onChange={(e) => setCnic(e.target.value)}
                        placeholder="123456"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        required
                        maxLength={6}
                    />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-md transition duration-200 disabled:opacity-50"
                >
                    {processing ? "Processing..." : `Pay PKR ${amount}`}
                </button>
            </form>
        </div>
    );
};

export default JazzCashCheckout;
