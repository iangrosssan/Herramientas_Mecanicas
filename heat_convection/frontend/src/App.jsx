import React, { useState, useEffect, useMemo } from 'react';
import {
  Thermometer, Wind, Layers, Activity,
  Info, ChevronRight, Droplets, Zap,
  Ruler, ArrowDownUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { FLUIDS, getDerivedProps } from './physics/properties';
import { re as calcRe } from './physics/functions';
import {
  MATERIALS, circularProfile, rectangularProfile, solveBeam
} from './physics/deflection';

/* ─── Reusable Components ─── */
const NavItem = ({ id, active, label, icon: Icon, onClick }) => (
  <div className={`nav-item ${active === id ? 'active' : ''}`} onClick={() => onClick(id)}>
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

const ResultCard = ({ label, value, unit }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card"
    style={{ padding: '1.2rem', marginBottom: 0, textAlign: 'center' }}
  >
    <div style={{ fontSize: '0.75rem', color: '#8b949e', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {label}
    </div>
    <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#00a3ff' }}>
      {value}
      <span style={{ fontSize: '0.8rem', color: '#8b949e', marginLeft: '4px' }}>{unit}</span>
    </div>
  </motion.div>
);

/* ─── Fluid Properties Panel ─── */
function PropertiesPanel() {
  const [fluidType, setFluidType] = useState('water');
  const [temp, setTemp] = useState(25);

  const props = useMemo(() => {
    const fluid = FLUIDS[fluidType];
    if (!fluid) return null;
    try { return getDerivedProps(fluid, temp); }
    catch { return null; }
  }, [fluidType, temp]);

  return (
    <div className="animate-fade">
      <div className="glass-card">
        <h3>Propiedades de Fluidos</h3>
        <p style={{ color: '#8b949e', marginTop: '4px' }}>
          Propiedades termofísicas a una temperatura específica.
        </p>
        <div className="form-grid">
          <div className="input-group">
            <label>Tipo de Fluido</label>
            <select value={fluidType} onChange={(e) => setFluidType(e.target.value)}>
              <option value="water">Agua (Líquida)</option>
              <option value="air">Aire (Seco)</option>
            </select>
          </div>
          <div className="input-group">
            <label>Temperatura ({fluidType === 'air' ? 'K' : '°C'})</label>
            <input type="number" value={temp} onChange={(e) => setTemp(parseFloat(e.target.value) || 0)} />
          </div>
        </div>
      </div>
      {props && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <PropertyCard label="Densidad (ρ)"        value={props.rho} unit="kg/m³" icon={Activity} />
          <PropertyCard label="Viscosidad (μ)"       value={props.mu}  unit="Pa·s"  icon={Droplets} />
          <PropertyCard label="Calor Esp. (Cp)"      value={props.cp}  unit="J/kg·K" icon={Zap} />
          <PropertyCard label="Conductividad (k)"    value={props.k}   unit="W/m·K" icon={Thermometer} />
          <PropertyCard label="Visc. Cinemática (ν)" value={props.nu}  unit="m²/s"  icon={Wind} />
          <PropertyCard label="Número de Prandtl"    value={props.pr}  unit="—"     icon={Layers} />
        </div>
      )}
    </div>
  );
}

/* ─── Reynolds Panel ─── */
function ReynoldsPanel() {
  const [u, setU]   = useState(2);
  const [L, setL]   = useState(0.5);
  const [nu, setNu] = useState(1.004e-6);

  const Re = useMemo(() => calcRe(u, L, nu), [u, L, nu]);
  const regime = Re < 5e5 ? 'Laminar' : 'Turbulento';

  return (
    <div className="animate-fade">
      <div className="glass-card">
        <h3>Número de Reynolds</h3>
        <p style={{ color: '#8b949e', marginTop: '4px' }}>Clasificación de régimen de flujo.</p>
        <div className="form-grid">
          <div className="input-group">
            <label>Velocidad u (m/s)</label>
            <input type="number" step="0.1" value={u} onChange={(e) => setU(parseFloat(e.target.value) || 0)} />
          </div>
          <div className="input-group">
            <label>Longitud L (m)</label>
            <input type="number" step="0.01" value={L} onChange={(e) => setL(parseFloat(e.target.value) || 0)} />
          </div>
          <div className="input-group">
            <label>Visc. Cinemática ν (m²/s)</label>
            <input type="number" step="1e-7" value={nu} onChange={(e) => setNu(parseFloat(e.target.value) || 1e-10)} />
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <ResultCard label="Reynolds (Re)" value={Re.toExponential(4)} unit="" />
        <ResultCard label="Régimen" value={regime} unit="" />
      </div>
    </div>
  );
}

/* ─── Deflection Panel ─── */
function DeflectionPanel() {
  const [matKey, setMatKey]       = useState('AISI4140');
  const [profileType, setProfile] = useState('circular');
  const [diameter, setDiameter]   = useState(0.05);
  const [width, setWidth]         = useState(0.05);
  const [height, setHeight]       = useState(0.1);
  const [length, setLength]       = useState(1.0);
  const [loadMag, setLoadMag]     = useState(1000);
  const [loadPos, setLoadPos]     = useState(0.5);

  const result = useMemo(() => {
    const profile = profileType === 'circular'
      ? circularProfile(diameter)
      : rectangularProfile(width, height);

    return solveBeam({
      length,
      material: matKey,
      profile,
      loads: [{ type: 'point', magnitude: loadMag, position: loadPos }],
    });
  }, [matKey, profileType, diameter, width, height, length, loadMag, loadPos]);

  return (
    <div className="animate-fade">
      <div className="glass-card">
        <h3>Deflexión de Vigas</h3>
        <p style={{ color: '#8b949e', marginTop: '4px' }}>
          Análisis de deflexión para vigas simplemente apoyadas bajo carga puntual.
        </p>
        <div className="form-grid">
          <div className="input-group">
            <label>Material</label>
            <select value={matKey} onChange={(e) => setMatKey(e.target.value)}>
              {Object.entries(MATERIALS).map(([k, v]) => (
                <option key={k} value={k}>{v.name}</option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>Perfil</label>
            <select value={profileType} onChange={(e) => setProfile(e.target.value)}>
              <option value="circular">Circular</option>
              <option value="rectangular">Rectangular</option>
            </select>
          </div>
          {profileType === 'circular' ? (
            <div className="input-group">
              <label>Diámetro (m)</label>
              <input type="number" step="0.005" value={diameter} onChange={(e) => setDiameter(parseFloat(e.target.value) || 0.01)} />
            </div>
          ) : (
            <>
              <div className="input-group">
                <label>Ancho (m)</label>
                <input type="number" step="0.005" value={width} onChange={(e) => setWidth(parseFloat(e.target.value) || 0.01)} />
              </div>
              <div className="input-group">
                <label>Altura (m)</label>
                <input type="number" step="0.005" value={height} onChange={(e) => setHeight(parseFloat(e.target.value) || 0.01)} />
              </div>
            </>
          )}
          <div className="input-group">
            <label>Longitud (m)</label>
            <input type="number" step="0.1" value={length} onChange={(e) => setLength(parseFloat(e.target.value) || 0.1)} />
          </div>
          <div className="input-group">
            <label>Carga Puntual (N)</label>
            <input type="number" step="100" value={loadMag} onChange={(e) => setLoadMag(parseFloat(e.target.value) || 0)} />
          </div>
          <div className="input-group">
            <label>Posición de Carga (m)</label>
            <input type="number" step="0.05" value={loadPos}
              min={0} max={length}
              onChange={(e) => setLoadPos(parseFloat(e.target.value) || 0)} />
          </div>
        </div>
      </div>

      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <ResultCard label="Deflexión Máx." value={result.summary.maxDeflection_mm.toFixed(4)} unit="mm" />
          <ResultCard label="Posición" value={result.summary.maxDeflectionAt_m.toFixed(3)} unit="m" />
          <ResultCard label="Pendiente Máx." value={result.summary.maxSlope_deg.toFixed(4)} unit="°" />
          <ResultCard label="Elongación Máx." value={result.summary.maxElongation_mm.toFixed(4)} unit="mm" />
        </div>
      )}
    </div>
  );
}

/* ─── Main App ─── */
function App() {
  const [activeTab, setActiveTab] = useState('properties');

  const TABS = {
    properties: { label: 'Propiedades de Fluidos', icon: Thermometer },
    reynolds:   { label: 'Número de Reynolds',     icon: Wind },
    deflection: { label: 'Deflexión de Vigas',     icon: Ruler },
  };

  const titles = {
    properties: 'Propiedades de Fluidos',
    reynolds:   'Números Adimensionales',
    deflection: 'Deflexión de Vigas',
  };

  const renderPanel = () => {
    switch (activeTab) {
      case 'properties': return <PropertiesPanel />;
      case 'reynolds':   return <ReynoldsPanel />;
      case 'deflection': return <DeflectionPanel />;
      default:           return <div className="glass-card"><h3>En Desarrollo</h3><p>Este módulo está en desarrollo.</p></div>;
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
          {Object.entries(TABS).map(([id, { label, icon }]) => (
            <NavItem key={id} id={id} active={activeTab} label={label} icon={icon} onClick={setActiveTab} />
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', fontSize: '0.8rem', color: '#8b949e' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={14} />
            <span>MecaToolbox Demo v1.0</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <h1>{titles[activeTab] || activeTab}</h1>
          <p>Suite de herramientas de ingeniería mecánica — cálculos en tiempo real.</p>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderPanel()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
