import { useState } from "react";
import axios from "axios";
import Icon from "../components/Icon";

export default function SignupPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/signup/", form);
      setMessage(res.data.message || "Account created. Please log in.");
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col items-center">
              <div className="p-3 rounded-full bg-white border border-gray-100 shadow-sm">
                <Icon name="navigation" className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="mt-4 text-2xl font-extrabold text-gray-800">
                AirportFlow<span className="text-green-600">Pro</span>
              </h1>
              <h2 className="mt-2 text-lg font-semibold">Create Account</h2>
              <p className="mt-2 text-sm text-gray-500">Sign up to access the dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text" name="username" placeholder="Username"
                  className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email" name="email" placeholder="Email"
                  className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password" name="password" placeholder="Password"
                  className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md">
                Sign Up
              </button>

              {message && <p className="text-center text-sm text-gray-600">{message}</p>}

              <p className="text-center text-sm text-gray-500">
                Already have an account? <a href="/login" className="text-green-600 font-medium">Log in</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skip global layout for this page (app-level `_app.tsx` checks this flag)
(SignupPage as any).noLayout = true;
