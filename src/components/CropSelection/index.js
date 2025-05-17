// Smart Crop Managment App\smart-crop-management-frontend\src\components\Dashboard\Soil.jsx

import React, { useState } from 'react';

export default function CropSelection() {
    const [recommendation, setRecommendation] = useState(null);
    const [nitrogen, setNitrogen] = useState('');
    const [phosphorus, setPhosphorus] = useState('');
    const [potassium, setPotassium] = useState('');
    const [numCrops, setNumCrops] = useState(3); // Default to 3



    const getCropRecommendation = async () => {
        try {
            console.log("Fetching...")
            const response = await fetch('http://localhost:5000/recommend-crop', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    N: parseFloat(nitrogen),
                    P: parseFloat(phosphorus),
                    K: parseFloat(potassium),
                    count: parseInt(numCrops)
                })
            });

            const data = await response.json();
            setRecommendation(data);
        } catch (error) {
            console.error('Error fetching crop recommendation:', error);
        }
    };

    return (
        <div className=" min-h-screengrid  grid-cols-1 md:grid-cols-2 gap-4 my-6 mx-40">


            <div className="bg-white p-4 rounded-lg shadow">
                {/* <h3 className="text-xl font-semibold mb-2">🌱 Soil Analysis</h3>
                {soil && (
                    <div className="space-y-2 mb-4">
                        <p>pH Level: {soil.ph}</p>
                        <p>Nitrogen: {soil.nitro} mg/kg</p>
                        <p>Moisture: {soil.moisture}%</p>
                    </div>
                )} */}

                <div className="space-y-2 mb-4">
                    <label className="block font-medium">Nitrogen (N):</label>
                    <input
                        type="number"
                        value={nitrogen}
                        onChange={(e) => setNitrogen(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Enter nitrogen level (mg/kg)"
                    />

                    <label className="block font-medium">Phosphorus (P):</label>
                    <input
                        type="number"
                        value={phosphorus}
                        onChange={(e) => setPhosphorus(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Enter phosphorus level (mg/kg)"
                    />

                    <label className="block font-medium">Potassium (K):</label>
                    <input
                        type="number"
                        value={potassium}
                        onChange={(e) => setPotassium(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Enter potassium level (mg/kg)"
                    />

                    <label className="block font-medium mt-4">Number of Crops:</label>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={numCrops}
                        onChange={(e) => setNumCrops(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Enter number of crop suggestions"
                    />
                </div>

                <button
                    onClick={getCropRecommendation}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Get Crop Recommendation
                </button>


                {recommendation && (
                    <div className="mt-6 bg-white p-4 rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-2">🌾 Recommended Crops</h3>
                        <ul className="list-disc list-inside">
                            {recommendation.recommended_crops.map((crop, index) => (
                                <li key={index}>{crop}</li>
                            ))}
                        </ul>

                        <div className="mt-4">
                            <p>🌡️ Temperature: {recommendation.temperature}°C</p>
                            <p>💧 Humidity: {recommendation.humidity}%</p>
                            <p>🧪 Soil pH: {recommendation.ph}</p>
                            <p>🌧️ Rainfall: {recommendation.rainfall} mm</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}