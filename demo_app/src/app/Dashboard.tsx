export function Dashboard({ onNav }: { onNav: (route: string) => void }) {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>MecaToolbox <span style={{ color: 'var(--accent-primary)' }}>Demo</span></h1>
        <p className="text-muted" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          An interactive, validated scientific explainer. Select a governed module to compute canonical setups entirely in your browser.
        </p>
        <div style={{ marginTop: '1.5rem' }}>
          <span className="badge badge-warning">Tier-A Modules Only</span>
          <span className="badge badge-valid" style={{ marginLeft: '0.5rem' }}>Full Unit Safety</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div 
          className="glass-panel" 
          style={{ cursor: 'pointer', textAlign: 'center' }}
          onClick={() => onNav('heat')}
        >
          <h2>Heat Convection</h2>
          <p className="text-muted">Validate canonical forced convection systems against empirical limits.</p>
        </div>

        <div 
          className="glass-panel" 
          style={{ cursor: 'pointer', textAlign: 'center' }}
          onClick={() => onNav('deflection')}
        >
          <h2>Beam Deflection</h2>
          <p className="text-muted">Compute exact Euler-Bernoulli mechanics for determinate static beams.</p>
        </div>
      </div>
    </div>
  );
}
