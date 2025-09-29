import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PassengerFlowChart from '../components/PassengerFlowChart';
import DelayPredictionChart from '../components/DelayPredictionChart';
import Layout from '../components/Layout';

const Home = () => {
  const [passengerFlowData, setPassengerFlowData] = useState(null);
  const [delayPredictionData, setDelayPredictionData] = useState(null);

  useEffect(() => {
    const fetchPassengerFlowData = async () => {
      try {
        const response = await axios.get('/api/passenger-flow');
        setPassengerFlowData(response.data);
      } catch (error) {
        console.error('Error fetching passenger flow data:', error);
      }
    };

    const fetchDelayPredictionData = async () => {
      try {
        const response = await axios.get('/api/delay-prediction');
        setDelayPredictionData(response.data);
      } catch (error) {
        console.error('Error fetching delay prediction data:', error);
      }
    };

    fetchPassengerFlowData();
    fetchDelayPredictionData();
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Airport Passenger Flow and Delay Prediction</h1>
      {passengerFlowData && <PassengerFlowChart data={passengerFlowData} />}
      {delayPredictionData && <DelayPredictionChart data={delayPredictionData} />}
    </Layout>
  );
};

export default Home;