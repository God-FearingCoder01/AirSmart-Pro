import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type PredictionResult = {
  is_delayed: number;
  delay_probability: number;
} | null;

export default function PredictionsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [form, setForm] = useState({
    flightId: 1,
    airline: "FastJet",
    origin: "BUQ",
    destination: "HRE",
    delayMinutes: 0,
    status: "Scheduled",
  });
  const [result, setResult] = useState<PredictionResult>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access') || sessionStorage.getItem('access');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ 
      ...f, 
      [name]: (name === 'flightId' || name === 'delayMinutes') ? Number(value) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    setResult(null);

    try {
      // Call backend delay prediction endpoint with GET query params
      const params = new URLSearchParams({
        flight_id: String(form.flightId),
        airline: form.airline,
        origin: form.origin,
        destination: form.destination,
        delay_minutes: String(form.delayMinutes),
        status: form.status,
      });

  const res = await fetch(`/api/delay-predictions/?${params.toString()}`);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with status ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'Could not fetch prediction. Please verify the backend endpoint.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) return null;

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Flight Delay Predictions</h1>
      <p className="text-gray-600 mb-8 max-w-3xl">
        Enter flight details to predict potential delays using our XGBoost ML model. 
        The model analyzes historical patterns and provides probability estimates.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Flight ID</label>
              <input 
                type="number" 
                name="flightId" 
                value={form.flightId} 
                onChange={handleChange} 
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Airline</label>
              <select 
                name="airline" 
                value={form.airline} 
                onChange={handleChange} 
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="FastJet">FastJet</option>
                <option value="Air Zimbabwe">Air Zimbabwe</option>
                <option value="SA Airlink">SA Airlink</option>
                <option value="Emirates">Emirates</option>
                <option value="Ethiopian Airlines">Ethiopian Airlines</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Origin Airport</label>
              <input 
                name="origin" 
                value={form.origin} 
                onChange={handleChange} 
                placeholder="e.g., BUQ, HRE" 
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Destination Airport</label>
              <input 
                name="destination" 
                value={form.destination} 
                onChange={handleChange} 
                placeholder="e.g., HRE, VFA" 
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Current Delay (minutes)</label>
              <input 
                type="number" 
                min={0} 
                name="delayMinutes" 
                value={form.delayMinutes} 
                onChange={handleChange} 
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Flight Status</label>
              <select 
                name="status" 
                value={form.status} 
                onChange={handleChange} 
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Boarding">Boarding</option>
                <option value="Delayed">Delayed</option>
                <option value="Departed">Departed</option>
                <option value="Arrived">Arrived</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button 
              type="submit" 
              disabled={submitting} 
              className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 disabled:opacity-60 transition"
            >
              {submitting ? 'Predicting…' : 'Predict Delay'}
            </button>
            {error && <span className="text-red-600 text-sm">{error}</span>}
          </div>
        </form>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Prediction Result</h2>
          {!result && !error && (
            <p className="text-gray-500">Submit the form to view prediction output.</p>
          )}
          {result && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${result.is_delayed ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                <div className={`text-lg font-semibold ${result.is_delayed ? 'text-red-700' : 'text-green-700'}`}>
                  {result.is_delayed ? '⚠️ Delay Expected' : '✅ On-Time'}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Delay Probability: <span className="font-semibold">{(result.delay_probability * 100).toFixed(1)}%</span>
                </div>
              </div>

              {/* Visual probability bar */}
              <div>
                <div className="text-sm text-gray-600 mb-2">Confidence Level</div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${result.delay_probability > 0.7 ? 'bg-red-500' : result.delay_probability > 0.4 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${result.delay_probability * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-3 border-t text-xs text-gray-500">
                <div>Model: XGBoost Classifier</div>
                <div>Input Features: Flight ID, Airline, Route, Status, Current Delay</div>
              </div>
            </div>
          )}
          {error && (
            <div className="mt-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Model insights section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">How It Works</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold">1.</span>
              <span>Historical flight data is preprocessed and normalized</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold">2.</span>
              <span>XGBoost model analyzes patterns in delays by route, airline, and time</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold">3.</span>
              <span>Probability score indicates likelihood of delay (&gt;15 minutes)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold">4.</span>
              <span>Predictions update in real-time as conditions change</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex items-center justify-center text-gray-400">
          Feature Importance Chart (placeholder)
        </div>
      </div>
    </>
  );
}
