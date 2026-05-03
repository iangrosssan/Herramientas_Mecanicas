import React, { useEffect } from 'react';
import { initMysteryEffects } from './mystery-effects.js';

export default function MysteryShell({ children }) {
  useEffect(() => {
    const cleanup = initMysteryEffects();
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, []);

  return (
    <div className="page">
      <div className="smoke-container" aria-hidden="true">
        <div className="smoke-wisp wisp-1" id="wisp-1" />
        <div className="smoke-wisp wisp-2" id="wisp-2" />
        <div className="smoke-wisp wisp-3" id="wisp-3" />
      </div>
      <div className="layout">
        {children}
      </div>
    </div>
  );
}
