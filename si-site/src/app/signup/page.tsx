"use client";

import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

function SignUp() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [notMatching, setNotMatching] = useState(false);

    useEffect(() => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        const validPassword = passwordRegex.test(password);
        
        const disabled = !validPassword || !email.trim() || !name.trim() || !password.trim() || !confirmPassword.trim() || password !== confirmPassword;
        setButtonDisabled(disabled);
    }, [email, name, password, confirmPassword]);

    useEffect(() => {
        if (!password || !confirmPassword || password !== confirmPassword) {
            setNotMatching(true);
        } else {
            setNotMatching(false);
        }
    }, [password, confirmPassword]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post('/api/signup', { email, name, password });
            console.log("Signed Up successfully!", response.data);
            toast.success("Signed Up successfully!");
            router.push("/login");
        } catch (error: unknown) {
          const errorMessage = (error as { message?: string })?.message;
            console.error('Login Failed!', errorMessage);
            toast.error(errorMessage || 'Login failed!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center text-black">
                {loading ? "Signing Up..." : "Sign Up"}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                <label className="block text-gray-700 mb-1">Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                </div>
                <div>
                <label className="block text-gray-700 mb-1">Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                </div>
                <div>
                <label className="block text-gray-700 mb-1">Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                    Must be 8+ chars, include upper, lower, number, and symbol.
                </p>
                </div>
                <div>
                <label className="block text-gray-700 mb-1">Confirm Password:</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                {notMatching && (
                    <span className="text-xs text-red-500">Passwords don&apos;t match</span>
                )}
                </div>
                <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={buttonDisabled}
                >
                Sign Up
                </button>
                <div className="text-center mt-4">
                <span className="text-gray-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 underline">
                    login here
                    </Link>
                </span>
                </div>
            </form>
            </div>
        </div>
    )
}

export default SignUp
