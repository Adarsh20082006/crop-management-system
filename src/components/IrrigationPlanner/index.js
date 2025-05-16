import React, { useState } from 'react';
import axios from 'axios';

function IrrigationPlanner() {
    const [formData, setFormData] = useState({
        NDVI_mean: '',
        NDWI_mean: '',
        Temperature: '',
        Humidity: '',
        Wind_Speed: '',
        Cloud_Cover: '',
        Pressure: ''
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

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
        <div className="irrigationPlanner">
            <h1>Irrigation Prediction</h1>
            <form onSubmit={handleSubmit}>
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
                <button type="submit" disabled={loading}>
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
