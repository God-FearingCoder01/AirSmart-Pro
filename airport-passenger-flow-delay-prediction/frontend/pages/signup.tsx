import { useState } from "react";
import axios from "axios";
import Icon from "../components/Icon";
import { useRouter } from "next/router";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (message) setMessage(""); // Clear message when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!form.username || !form.email || !form.password) {
      setMessage("Please fill in all fields");
      return;
    }

    if (form.password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
  const res = await axios.post("/api/signup/", form);
      setIsSuccess(true);
      setMessage("Account created successfully! Redirecting to login...");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.username?.[0] || 
                       err.response?.data?.email?.[0] || 
                       err.response?.data?.error || 
                       "Signup failed. Please try again.";
      setMessage(errorMsg);
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
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden px-12 py-10">
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
                  type="text" 
                  name="username" 
                  placeholder="Username"
                  value={form.username}
                  className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  onChange={handleChange}
                  disabled={isLoading || isSuccess}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email" 
                  name="email" 
                  placeholder="Email"
                  value={form.email}
                  className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  onChange={handleChange}
                  disabled={isLoading || isSuccess}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password" 
                  name="password" 
                  placeholder="Password"
                  value={form.password}
                  className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  onChange={handleChange}
                  disabled={isLoading || isSuccess}
                  minLength={6}
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading || isSuccess}
                className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {isLoading ? "Creating account..." : isSuccess ? "Success!" : "Sign Up"}
              </button>

              {message && (
                <p className={`text-center text-sm ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </p>
              )}

              {!isSuccess && (
                <p className="text-center text-sm text-gray-500">
                  Already have an account? <a href="/login" className="text-green-600 font-medium hover:underline">Log in</a>
                </p>
              )}
            </form>
        </div>
      </div>
    </div>
  );
}

// Skip global layout for this page (app-level `_app.tsx` checks this flag)
(SignupPage as any).noLayout = true;
