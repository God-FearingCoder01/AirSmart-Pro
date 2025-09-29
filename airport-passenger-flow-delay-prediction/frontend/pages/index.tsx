import Layout from "../components/Layout";
import PassengerFlowChart from "../components/PassengerFlowChart";
import DelayPredictionChart from "../components/DelayPredictionChart";

export default function Home({ passengerStats, flightStats, waitTime, delayStats, passengerFlowData, delayPredictionData, recentPredictions }) {
  return (
    <Layout>
      {/* Dashboard Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Airport Dashboard</h2>
        <p className="text-gray-600">Real-time passenger flow and flight delay predictions</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard title="Current Passengers" value={passengerStats.count} change="+12% from yesterday" icon="users" color="green" />
        <DashboardCard title="Active Flights" value={flightStats.count} change={`On-time: ${flightStats.onTimePercent}%`} icon="plane" color="blue" />
        <DashboardCard title="Avg. Wait Time" value={`${waitTime.value} min`} change={waitTime.change} icon="clock" color="yellow" />
        <DashboardCard title="Delay Predictions" value={delayStats.count} change={delayStats.confidence} icon="alert-triangle" color="red" />
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
    </Layout>
  );
}

// Example DashboardCard component
function DashboardCard({ title, value, change, icon, color }) {
  return (
    <div className="dashboard-card bg-white rounded-xl p-6 shadow flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800 mt-2">{value}</h3>
        <p className={`text-${color}-500 text-sm mt-1`}>{change}</p>
      </div>
      <div className={`bg-${color}-100 p-3 rounded-lg`}>
        {/* Replace with your icon system or SVG */}
        <span className={`text-${color}-600`}>{icon}</span>
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
  // Replace with your actual API endpoints
  const [passengerRes, delayRes, statsRes] = await Promise.all([
    fetch('http://localhost:8000/api/passenger-flow/'),
    fetch('http://localhost:8000/api/flight-delay/'),
    fetch('http://localhost:8000/api/dashboard-stats/'),
  ]);
  const passengerFlowData = await passengerRes.json();
  const delayPredictionData = await delayRes.json();
  const stats = await statsRes.json();

  return {
    props: {
      passengerStats: stats.passengerStats,
      flightStats: stats.flightStats,
      waitTime: stats.waitTime,
      delayStats: stats.delayStats,
      passengerFlowData,
      delayPredictionData,
      recentPredictions: stats.recentPredictions,
    },
  };
}