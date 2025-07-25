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
      console.log(response);
      router.push("/login");
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string })?.message;
      toast.error(errorMessage || "Sign up failed!");
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
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          {/* Email */}
          <Controller
            name="email"
            control={form.control}
            rules={{ required: "Email is required" }}
            render={({ field, fieldState }) => (
              <div>
                <label className="block text-gray-700 mb-1">Email:</label>
                <input
                  type="email"
                  {...field}
                  placeholder="Enter your email"
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
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
                <label className="block text-gray-700 mb-1">Name:</label>
                <input
                  type="text"
                  {...field}
                  placeholder="Enter your name"
                  className="w-full px-3 text-black py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
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
                <label className="block text-gray-700 mb-1">Password:</label>
                <input
                  type="password"
                  {...field}
                  placeholder="Enter your password"
                  className="w-full px-3 text-black py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
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
                <label className="block text-gray-700 mb-1">Confirm Password:</label>
                <input
                  type="password"
                  {...field}
                  placeholder="Confirm your password"
                  className="w-full px-3 text-black py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                {fieldState.error && (
                  <span className="text-xs text-red-500">
                    {fieldState.error.message}
                  </span>
                )}
              </div>
            )}
          />

          {notMatching &&(<p className='text-red'> Password Not Matching</p>)}

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 cursor-pointer text-white rounded hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={buttonDisabled || loading}
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
  );
}


export default SignUp;
