"use client";

import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useForm, Controller } from "react-hook-form";

export interface err {
  message: string;
}

interface LoginFormValues {
  email: string;
  password: string;
}

function Login() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid }
  } = useForm<LoginFormValues>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const email = watch("email");
  const password = watch("password");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    const validPassword = passwordRegex.test(password);
    const disabled = !validPassword || !email.trim() || !password.trim();
    setButtonDisabled(disabled);
  }, [email, password]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/login', data);
      console.log('Logged in successfully!', response.data);
      toast.success('Logged in successfully!');
      router.push("/home");
    } catch (error: unknown) {
      const errorMessage = (error as err)?.message;
      console.error('Login Failed!', errorMessage);
      toast.error(errorMessage || 'Login failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          {loading ? "Logging in..." : "Login"}
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="email"
            control={control}
            rules={{ required: "Email is required" }}
            render={({ field, fieldState }) => (
              <div>
                <label className="block text-gray-700 mb-1">Email:</label>
                <input
                  type="email"
                  {...field}
                  placeholder="Enter your email"
                  required
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                {fieldState.error && (
                  <span className="text-xs text-red-500">{fieldState.error.message}</span>
                )}
              </div>
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                message:
                  "Password must be 8+ chars, include upper, lower, number, and symbol."
              }
            }}
            render={({ field, fieldState }) => (
              <div>
                <label className="block text-gray-700 mb-1">Password:</label>
                <input
                  type="password"
                  {...field}
                  placeholder="Enter your password"
                  required
                  className="w-full px-3 text-black py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                {/* <p className="text-xs text-gray-400 mt-1">
                  Must be 8+ chars, include upper, lower, number, and symbol.
                </p> */}
                {fieldState.error && (
                  <span className="text-xs text-red-500">{fieldState.error.message}</span>
                )}
              </div>
            )}
          />

          <button
            type="submit"
            disabled={!isValid || loading || buttonDisabled}
            className="w-full py-2 cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Login
          </button>

          <div className="text-center mt-4">
            <span className="text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-blue-600 underline">
                signup here
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
