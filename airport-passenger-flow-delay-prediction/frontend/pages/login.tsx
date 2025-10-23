import { useState } from "react";
import axios from "axios";
import Icon from "../components/Icon";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (message) setMessage(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!form.username || !form.password) {
      setMessage("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setMessage("");

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
      setMessage(err.response?.data?.detail || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: `linear-gradient(rgba(247,249,250,0.95), rgba(255,255,255,0.98)), url('/acz-logo.jpg')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '260px',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg px-12 py-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-transparent flex items-center justify-center mb-4">
            <Icon name="navigation" className="text-green-600 w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800">AirportFlow<span className="text-green-600">Pro</span></h1>
          <h2 className="text-xl font-semibold mt-3">Welcome Back</h2>
          <p className="text-sm text-gray-500 mt-2">Please sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input name="username" value={form.username} onChange={handleChange} disabled={isLoading} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-100 disabled:cursor-not-allowed" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} disabled={isLoading} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-100 disabled:cursor-not-allowed" required />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center text-sm">
              <input type="checkbox" className="mr-2 w-4 h-4" checked={remember} onChange={(e) => setRemember(e.target.checked)} disabled={isLoading} />
              <span className="text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-green-600 font-medium hover:underline">Forgot password?</a>
          </div>

          <div className="pt-10">
            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-white py-3.5 rounded-lg font-semibold text-base shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-opacity">
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">Don't have an account? <a href="/signup" className="text-green-600 font-medium">Sign up</a></p>
          {message && <p className="mt-3 text-sm text-center text-red-600">{message}</p>}
        </div>
      </div>
    </div>
  );
}

// Instruct _app to skip the global Layout for this page
(LoginPage as any).noLayout = true;
