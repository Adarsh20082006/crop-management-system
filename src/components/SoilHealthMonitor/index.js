import React, { useState } from 'react';
import axios from 'axios';

function SoilHealthMonitor() {
    const [formData, setFormData] = useState({
        pH: '',
        EC: '',
        Organic_Carbon: '',
        Nitrogen: '',
        Phosphorus: '',
        Potassium: '',
        Moisture: '',
        Texture: ''
    });

    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/predict_fertility', {
                ...formData,
                pH: parseFloat(formData.pH),
                EC: parseFloat(formData.EC),
                Organic_Carbon: parseFloat(formData.Organic_Carbon),
                Nitrogen: parseFloat(formData.Nitrogen),
                Phosphorus: parseFloat(formData.Phosphorus),
                Potassium: parseFloat(formData.Potassium),
                Moisture: parseFloat(formData.Moisture),
            });
            setResult(response.data.fertility_level);
        } catch (error) {
            console.error(error);
            setResult("Error fetching prediction");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Soil Fertility Predictor</h2>
            <form onSubmit={handleSubmit}>
                {Object.keys(formData).map((key) => (
                    <div key={key} style={{ marginBottom: '10px' }}>
                        <label>{key}:</label>
                        <input
                            type="text"
                            name={key}
                            value={formData[key]}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}
                <button type="submit">Predict Fertility</button>
            </form>

            {result && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Predicted Fertility Level: {result}</h3>
                </div>
            )}
        </div>
    );
}

export default SoilHealthMonitor;
