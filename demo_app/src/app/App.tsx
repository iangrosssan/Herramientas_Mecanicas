import { useState } from 'react';
import { Dashboard } from './Dashboard';
import { HeatPanel } from '../modules/heat/HeatPanel';
import { DeflectionPanel } from '../modules/deflection/DeflectionPanel';
import '../index.css';

export function App() {
  const [route, setRoute] = useState<string>('home');

  const renderCurrent = () => {
    switch (route) {
      case 'heat': return <HeatPanel />;
      case 'deflection': return <DeflectionPanel />;
      default: return <Dashboard onNav={setRoute} />;
    }
  };

  return (
    <>
      {route !== 'home' && (
        <nav style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <span 
            style={{ fontWeight: 600, cursor: 'pointer', color: 'var(--text-main)' }} 
            onClick={() => setRoute('home')}
          >
             ← MecaToolbox
          </span>
          <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
             <span style={{ cursor: 'pointer', color: route === 'heat' ? 'var(--accent-primary)' : 'inherit' }} onClick={() => setRoute('heat')}>Heat Convection</span>
             <span style={{ cursor: 'pointer', color: route === 'deflection' ? 'var(--accent-primary)' : 'inherit' }} onClick={() => setRoute('deflection')}>Deflection</span>
          </div>
        </nav>
      )}
      <main>
        {renderCurrent()}
      </main>
    </>
  );
}
