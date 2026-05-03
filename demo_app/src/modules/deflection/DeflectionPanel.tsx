import { useState, useMemo } from 'react';
import { solveDeflection, type DeflectionInput } from '../../lib/physics/deflection/solver';
import { DeflectionContent } from './deflectionContent';
import { DeflectionPresets } from './deflectionPresets';

export function DeflectionPanel() {
  const [input, setInput] = useState<DeflectionInput>(DeflectionPresets["Steel Shaft (Simply Supported)"]);

  const result = useMemo(() => solveDeflection(input), [input]);

  return (
    <div className="module-grid">
      <section className="glass-panel">
        <h2>Input / Solve</h2>
        <div className="input-group">
          <label>Structural Preset</label>
          <select onChange={e => setInput(DeflectionPresets[e.target.value])}>
            {Object.keys(DeflectionPresets).map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>

        <div className="input-group">
          <label>Beam Length [m]</label>
          <input type="number" 
                 value={input.L_m} 
                 onChange={e => setInput({...input, L_m: Number(e.target.value)})} />
        </div>

        <div className="input-group">
          <label>Central Point Load Magnitude [N]</label>
          <input type="number" 
                 value={input.loads[0].magnitude_N} 
                 onChange={e => {
                   const newLoads = [...input.loads];
                   newLoads[0].magnitude_N = Number(e.target.value);
                   setInput({...input, loads: newLoads});
                 }} />
        </div>

        <hr style={{ borderColor: 'var(--border-light)', margin: '1.5rem 0' }} />

        <h3>Results</h3>
        {result.status === "invalid" ? (
          <div className="badge badge-invalid">Invalid System setup</div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
               <span className={`badge badge-valid`}>
                 {result.meta?.case_id.toUpperCase()}
               </span>
               {result.meta?.is_statically_determinate && (
                 <span className={`badge badge-valid`}>Determinate</span>
               )}
            </div>
            
            <div style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Max Deflection:</div>
            <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
              {(result.outputs!.max_deflection_m * 1000).toFixed(3)} <span style={{ fontSize: '1rem' }}>mm</span>
            </div>

            <div style={{ fontSize: '1rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Max Bending Moment:</div>
            <div style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>
              {result.outputs?.max_moment_Nm.toFixed(1)} <span style={{ fontSize: '1rem' }}>N·m</span>
            </div>
          </>
        )}
      </section>

      <section className="glass-panel">
        <h2>{DeflectionContent.explainer.title}</h2>
        <p className="text-muted">{DeflectionContent.explainer.description}</p>

        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', margin: '1rem 0', fontFamily: 'monospace', color: 'var(--accent-primary)' }}>
          {DeflectionContent.explainer.equation}
        </div>

        <h4>Underlying Assumptions</h4>
        <ul style={{ paddingLeft: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {DeflectionContent.explainer.assumptions.map(a => <li key={a}>{a}</li>)}
        </ul>

        <div style={{ marginTop: '1rem' }}>
          <h4>Glossary</h4>
          {DeflectionContent.glossary.map(g => (
            <div key={g.symbol} style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <strong style={{ color: 'var(--text-main)' }}>{g.symbol}</strong>: <span className="text-muted">{g.description}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-panel">
        <h2>Intuition Visuals</h2>
        <p className="text-muted">
          Support Configurations
        </p>

        {Object.entries(DeflectionContent.supportTypes).map(([type, desc]) => {
           const isActive = input.support_type === type;
           return (
             <div key={type} style={{ 
               padding: '1rem', 
               margin: '0.5rem 0',
               borderRadius: '8px',
               border: `1px solid ${isActive ? 'var(--accent-primary)' : 'var(--border-light)'}`,
               background: isActive ? 'var(--accent-glow)' : 'transparent',
               transition: 'all 0.3s ease'
             }}>
               <h4 style={{ margin: '0 0 0.5rem 0', textTransform: 'capitalize' }}>{type.replace('_', ' ')}</h4>
               <p style={{ margin: 0, fontSize: '0.85rem' }} className={isActive ? '' : 'text-muted'}>{desc}</p>
             </div>
           );
        })}
      </section>
    </div>
  );
}
