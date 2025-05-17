import React, { useState, useEffect } from 'react';
import axios from "axios";
import MapDetails from '../MapDetails';
import './index.css';
import Cookies from 'js-cookie';

function Dashboard(props) {
    const [area, setArea] = useState(null);
    const [yeild, setYeild] = useState(null);
    const [alertStatus, setAlertStatus] = useState(null);
    const [alertScore, setAlertScore] = useState(null);
    const [ndviData, setNdviData] = useState(null);
    console.log(props)

    const handleAreaSelected = (coords) => {
        setArea(coords);
        Cookies.set('selected_area', JSON.stringify(coords), { expires: 7 });
        
        
    };


    useEffect(() => {
        const getYeild = async () => {
            const inpData = {
                "soil_moisture_": 45,
                "soil_pH": 6.5,
                "temperature_C": 30,
                "rainfall_mm": 220,
                "humidity_": 65,
                "sunlight_hours": 8,
                "irrigation_type": "Drip",
                "fertilizer_type": "Organic",
                "pesticide_usage_ml": 50,
                "total_days": 120,
                "NDVI_index": 0.75,
                "crop_type": "Wheat",
                "region": "North India",
                "crop_disease_status": "Healthy",
            };

            try {
                const response = await fetch('http://localhost:8000/api/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(inpData)
                    
                });

                if (response.ok) {
                    const data = await response.json();
                    setYeild(data.predicted_yield_kg_per_hectare);
                } else {
                    const errorBody = await response.json();
                    console.error('Yield prediction error:', response.statusText, errorBody);
                }
            } catch (error) {
                console.error('Fetch error (yield):', error);
            }
        };

        const alertFetch = async () => {
            const formData = {
                "day_of_year": 200,
                "min": -0.9,
                "max": 0.95,
                "stDev": 0.25,
                "sampleCount": 5800,
                "noDataCount": 2200,
                "median": 0.3,
                "p10": -0.1,
                "p90": 0.7,
                "cloud_coverage_percent": 35.0
            };

            try {
                const response = await axios.post("http://localhost:8000/predict-ndvi", {
                    ...formData,
                    day_of_year: parseInt(formData.day_of_year),
                    min_ndvi: parseFloat(formData.min),
                    max_ndvi: parseFloat(formData.max),
                    stdev_ndvi: parseFloat(formData.stDev),
                    cloud_coverage_percent: parseFloat(formData.cloud_coverage_percent)
                });

                const data = response.data;
                console.log("Anomaly prediction response:", data);
                setAlertStatus(data.anomaly_detected);
                setAlertScore(data.anomaly_score);
                setNdviData(data.predicted_ndvi_mean);
            } catch (err) {
                console.error('Anomaly prediction error:', err);
            }
        };

        alertFetch();
        getYeild();
    }, []);


    return (
        <div>
            <div className="ndvi-container">
                <h1>Select Area for NDVI Analysis</h1>
                <div className="map-container">
                    <MapDetails onAreaSelected={handleAreaSelected} />
                    {area && (
                        <div>
                            <h3>Selected Bounding Box:</h3>
                            <pre>{JSON.stringify(area, null, 2)}</pre>
                        </div>
                    )}
                </div>
            </div>

            <div className='alert-container'>
                <h1>Alert</h1>
                <div className='alert-box'>
                    <h2>Anomaly Behavior Predictor:</h2>
                    <p>{!alertStatus ? "No alerts" : (<div className='alerts'>
                        <p>Anomaly Score: {alertScore}</p>
                        <p>NDVI Value: {ndviData}</p>
                    </div>)}</p>
                </div>
            </div>

            <div className='yield-container'>
                <h1>Yield Prediction</h1>
                <div className='yield-box'>
                    <h2>Predicted Yield:</h2>
                    <p>{yeild !== null ? `${parseFloat(yeild).toFixed(3)} kg/ha` : "Loading..."}</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
