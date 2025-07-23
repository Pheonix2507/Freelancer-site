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
        } catch (error: any) {
            console.error("Sign Up Failed!", error?.message);
            toast.error(error?.message || "Sign Up failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>{ loading ? "Signing Up..." : "Sign Up" }</h1>
            <form>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Enter your email'
                        required
                    />
                </div>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Enter your name'
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Enter your password'
                        required
                    />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder='Confirm your password'
                        required
                    />
                    <span>{notMatching ? "Passwords don't match" : ""}</span>
                </div>
                <button
                    type="submit"
                    className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 hover:bg-gray-200 hover:text-black transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-white"
                    onClick={handleSubmit}
                    disabled={buttonDisabled}
                >
                    Sign Up
                </button>
                <span>Already have an account? <Link href="/login" className='underline'>login here</Link></span>
            </form>
        </div>
    )
}

export default SignUp
