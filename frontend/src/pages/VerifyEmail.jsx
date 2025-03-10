import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
    const { authUser, resendVerificationEmail } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleResendEmail = async () => {
        if (!authUser?.email) return;
        setIsLoading(true);
        try {
            await resendVerificationEmail(authUser.email);
            toast.success("Verification email sent successfully! 📩");
        } catch (error) {
            toast.error("Failed to resend verification email.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Email Verification Required</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    A verification link has been sent to:  
                    <span className="font-semibold text-gray-900 dark:text-white"> {authUser?.email} </span>.  
                    Please check your inbox.
                </p>
                <button
                    onClick={handleResendEmail}
                    disabled={isLoading}
                    className={`w-full mt-3 px-4 py-2 rounded-lg text-white font-medium transition ${
                        isLoading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {isLoading ? "Sending..." : "Resend Verification Email"}
                </button>
            </div>
        </div>
    );
};

export default VerifyEmail;
