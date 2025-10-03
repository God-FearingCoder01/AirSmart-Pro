import { useState } from "react";
import axios from "axios";

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
      setMessage(res.data.message);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Sign Up</h2>
        <input
          type="text" name="username" placeholder="Username"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        />
        <input
          type="email" name="email" placeholder="Email"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        />
        <input
          type="password" name="password" placeholder="Password"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Sign Up
        </button>
        {message && <p className="mt-3 text-center text-sm">{message}</p>}
      </form>
    </div>
  );
}
