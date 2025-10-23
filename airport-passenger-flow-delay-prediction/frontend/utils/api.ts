import axios from 'axios';

const API_BASE_URL = process.env.API_URL || '/api'; // Use Next rewrite in browser or absolute in SSR

export const fetchPassengerFlow = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/passenger-flow/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching passenger flow data:', error);
        throw error;
    }
};

export const fetchFlightDelayPrediction = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/flight-delay/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching flight delay prediction data:', error);
        throw error;
    }
};