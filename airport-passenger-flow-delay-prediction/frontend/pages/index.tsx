import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PassengerFlowChart from "../components/PassengerFlowChart";
import DelayPredictionChart from "../components/DelayPredictionChart";
import Icon from "../components/Icon";

export default function Home({ passengerStats, flightStats, waitTime, delayStats }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated (has token)
    const token = localStorage.getItem('access') || sessionStorage.getItem('access');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Passengers"
          value={passengerStats?.count || 0}
          change="+12% from last week"
          icon="users"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <DashboardCard
          title="Flights Today"
          value={flightStats?.count || 0}
          change={`${flightStats?.onTimePercent || 0}% on-time`}
          icon="plane"
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
        <DashboardCard
          title="Avg Wait Time"
          value={`${waitTime?.value || 0} min`}
          change={waitTime?.change || "No change"}
          icon="clock"
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        <DashboardCard
          title="Predicted Delays"
          value={delayStats?.count || 0}
          change={delayStats?.confidence || "N/A"}
          icon="alert-triangle"
          iconBg="bg-red-100"
          iconColor="text-red-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <PassengerFlowChart data={[]} />
        <DelayPredictionChart data={[]} />
      </div>
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
        <p className={`${iconColor} text-sm mt-1`}>{change}</p>
      </div>
      {/* Icon background color */}
      <div className={`p-3 rounded-lg flex items-center justify-center ${iconBg}`} style={{ width: 48, height: 48 }}>
        <Icon name={icon} className={iconColor} />
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  // Fetch dashboard data from the backend
  try {
    const API = process.env.API_URL || 'http://localhost:8000/api';
    const res = await fetch(`${API}/dashboard-stats/`);
    const data = await res.json();
    
    return {
      props: {
        passengerStats: data.passengerStats || {},
        flightStats: data.flightStats || {},
        waitTime: data.waitTime || {},
        delayStats: data.delayStats || {},
      },
    };
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return {
      props: {
        passengerStats: {},
        flightStats: {},
        waitTime: {},
        delayStats: {},
      },
    };
  }
}
