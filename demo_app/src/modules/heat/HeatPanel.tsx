import { useState, useMemo } from 'react';
import { solveForcedConvection, type HeatInput } from '../../lib/physics/heat/solver';
import { HeatContent } from './heatContent';
import { HeatPresets } from './heatPresets';

export function HeatPanel() {
  const [input, setInput] = useState<HeatInput>(HeatPresets["Water Pipe (Turbulent)"]);

  const result = useMemo(() => solveForcedConvection(input), [input]);

  return (
    <div className="module-grid">
      {/* 1. Solve Surface */}
      <section className="glass-panel">
        <h2>Input / Solve</h2>
        <div className="input-group">
          <label>Engineering Preset</label>
          <select 
            onChange={e => setInput(HeatPresets[e.target.value])}
          >
            {Object.keys(HeatPresets).map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>

        <div className="input-group">
          <label>Fluid Velocity [m/s]</label>
          <input 
            type="number" 
            value={input.velocity_m_s} 
            onChange={e => setInput({...input, velocity_m_s: Number(e.target.value)})} 
          />
        </div>

        <div className="input-group">
          <label>Pipe Diameter [m]</label>
          <input 
            type="number" 
            value={input.diameter_m} 
            onChange={e => setInput({...input, diameter_m: Number(e.target.value)})} 
          />
        </div>

        <hr style={{ borderColor: 'var(--border-light)', margin: '1.5rem 0' }} />

        <h3>Results</h3>
        {result.status === "invalid" ? (
          <div className="badge badge-invalid">Invalid Inputs</div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <span className={`badge badge-${result.status}`}>
                 Model: {result.meta?.correlation_used}
              </span>
              <span className={`badge badge-${result.status}`}>
                 Regime: {result.meta?.regime}
              </span>
            </div>
            
            <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
              {result.outputs?.h_W_m2K.toFixed(2)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>W/m²K</span>
            </div>

            {result.warnings.length > 0 && (
              <div style={{ marginTop: '1rem', color: 'var(--status-warning)', fontSize: '0.9rem' }}>
                <strong>Warning:</strong> {result.warnings.join(' ')}
              </div>
            )}
          </>
        )}
      </section>

      {/* 2. Physics Explainer */}
      <section className="glass-panel">
        <h2>{HeatContent.explainer.title}</h2>
        <p className="text-muted">{HeatContent.explainer.description}</p>
        
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', margin: '1rem 0', fontFamily: 'monospace', color: 'var(--accent-primary)' }}>
          {HeatContent.explainer.equation}
        </div>

        <div style={{ marginTop: '1rem' }}>
          <h4>Glossary</h4>
          {HeatContent.glossary.map(g => (
            <div key={g.symbol} style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <strong style={{ color: 'var(--text-main)' }}>{g.symbol}</strong>: <span className="text-muted">{g.description}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Intuition Surface */}
      <section className="glass-panel">
        <h2>Regime Intuition</h2>
        <p className="text-muted">
          Watch how changing velocity pushes the fluid properties through the flow regimes.
        </p>
        
        {Object.entries(HeatContent.regimes).map(([regime, desc]) => {
           const isActive = result.meta?.regime === regime;
           return (
             <div key={regime} style={{ 
               padding: '1rem', 
               margin: '0.5rem 0',
               borderRadius: '8px',
               border: `1px solid ${isActive ? 'var(--accent-primary)' : 'var(--border-light)'}`,
               background: isActive ? 'var(--accent-glow)' : 'transparent',
               transition: 'all 0.3s ease'
             }}>
               <h4 style={{ margin: '0 0 0.5rem 0', textTransform: 'capitalize' }}>{regime}</h4>
               <p style={{ margin: 0, fontSize: '0.85rem' }} className={isActive ? '' : 'text-muted'}>{desc}</p>
             </div>
           );
        })}
      </section>

    </div>
  );
}
