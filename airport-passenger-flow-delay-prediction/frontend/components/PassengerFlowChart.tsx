import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

const PassengerFlowChart = ({ data }) => {
    if (!data) {
        return <p>No data available</p>;
    }

    const chartData = {
        labels: data.map((item: { time: any; }) => item.time), // Assuming data has a 'time' field
        datasets: [
            {
                label: 'Passenger Flow',
                data: data.map((item: { passengerCount: any; }) => item.passengerCount), // Assuming data has a 'passengerCount' field
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
        ],
    };

    return (
        <div>
            <Line data={chartData} />
        </div>
    );
};

export default PassengerFlowChart;