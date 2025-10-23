import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Icon from "../components/Icon";
import PassengerFlowChart from "../components/PassengerFlowChart";

interface AnalyticsProps {
  passengerStats: any;
  flightStats: any;
  waitTime: any;
  delayStats: any;
  passengerFlowData: any[];
}

export default function AnalyticsPage({ passengerStats, flightStats, waitTime, delayStats, passengerFlowData }: AnalyticsProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

  if (!isAuthenticated) return null;

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Analytics</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPI 
          title="Daily Passengers" 
          value={passengerStats?.count?.toLocaleString() || "0"} 
          change="+5.2% vs. yesterday" 
          icon="users" 
          iconBg="bg-blue-100" 
          iconColor="text-blue-600" 
        />
        <KPI 
          title="Avg. Wait Time" 
          value={`${waitTime?.value || 0} min`} 
          change={waitTime?.change || "No change"} 
          icon="clock" 
          iconBg="bg-yellow-100" 
          iconColor="text-yellow-600" 
        />
        <KPI 
          title="On-time Rate" 
          value={`${flightStats?.onTimePercent || 0}%`} 
          change="+3% vs. last week" 
          icon="plane" 
          iconBg="bg-green-100" 
          iconColor="text-green-600" 
        />
        <KPI 
          title="Delay Alerts" 
          value={delayStats?.count || 0} 
          change={delayStats?.confidence || "N/A"} 
          icon="alert-triangle" 
          iconBg="bg-red-100" 
          iconColor="text-red-600" 
        />
      </div>

      {/* Charts with real data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Passenger Flow Trends</h2>
          <PassengerFlowChart data={passengerFlowData} />
        </div>
        <div className="bg-white rounded-xl shadow p-6 h-80 flex items-center justify-center text-gray-400">
          Delay Heatmap by Hour (chart placeholder)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow p-6 h-72 col-span-2 flex items-center justify-center text-gray-400">
          Terminal Utilization (chart placeholder)
        </div>
        <div className="bg-white rounded-xl shadow p-6 h-72 flex items-center justify-center text-gray-400">
          Top Routes by Volume (chart placeholder)
        </div>
      </div>
    </>
  );
}

function KPI({ title, value, change, icon, iconBg, iconColor }: { title: string; value: string; change: string; icon: string; iconBg: string; iconColor: string; }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800 mt-2">{value}</h3>
        <p className={`${iconColor} text-sm mt-1`}>{change}</p>
      </div>
      <div className={`p-3 rounded-lg flex items-center justify-center ${iconBg}`} style={{ width: 48, height: 48 }}>
        <Icon name={icon} className={iconColor} />
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const API = process.env.API_URL || 'http://localhost:8000/api';
    // Fetch dashboard stats
    const statsRes = await fetch(`${API}/dashboard-stats/`);
    const statsData = await statsRes.json();

    // Fetch passenger flow data
    const flowRes = await fetch(`${API}/passenger-flow/`);
    const flowData = await flowRes.json();

    return {
      props: {
        passengerStats: statsData.passengerStats || {},
        flightStats: statsData.flightStats || {},
        waitTime: statsData.waitTime || {},
        delayStats: statsData.delayStats || {},
        passengerFlowData: Array.isArray(flowData) ? flowData : [],
      },
    };
  } catch (error) {
    console.error('Failed to fetch analytics data:', error);
    return {
      props: {
        passengerStats: {},
        flightStats: {},
        waitTime: {},
        delayStats: {},
        passengerFlowData: [],
      },
    };
  }
}
