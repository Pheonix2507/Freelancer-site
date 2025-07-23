"use client";

import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        const validPassword = passwordRegex.test(password);
        
        const disabled = !validPassword || !email.trim() || !password.trim();
        setButtonDisabled(disabled);
    }, [email, password]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            const response = await axios.post('/api/login', { email, password });
            console.log('Logged in successfully!', response.data);
            toast.success('Logged in successfully!');
            router.push("/home");
        } catch (error: any) {
            console.error('Login Failed!', error?.message);
            toast.error(error?.message || 'Login failed!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>{ loading ? "Logging in..." : "Login" }</h1>
            <form>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Enter your email'
                    required
                />
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Enter your password'
                    required
                />
                <button
                    type="submit"
                    className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 hover:bg-gray-200 hover:text-black transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-white"
                    disabled={buttonDisabled}
                    onClick={handleLogin}
                >
                    Login
                </button>
                <span>Don't have an account? <Link href="/signup" className='underline'>signup here</Link></span>
            </form>
        </div>
    )
}

export default Login;
