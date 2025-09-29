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
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);
import axios from 'axios';


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

                const labels = data.map(item => item.date);
                const values = data.map(item => item.predicted_delay);

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Predicted Flight Delays',
                            data: values,
                            borderColor: 'rgba(75,192,192,1)',
                            backgroundColor: 'rgba(75,192,192,0.2)',
                            fill: true,
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching delay predictions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Flight Delay Predictions</h2>
            <Line data={chartData} />
        </div>
    );
};

export default DelayPredictionChart;