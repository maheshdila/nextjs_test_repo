import { registerUser } from "../../server/actions/user";
import { redirect } from "next/navigation";

export default function RegisterPage({ searchParams }: { searchParams?: { error?: string } }) {
  async function handleRegister(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const result = await registerUser(name, email, password);
    if (result.token) {
      // Pass token to client for storage
      return redirect(`/register?token=${encodeURIComponent(result.token)}`);
    }
    // Redirect back with error
    return redirect(`/register?error=${encodeURIComponent(result.error || "Registration failed")}`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6"
        action={handleRegister}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        {searchParams?.error && (
          <div className="text-red-600 text-center mb-2">{searchParams.error}</div>
        )}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none"
        >
          Register
        </button>
      </form>
      <RegisterClientScript />
    </div>
  );
}

// Client component to handle token in query param
'use client';
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function RegisterClientScript() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("jwt", token);
      router.replace("/");
    }
  }, [searchParams, router]);
  return null;
} 