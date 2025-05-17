import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './index.css'
import { createPolygon, fetchWeather, fetchSoilData } from '../../service/api';

function IrrigationPlanner() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const [weather, setWeather] = useState(null);
    const [soil, setSoil] = useState(null);

    const [formData, setFormData] = useState({
        NDVI_mean: '0.4',
        NDWI_mean: '0.2',
        Temperature: '',
        Humidity: '',
        Wind_Speed: '',
        Cloud_Cover: '',
        Pressure: ''
    });

    const kelvinToCelsius = (kelvin) => (kelvin - 273.15).toFixed(2);

    useEffect(() => {
        const handlePolygonCreated = async (geometry) => {
            try {
                const existingPolygonId = Cookies.get('polygon_id');
                let polygonId;

                if (existingPolygonId) {
                    polygonId = existingPolygonId;
                } else {
                    const polygon = await createPolygon(geometry);
                    polygonId = polygon.id;
                    Cookies.set('polygon_id', polygonId);
                }

                const weatherData = await fetchWeather(polygonId);
                const soilData = await fetchSoilData(polygonId);
                setWeather(weatherData);
                setSoil(soilData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                console.log(soil)
            }
        };

        const selectedArea = JSON.parse(Cookies.get('selected_area'));
        if (selectedArea) handlePolygonCreated(selectedArea);
    }, [soil]);

    useEffect(() => {
        // When weather is available, update formData
        if (weather) {
            setFormData(prev => ({
                ...prev,
                Temperature: kelvinToCelsius(weather.main.temp),
                Humidity: weather.main.humidity,
                Wind_Speed: weather.wind.speed,
                Cloud_Cover: weather.clouds.all,
                Pressure: weather.main.pressure
            }));
        }
    }, [weather]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: parseFloat(e.target.value) || ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://127.0.0.1:8000/predict', formData);
            setResult(response.data);
        } catch (error) {
            console.error("Prediction error:", error);
            setResult({ error: "Failed to get prediction" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="irrigation-planner text-red-800">
            <h1 className='irrigation-planner-title text-red-800'>Irrigation Prediction</h1>
            <form className='irrigation-form ' onSubmit={handleSubmit}>
                {Object.keys(formData).map((field) => (
                    <div key={field}>
                        <label>{field.replaceAll('_', ' ')}:</label>
                        <input
                            type="number"
                            step="any"
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}
                <button className='irrigation-submit-btn' type="submit" disabled={loading}>
                    {loading ? "Predicting..." : "Predict"}
                </button>
            </form>

            {result && (
                <div className="result">
                    {result.error ? (
                        <p style={{ color: 'red' }}>{result.error}</p>
                    ) : (
                        <>
                            <h2>Prediction: {result.prediction}</h2>
                            <p>Confidence: {(result.probability * 100).toFixed(2)}%</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default IrrigationPlanner;
