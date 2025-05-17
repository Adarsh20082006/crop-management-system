




import React, { useState } from 'react';
// import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
// const genAI = new GoogleGenerativeAI("AIzaSyByNSVZoQUmxRlmtzASIl9g8qzGXbYuheM"); // 🔁 Replace with your actual Gemini API key

export default function DiseaseIdentification() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [loadingSolution, setLoadingSolution] = useState(false);

  // Upload image and get crop health status from local backend
  async function analyzeCropHealth(formData) {
    const response = await fetch('http://localhost:5001/analyze', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Server error');
    }

    return response.json();
  }

  // Fetch treatment plan using Gemini API
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert('Please upload an image first!');

    setError(null);
    setResult(null);
    setSolutions([]);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await analyzeCropHealth(formData);
      setResult(response);
    } catch (err) {
      setError(err.message || 'Error analyzing image');
    }
  };

  
      
      // Convert response into bullet points
     

  // const isDiseaseDetected = result && !result.healthStatus.toLowerCase().includes("healthy");

  return (
    <div className="bg-white p-4 rounded-lg shadow max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4">🌾 Crop Health Analysis</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Analyze
        </button>
      </form>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {result && (
        <div className="mt-4 p-2 bg-gray-50 rounded">
          <p><strong>Status:</strong> {result.healthStatus}</p>
          <p><strong>Disease Possibility:</strong> {result.confidence}%</p>
        </div>
      )}

      {/* {isDiseaseDetected && (
        <div className="mt-4">
          <button
            // onClick={handleGetSolutions}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loadingSolution}
          >
            {loadingSolution ? 'Fetching solution...' : '💡 Show Treatment Solution'}
          </button>
        </div>
      )} */}

      {solutions.length > 0 && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <h4 className="font-semibold mb-2">🧪 Treatment Instructions:</h4>
          <ul className="list-disc ml-6 space-y-1">
            {solutions.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}



;