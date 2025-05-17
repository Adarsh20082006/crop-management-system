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
        <div style={{
            padding: '32px',
            maxWidth: '420px',
            margin: '40px auto',
            background: '#f7fafc',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
        }}>
            <h2 style={{ textAlign: 'center', color: '#2d3748', marginBottom: '24px' }}>Soil Fertility Predictor</h2>
            <form className='' onSubmit={handleSubmit}>
                {Object.keys(formData).map((key) => (
                    <div key={key} style={{ marginBottom: '18px', display: 'flex', flexDirection: 'column' }}>
                        <label style={{ marginBottom: '6px', fontWeight: 500, color: '#4a5568' }}>{key.replace(/_/g, ' ')}:</label>
                        <input
                            type="text"
                            name={key}
                            value={formData[key]}
                            onChange={handleChange}
                            required
                            style={{
                                padding: '8px 10px',
                                border: '1px solid #cbd5e0',
                                borderRadius: '6px',
                                fontSize: '15px',
                                outline: 'none',
                                transition: 'border 0.2s',
                            }}
                        />
                    </div>
                ))}
                <button
                    type="submit"
                    style={{
                        width: '100%',
                        padding: '10px 0',
                        background: '#3182ce',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 600,
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = '#2b6cb0'}
                    onMouseOut={e => e.currentTarget.style.background = '#3182ce'}
                >
                    Predict Fertility
                </button>
            </form>

            {result && (
                <div style={{
                    marginTop: '28px',
                    padding: '16px',
                    background: '#e6fffa',
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: '#234e52',
                    fontWeight: 600,
                    fontSize: '18px'
                }}>
                    <h3>Predicted Fertility Level: {result}</h3>
                </div>
            )}
        </div>
    );
}

export default SoilHealthMonitor;
