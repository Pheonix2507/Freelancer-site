"use client";
import { useRouter } from "next/navigation";
// import Image from "next/image";

export default function Home() {
      const router = useRouter();
  return (
    <div className="flex items-center justify-center min-h-screen">
      <button
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
        onClick={() => router.push('/signup')}
      >
        Go to Signup
      </button>
    </div>
  );
}
