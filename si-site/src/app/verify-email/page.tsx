"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);

    const verifyUserEmail = async () => {
        try {
            await axios.post("/api/users/verify-email", { token });
            setVerified(true);
            setError(false);
            console.log("Successfully verified!");
            toast.success("Verified successfully!");
        } catch (error) {
            setError(true);
            setVerified(false);
            console.log("Email verification failed!", error);
            toast.error("Email verification failed!");
        }
    };

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    }, []);

    useEffect(() => {
        if (token.length > 0) {
            verifyUserEmail();
        }
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl">Verify Email</h1>
            <h2 className="p-2 bg-orange-500 text-black">{ token ? `${token}` : "No token!" }</h2>

            {verified &&
                <div>
                    <h2 className="text-2xl">Email Verified</h2>
                    <Link href="/login" className="underline">
                        Login
                    </Link>
                </div>
            }
            {error &&
                <div>
                    <h2 className="text-2xl bg-red-500 text-black">Error! Not Verified</h2>
                </div>
            }
        </div>
    );
};