import React, { useState } from 'react';
import MapDetails from '../MapDetails';

function Dashboard() {
    const [area, setArea] = useState(null);

    const handleAreaSelected = (coords) => {
        setArea(coords);
        // 👉 You can now send this to your FastAPI backend!
    };

    return (
        <div>
            <h1>Select Area for NDVI Analysis</h1>
            <MapDetails onAreaSelected={handleAreaSelected} />
            {area && (
                <div>
                    <h3>Selected Bounding Box:</h3>
                    <pre>{JSON.stringify(area, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
