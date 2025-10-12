import PassengerFlowChart from "../components/PassengerFlowChart";
import DelayPredictionChart from "../components/DelayPredictionChart";
import Icon from "../components/Icon";

// Redirect root to login page. The full dashboard component was here previously but
// we redirect users to `/login` on page load so they sign in first.
export default function Home() {
  // This component won't be rendered because getServerSideProps performs a redirect,
  // but we keep a minimal placeholder to satisfy Next.js page exports.
  return null;
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
  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };
}
