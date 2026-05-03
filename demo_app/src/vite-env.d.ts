/// <reference types="vite/client" />

declare module '@shared/mystery-effects.js' {
  export function initMysteryEffects(): (() => void) | void;
}

declare module '../../shared_design/MysteryShell.jsx' {
  import React from 'react';
  const MysteryShell: React.FC<{ children: React.ReactNode }>;
  export default MysteryShell;
}
