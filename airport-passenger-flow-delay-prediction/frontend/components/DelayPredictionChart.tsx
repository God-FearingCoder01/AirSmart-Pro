import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import axios from 'axios';

// Register Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DelayPredictionChart = ({ data }) => {
    const [chartData, setChartData] = useState<{ labels: string[]; datasets: any[] }>({
        labels: [],
        datasets: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/delay-predictions');
                const data = response.data;

                if (!Array.isArray(data)) {
                console.error('Unexpected data format:', data);
                setChartData({
                    labels: ['No Data'],
                    datasets: [{
                        label: 'Predicted Flight Delays',
                        data: [0],
                        borderColor: 'rgba(239, 68, 68, 1)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        fill: true,
                    }],
                });
                setLoading(false);
                return;
                }

                const labels = data.map(item => item.date);
                const values = data.map(item => item.predicted_delay);

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Predicted Flight Delays',
                            data: values,
                            borderColor: 'rgba(239, 68, 68, 1)',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            fill: true,
                            tension: 0.4,
                            pointRadius: 3,
                            pointHoverRadius: 5,
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching delay predictions:', error);
                setChartData({
                    labels: ['Error'],
                    datasets: [{
                        label: 'Predicted Flight Delays',
                        data: [0],
                        borderColor: 'rgba(239, 68, 68, 1)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        fill: true,
                    }],
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
        );
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Delay (minutes)',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Date',
                },
            },
        },
    };

    return (
        <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Flight Delay Predictions</h2>
            <div style={{ height: '280px' }}>
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
};

export default DelayPredictionChart;