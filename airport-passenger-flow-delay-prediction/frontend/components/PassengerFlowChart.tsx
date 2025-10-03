import { Line } from "react-chartjs-2";

const PassengerFlowChart = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <p>No passenger flow data available</p>;
  }

  const chartData = {
    labels: data.map((item) => item.time), // ✅ safe now
    datasets: [
      {
        label: "Passenger Flow",
        data: data.map((item) => item.passengerCount),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default PassengerFlowChart;
