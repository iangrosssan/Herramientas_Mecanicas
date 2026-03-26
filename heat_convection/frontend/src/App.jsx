import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Thermometer,
  Wind,
  Layers,
  Activity,
  Info,
  ChevronRight,
  Droplets,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = "http://localhost:8000";

const NavItem = ({ id, active, label, icon: Icon, onClick }) => (
  <div
    className={`nav-item ${active === id ? 'active' : ''}`}
    onClick={() => onClick(id)}
  >
    <Icon size={20} />
    <span>{label}</span>
    {active === id && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
  </div>
);

const PropertyCard = ({ label, value, unit, icon: Icon }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="glass-card"
    style={{ padding: '1.5rem', marginBottom: 0 }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8b949e', marginBottom: '8px' }}>
      <Icon size={16} />
      <span style={{ fontSize: '0.8rem' }}>{label}</span>
    </div>
    <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>
      {typeof value === 'number' ? value.toPrecision(5) : value}
      <span style={{ fontSize: '0.9rem', color: '#8b949e', marginLeft: '4px' }}>{unit}</span>
    </div>
  </motion.div>
);

function App() {
  const [activeTab, setActiveTab] = useState('properties');
  const [fluidType, setFluidType] = useState('water');
  const [temp, setTemp] = useState(25);
  const [props, setProps] = useState(null);
  const [loading, setLoading] = useState(false);

  // Auto-calculate properties
  useEffect(() => {
    const fetchProps = async () => {
      setLoading(true);
      try {
        const res = await axios.post(`${API_BASE}/properties`, {
          fluid_type: fluidType,
          temp: temp
        });
        setProps(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchProps, 300);
    return () => clearTimeout(timeoutId);
  }, [fluidType, temp]);

  const renderTool = () => {
    switch (activeTab) {
      case 'properties':
        return (
          <div className="animate-fade">
            <div className="glass-card">
              <h3>Fluid Properties</h3>
              <p style={{ color: '#8b949e', marginTop: '4px' }}>Analyze thermophysical properties at a specific temperature.</p>

              <div className="form-grid">
                <div className="input-group">
                  <label>Fluid Type</label>
                  <select value={fluidType} onChange={(e) => setFluidType(e.target.value)}>
                    <option value="water">Water (Liquid)</option>
                    <option value="air">Air (Dry)</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Temperature (°C / K)</label>
                  <input
                    type="number"
                    value={temp}
                    onChange={(e) => setTemp(parseFloat(e.target.value))}
                  />
                </div>
              </div>

              {loading && <div style={{ marginTop: '1rem', color: '#00a3ff' }}>Calculating...</div>}
            </div>

            {props && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <PropertyCard label="Density (ρ)" value={props.rho} unit="kg/m³" icon={Activity} />
                <PropertyCard label="Viscosity (μ)" value={props.mu} unit="Pa·s" icon={Droplets} />
                <PropertyCard label="Spec. Heat (Cp)" value={props.cp} unit="J/kg·K" icon={Zap} />
                <PropertyCard label="Conductivity (k)" value={props.k} unit="W/m·K" icon={Thermometer} />
                <PropertyCard label="Kin. Viscosity (ν)" value={props.nu} unit="m²/s" icon={Wind} />
                <PropertyCard label="Prandtl No. (Pr)" value={props.pr} unit="-" icon={Layers} />
              </div>
            )}
          </div>
        );
      case 'reynolds':
        return <div className="glass-card"><h3>Reynolds Tool</h3><p>Coming soon: Reynolds number calculator with flow regime detection.</p></div>;
      default:
        return <div className="glass-card"><h3>Feature Coming Soon</h3><p>This module is currently under development.</p></div>;
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo-area">
          <Layers size={28} color="#00a3ff" />
          <span>MecaToolbox</span>
        </div>

        <nav className="nav-links">
          <NavItem id="properties" active={activeTab} label="Fluid Properties" icon={Thermometer} onClick={setActiveTab} />
          <NavItem id="reynolds" active={activeTab} label="Dimensionless No." icon={Wind} onClick={setActiveTab} />
          <NavItem id="boundary" active={activeTab} label="Boundary Layers" icon={Layers} onClick={setActiveTab} />
          <NavItem id="convection" active={activeTab} label="Convection" icon={Activity} onClick={setActiveTab} />
        </nav>

        <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', fontSize: '0.8rem', color: '#8b949e' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={14} />
            <span>Heat Convention v1.0</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('_', ' ')}</h1>
          <p>Professional engineering calculation toolkit for fluid dynamics and heat transfer.</p>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderTool()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
