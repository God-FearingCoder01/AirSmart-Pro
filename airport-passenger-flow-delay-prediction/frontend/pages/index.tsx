import PassengerFlowChart from "../components/PassengerFlowChart";
import DelayPredictionChart from "../components/DelayPredictionChart";
import Icon from "../components/Icon";

export default function Home({ passengerStats, flightStats, waitTime, delayStats, passengerFlowData, delayPredictionData, recentPredictions }) {
  return (
    <>
    {/* Dashboard Header */}
    <div className="mb-8">
      {/* <img src="/ACZ_Logo.ico" alt="Airport Logo" /> */}
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Airport Dashboard</h2>
      <p className="text-gray-600">Real-time passenger flow and flight delay predictions</p>
    </div>

    {/* Stats Overview */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <DashboardCard title="Current Passengers" value={passengerStats.count} change="+12% from yesterday" icon="users" iconBg="bg-green-100" iconColor="text-green-600" />
      <DashboardCard title="Active Flights" value={flightStats.count} change={`On-time: ${flightStats.onTimePercent}%`} icon="plane" iconBg="bg-blue-100" iconColor="text-blue-600" />
      <DashboardCard title="Avg. Wait Time" value={`${waitTime.value} min`} change={waitTime.change} icon="clock" iconBg="bg-yellow-100" iconColor="text-yellow-600" />
      <DashboardCard title="Delay Predictions" value={delayStats.count} change={delayStats.confidence} icon="alert-triangle" iconBg="bg-red-100" iconColor="text-red-600" />
    </div>

    {/* Charts Section */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div className="dashboard-card bg-white rounded-xl p-6 shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Passenger Flow Prediction</h3>
        <div className="h-80">
          <PassengerFlowChart data={passengerFlowData} />
        </div>
      </div>
      <div className="dashboard-card bg-white rounded-xl p-6 shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Flight Delay Predictions</h3>
        <div className="h-80">
          <DelayPredictionChart data={delayPredictionData} />
        </div>
      </div>
    </div>

    {/* Recent Predictions Table */}
    <RecentPredictionsTable predictions={recentPredictions} />
    </>
  );
}

// Example DashboardCard component
function DashboardCard({ title, value, change, icon, iconBg, iconColor }) {
  return (
    <div className="dashboard-card bg-white rounded-xl p-6 shadow flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800 mt-2">{value}</h3>
        <p className={`${iconColor.replace('text-', 'text-')} text-sm mt-1`}>{change}</p>
      </div>
          {/* Icon background color */}
          <div className={`p-3 rounded-lg flex items-center justify-center ${iconBg}`} style={{ width: 48, height: 48 }}>
            <Icon name={icon} className={iconColor} />
          </div>
    </div>
  );
}

// Example RecentPredictionsTable component
function RecentPredictionsTable({ predictions }) {
  return (
    <div className="dashboard-card bg-white rounded-xl p-6 shadow mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Recent Predictions</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flight</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Predicted Delay</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {predictions.map((p, i) => (
              <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap">{p.flight}</td>
                <td className="px-6 py-4 whitespace-nowrap">{p.destination}</td>
                <td className="px-6 py-4 whitespace-nowrap">{p.scheduled}</td>
                <td className="px-6 py-4 whitespace-nowrap">{p.predictedDelay}</td>
                <td className="px-6 py-4 whitespace-nowrap">{p.confidence}</td>
                <td className="px-6 py-4 whitespace-nowrap">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


export async function getServerSideProps() {
  try {
    const [passengerRes, delayRes, statsRes] = await Promise.all([
      fetch("http://localhost:8000/api/passenger-flow/", {
        headers: { Accept: "application/json" },
      }),
      fetch("http://localhost:8000/api/delay-predictions/", {
        headers: { Accept: "application/json" },
      }),
      fetch("http://localhost:8000/api/dashboard-stats/", {
        headers: { Accept: "application/json" },
      }),
    ]);

    const [passengerFlowDataRaw, delayPredictionData, passengerStatsData] =
      await Promise.all([
        passengerRes.json(),
        delayRes.json(),
        statsRes.json(),
      ]);

    const { passengerStats, flightStats, waitTime, delayStats, recentPredictions } =
      passengerStatsData;

    // Helper to replace `undefined` with `null` recursively so Next.js can serialize the props
    const sanitizeForSSR = (value) => {
      if (value === undefined) return null;
      if (value === null) return null;
      if (Array.isArray(value)) return value.map(sanitizeForSSR);
      if (typeof value === "object") {
        const out = {};
        for (const k in value) {
          if (Object.prototype.hasOwnProperty.call(value, k)) {
            const v = value[k];
            out[k] = v === undefined ? null : sanitizeForSSR(v);
          }
        }
        return out;
      }
      // primitives (string, number, boolean)
      return value;
    };

    return {
      props: {
        passengerFlowData: Array.isArray(passengerFlowDataRaw)
          ? passengerFlowDataRaw
          : [], // ✅ guarantee array
        delayPredictionData: Array.isArray(delayPredictionData)
          ? delayPredictionData
          : [],
        passengerStats: sanitizeForSSR(passengerStats ?? { count: 0 }),
        flightStats: sanitizeForSSR(flightStats ?? { count: 0, onTimePercent: 0 }),
        waitTime: sanitizeForSSR(waitTime ?? { value: 0, change: "" }),
        delayStats: sanitizeForSSR(delayStats ?? { count: 0, confidence: "" }),
        recentPredictions: Array.isArray(recentPredictions)
          ? recentPredictions.map(sanitizeForSSR)
          : [],
      },
    };
  } catch (err) {
    console.error("Error in getServerSideProps:", err);
    return {
      props: {
        passengerFlowData: [],
        delayPredictionData: [],
        passengerStats: { count: 0 },
        flightStats: { count: 0, onTimePercent: 0 },
        waitTime: { value: 0, change: "" },
        delayStats: { count: 0, confidence: "" },
        recentPredictions: [],
      },
    };
  }
}
