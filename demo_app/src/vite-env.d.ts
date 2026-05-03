/// <reference types="vite/client" />

declare module '@shared/mystery-effects.js' {
  export function initMysteryEffects(): (() => void) | void;
}
