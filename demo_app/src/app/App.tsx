import { useState } from 'react';
import { Dashboard } from './Dashboard';
import { HeatPanel } from '../modules/heat/HeatPanel';
import { DeflectionPanel } from '../modules/deflection/DeflectionPanel';
// @ts-expect-error - JSX component imported into TSX
import MysteryShell from '@shared/MysteryShell.jsx';
import { Layers, Thermometer, Ruler, ChevronDown, ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../index.css';

const NavItem = ({ id, active, label, icon: Icon, onClick }: any) => (
  <div className={`section-item ${active === id ? 'active' : ''}`} onClick={() => onClick(id)}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Icon size={20} />
      <span className="repo-text">{label}</span>
    </div>
    <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: active === id ? 1 : 0, transition: 'opacity 0.2s' }} />
  </div>
);

export function App() {
  const [activeTab, setActiveTab] = useState('home');

  const TABS = {
    home:       { label: 'Dashboard', icon: Layers },
    heat:       { label: 'Heat Convection', icon: Thermometer },
    deflection: { label: 'Beam Deflection', icon: Ruler },
  };

  const titles = {
    home:       'MecaToolbox Demo',
    heat:       'Heat Convection Validator',
    deflection: 'Beam Deflection Euler Mechanics',
  };

  const renderPanel = () => {
    switch (activeTab) {
      case 'home': return <Dashboard onNav={setActiveTab} />;
      case 'heat': return <HeatPanel />;
      case 'deflection': return <DeflectionPanel />;
      default: return <Dashboard onNav={setActiveTab} />;
    }
  };

  return (
    <MysteryShell>
      <aside className="sidebar">
        <nav className="panel">
          <div className="logo-area" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.2rem', fontWeight: 700, background: 'linear-gradient(to right, var(--accent-secondary), #7000ff)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            <Layers size={28} color="#00a3ff" />
            <span>MecaToolbox</span>
          </div>

          <details className="mobile-dropdown" open={window.innerWidth > 900}>
            <summary className="mobile-only">
              <span>{(titles as any)[activeTab] || 'Herramientas'}</span>
              <div className="dropdown-chevron"><ChevronDown size={14} /></div>
            </summary>
            <div className="subnav">
              {Object.entries(TABS).map(([id, { label, icon }]) => (
                <NavItem key={id} id={id} active={activeTab} label={label} icon={icon} onClick={(selectedId: string) => {
                  setActiveTab(selectedId);
                  const details = document.querySelector('.mobile-dropdown');
                  if (details && window.innerWidth <= 900) {
                    details.removeAttribute('open');
                  }
                }} />
              ))}
            </div>
          </details>

          <div className="desktop-only" style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', fontSize: '0.8rem', color: '#8b949e' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={14} />
              <span>MecaToolbox Demo v1.0</span>
            </div>
          </div>
        </nav>
      </aside>

      <main className="panel content-panel">
        <header className="header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 className="hero-title">{(titles as any)[activeTab] || activeTab}</h1>
          <p style={{ color: 'var(--muted)' }}>High-trust, interactive engineering static solver demo.</p>
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
    </MysteryShell>
  );
}
