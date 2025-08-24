"use client";

import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useForm, Controller } from 'react-hook-form';

export interface signup{
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

function SignUp() {
  const form = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [notMatching, setNotMatching] = useState(false);

  const watchPassword = form.watch("password");
  const watchConfirmPassword = form.watch("confirmPassword");

  // Manage disabled button
  useEffect(() => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    const validPassword = passwordRegex.test(watchPassword);

    const disabled =
      !validPassword ||
      !form.getValues("email").trim() ||
      !form.getValues("name").trim() ||
      !watchPassword.trim() ||
      !watchConfirmPassword.trim() ||
      watchPassword !== watchConfirmPassword;

    setButtonDisabled(disabled);
  }, [form, watchPassword, watchConfirmPassword]);

  useEffect(() => {
    setNotMatching(
      !watchPassword || !watchConfirmPassword || watchPassword !== watchConfirmPassword
    );
  }, [watchPassword, watchConfirmPassword]);

  const handleSubmit = async (data: signup) => {
    const { email, name, password, confirmPassword } = data;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/signup", { email, name, password });
      toast.success("Signed Up successfully!");
      // console.log(response);
      router.push("/login");
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string })?.message;
      toast.error(errorMessage || "Sign up failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
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
      <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-xl shadow-2xl border border-purple-300 sm:px-4 xs:px-2">
      <h2 className="text-3xl font-extrabold pb-6 text-center text-gradient bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
        {loading ? "Signing Up..." : "Sign Up"}
      </h2>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Email */}
        <Controller
        name="email"
        control={form.control}
        rules={{ required: "Email is required" }}
        render={({ field, fieldState }) => (
          <div>
          <label className="block text-purple-700 font-semibold mb-1">Email:</label>
          <input
            type="email"
            {...field}
            placeholder="Enter your email"
            className="w-full text-black px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          />
          {fieldState.error && (
            <span className="text-xs text-red-500">
            {fieldState.error.message}
            </span>
          )}
          </div>
        )}
        />

        {/* Name */}
        <Controller
        name="name"
        control={form.control}
        rules={{ required: "Name is required" }}
        render={({ field, fieldState }) => (
          <div>
          <label className="block text-purple-700 font-semibold mb-1">Name:</label>
          <input
            type="text"
            {...field}
            placeholder="Enter your name"
            className="w-full px-3 text-black py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          />
          {fieldState.error && (
            <span className="text-xs text-red-500">
            {fieldState.error.message}
            </span>
          )}
          </div>
        )}
        />

        {/* Password */}
        <Controller
        name="password"
        control={form.control}
        rules={{
          required: "Password is required",
          pattern: {
          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
          message:
            "Password must be 8+ chars, include upper, lower, number, and symbol.",
          },
        }}
        render={({ field, fieldState }) => (
          <div>
          <label className="block text-purple-700 font-semibold mb-1">Password:</label>
          <input
            type="password"
            {...field}
            placeholder="Enter your password"
            className="w-full px-3 text-black py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          />
          <p className="text-xs text-gray-400 mt-1">
            Must be 8+ chars, include upper, lower, number, and symbol.
          </p>
          {fieldState.error && (
            <span className="text-xs text-red-500">
            {fieldState.error.message}
            </span>
          )}
          </div>
        )}
        />

        {/* Confirm Password */}
        <Controller
        name="confirmPassword"
        control={form.control}
        rules={{
          required: "Confirm Password is required",
          validate: (value) =>
          value === form.getValues("password") ||
          "Passwords don't match",
        }}
        render={({ field, fieldState }) => (
          <div>
          <label className="block text-purple-700 font-semibold mb-1">Confirm Password:</label>
          <input
            type="password"
            {...field}
            placeholder="Confirm your password"
            className="w-full px-3 text-black py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          />
          {fieldState.error && (
            <span className="text-xs text-red-500">
            {fieldState.error.message}
            </span>
          )}
          </div>
        )}
        />

        {notMatching && watchPassword && watchConfirmPassword && (
        <p className="text-sm text-pink-600 font-semibold text-center">
          Passwords do not match
        </p>
        )}

        {/* Shadcn Button */}
        <button
        type="submit"
        className="w-full py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:scale-105 hover:from-blue-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={buttonDisabled || loading}
        >
        Sign Up
        </button>

        <div className="text-center mt-4">
        <span className="text-gray-700 font-medium">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-600 underline hover:text-pink-500 font-bold">
          Login
          </Link>
        </span>
        </div>
      </form>
      </div>
    </div>
  );
}


export default SignUp;
