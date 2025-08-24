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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
      <div className="w-full max-w-sm p-8 bg-background rounded-xl shadow-lg border border-purple-300">
              <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow hover:bg-purple-100 transition font-semibold text-purple-700 border border-purple-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-purple-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m5-8l2 2m-2-2v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-8" />
          </svg>
          Home
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-6 text-center">
        {loading ? "Logging in..." : "Login"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Controller
        name="email"
        control={control}
        rules={{ required: "Email is required" }}
        render={({ field, fieldState }) => (
          <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...field}
            placeholder="Enter your email"
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-black"
          />
          {fieldState.error && (
            <span className="text-xs text-destructive">{fieldState.error.message}</span>
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
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...field}
            placeholder="Enter your password"
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-black"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Must be 8+ chars, include upper, lower, number, and symbol.
          </p>
          {fieldState.error && (
            <span className="text-xs text-destructive">{fieldState.error.message}</span>
          )}
          </div>
        )}
        />

        <button
        type="submit"
        disabled={!isValid || loading || buttonDisabled}
        className="w-full py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:scale-105 hover:from-blue-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
        Login
        </button>

        <div className="text-center mt-4">
        <span className="text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary underline font-medium">
          SignUp
          </Link>
        </span>
        </div>
      </form>
      </div>
    </div>
  );
}

export default Login;
