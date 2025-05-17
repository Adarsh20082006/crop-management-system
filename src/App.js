import { Routes, Route, BrowserRouter } from 'react-router-dom';
import IrrigationPlanner from './components/IrrigationPlanner';
import CropSelection from './components/CropSelection';
import Dashboard from './components/Dashboard';
import DiseaseIdentification from './components/DiseaseIdentification';
import SoilHealthMonitor from './components/SoilHealthMonitor';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/irrigation-planner" element={<IrrigationPlanner />} />
        <Route path="/crop-selection" element={<CropSelection />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/disease-identification" element={<DiseaseIdentification />} />
        <Route path="/soil-health-monitor" element={<SoilHealthMonitor />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
