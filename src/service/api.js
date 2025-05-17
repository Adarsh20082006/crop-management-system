// services/api.js
import axios from 'axios';

const API_KEY = '849cfddf2889b4a05f08224d7648ed60';
const BASE_URL = 'https://api.agromonitoring.com/agro/1.0';
export const createPolygon = async (geoJson) => {
    const response = await fetch(`${BASE_URL}/polygons?appid=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'UserRegion',
            geo_json: {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: geoJson.type,
                    coordinates: geoJson.coordinates
                },
            },
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        // If polygon is duplicated, extract the ID from the message
        if (data.message?.includes("duplicated")) {
            const match = data.message.match(/polygon '(.+?)'/);
            if (match && match[1]) {
                return { id: match[1], duplicated: true };
            }
        }
        throw new Error(data.message || "Failed to create polygon");
    }

    return data;
};



export const fetchWeather = async (polygonId) => {
    const res = await fetch(`${BASE_URL}/weather/forecast?polyid=${polygonId}&appid=${API_KEY}`);
    const data = await res.json();
    return data[0]; // use the first forecasted data point
};

export const fetchSoilData = async (polygonId) => {
    const res = await fetch(`${BASE_URL}/soil?polyid=${polygonId}&appid=${API_KEY}`);
    return res.json();
};



const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/analyze',
});



export const analyzeCropHealth = (formData) => 
  api.post('/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const getIrrigationPlan = () => 
  api.get('/irrigation-plan');
