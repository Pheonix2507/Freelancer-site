"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
// import Image from "next/image";

export default function Home() {
      const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="flex items-center justify-center mb-8">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          className="mr-4"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="32" cy="32" r="32" fill="#6366F1" />
          <path
            d="M20 36L32 24L44 36"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M32 24V44"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-2xl font-semibold text-indigo-600">
          FreelanceHub
        </span>
      </div>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-10 w-24 h-24 bg-indigo-100 rounded-full blur-2xl opacity-40"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-100 rounded-full blur-2xl opacity-40"></div>
      </div>
      <h1 className="text-4xl font-bold mb-4 text-gray-900">
      Welcome to FreelanceHub
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-xl">
      Connect with top freelancers and clients worldwide. Start your journey to success with our professional freelancing platform.
      </p>
      <div className="flex gap-4">
      <Button
        variant="default"
        className="px-6 py-3 cursor-pointer"
        onClick={() => router.push('/signup')}
      >
        Get Started
      </Button>
      <Button
        variant="outline"
        className="px-6 py-3 cursor-pointer"
        onClick={() => router.push('/login')}
      >
        Login
      </Button>
      <Button
        variant="destructive"
        className="px-6 py-3 cursor-pointer"
        onClick={() => router.push('/explore')}
      >
        Explore Freelancers
      </Button>
      </div>
    </div>
  );
}
