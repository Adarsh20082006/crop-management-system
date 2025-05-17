import { Link } from 'react-router-dom'

import './index.css'

const Navbar = () => {
    return (
        <div className="navbar-container">
            <div className="navbar">
                <h1>Smart Crop</h1>
                <ul className="nav-links">
                    <Link to='/'><li>Dashboard</li></Link>
                    <Link to='/irrigation-planner'><li>Irrigation</li></Link>
                    <Link to='/soil-health-monitor'><li>Soil Health analysis</li></Link>
                    <Link to='/disease-identification'><li>Disease Identification</li></Link>
                    <Link to='/crop-selection'><li>Crop Prediction</li></Link>
                </ul>
            </div>
        </div>
    )
}

export default Navbar;