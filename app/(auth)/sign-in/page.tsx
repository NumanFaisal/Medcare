"use client";  // ✅ This tells Next.js it's a Client Component

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER"); // Default role
  const [error, setError] = useState("");
  const router = useRouter(); // ✅ Now it works inside a Client Component

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      role,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      // router.push("/"); // ✅ Redirect after successful login
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="USER">User</option>
          <option value="DOCTOR">Doctor</option>
          <option value="MEDICAL">Medical Shop</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Sign In
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
