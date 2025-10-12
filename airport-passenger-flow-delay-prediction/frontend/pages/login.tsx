import { useState } from "react";
import axios from "axios";
import Icon from "../components/Icon";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/token/', form);
      const { access, refresh } = res.data;
      if (remember) {
        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);
      } else {
        sessionStorage.setItem('access', access);
        sessionStorage.setItem('refresh', refresh);
      }
      // Redirect to dashboard (root) after login
      router.push('/');
    } catch (err: any) {
      setMessage(err.response?.data?.detail || 'Sign in failed');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(rgba(247,249,250,0.95), rgba(255,255,255,0.98)), url('/acz-logo.jpg')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '260px',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-transparent flex items-center justify-center mb-3">
            <Icon name="navigation" className="text-green-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800">AirportFlow<span className="text-green-600">Pro</span></h1>
          <h2 className="text-lg font-semibold mt-2">Welcome Back</h2>
          <p className="text-sm text-gray-500 mt-2">Please sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Username</label>
            <input name="username" onChange={handleChange} className="w-full p-3.5 md:p-4 border border-gray-200 rounded-md text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Password</label>
            <input name="password" type="password" onChange={handleChange} className="w-full p-3.5 md:p-4 border border-gray-200 rounded-md text-sm" />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm">
              <input type="checkbox" className="mr-2" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <span className="text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-green-600">Forgot password?</a>
          </div>

          <div>
            <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-green-400 text-white p-3.5 rounded-md font-semibold">Sign In</button>
          </div>
        </form>

        <div className="text-center mt-5">
          <p className="text-sm text-gray-600">Don't have an account? <a href="/signup" className="text-green-600 font-medium">Sign up</a></p>
          {message && <p className="mt-3 text-sm text-center text-red-600">{message}</p>}
        </div>
      </div>
    </div>
  );
}

// Instruct _app to skip the global Layout for this page
(LoginPage as any).noLayout = true;
