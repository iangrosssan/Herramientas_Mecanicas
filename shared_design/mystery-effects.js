export function initMysteryEffects() {
    const wisps = [
        { el: null, x: window.innerWidth / 2, y: window.innerHeight / 2, targetX: 0, targetY: 0, lag: 0.15, drift: 0 },
        { el: null, x: window.innerWidth / 2, y: window.innerHeight / 2, targetX: 0, targetY: 0, lag: 0.08, drift: 0.02 },
        { el: null, x: window.innerWidth / 2, y: window.innerHeight / 2, targetX: 0, targetY: 0, lag: 0.04, drift: 0.05 }
    ];

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let isActive = true;
    let animationFrameId;

    const updateTracking = (e) => {
        const touch = e.touches ? e.touches[0] : e;
        mouseX = touch.clientX;
        mouseY = touch.clientY;

        document.documentElement.style.setProperty('--glow-x', `${mouseX}px`);
        document.documentElement.style.setProperty('--glow-y', `${mouseY}px`);

        if (!isActive) {
            isActive = true;
            animate();
        }
    };

    document.addEventListener('mousemove', updateTracking);
    document.addEventListener('touchstart', updateTracking, { passive: true });
    document.addEventListener('touchmove', updateTracking, { passive: true });

    function animate() {
        let moving = false;
        const now = Date.now() * 0.001;
        
        // Re-fetch wisps in case they were just rendered
        wisps[0].el = document.getElementById('wisp-1');
        wisps[1].el = document.getElementById('wisp-2');
        wisps[2].el = document.getElementById('wisp-3');

        // We use document.body or window as reference if hero-panel is missing
        const heroPanel = document.getElementById('hero-panel');
        const heroRect = heroPanel ? heroPanel.getBoundingClientRect() : { left: 0, top: 0 };
        
        wisps.forEach((w, i) => {
            const driftX = Math.sin(now + i) * 30 * w.drift;
            const driftY = Math.cos(now * 0.7 + i) * 20 * w.drift;
            
            w.x += (mouseX + driftX - w.x) * w.lag;
            w.y += (mouseY + driftY - w.y) * w.lag;

            if (Math.abs(mouseX - w.x) > 0.1 || Math.abs(mouseY - w.y) > 0.1) moving = true;

            if (w.el) {
                const rotate = Math.sin(now * 0.5 + i) * 15 * w.drift;
                const scale = 1 + Math.sin(now + i) * 0.1 * w.drift;
                const offsetX = w.el.offsetWidth / 2;
                const offsetY = w.el.offsetHeight / 2;
                // Apply relative transform
                w.el.style.transform = `translate(${w.x - heroRect.left - offsetX}px, ${w.y - heroRect.top - offsetY}px) rotate(${rotate}deg) scale(${scale})`;
                w.el.style.opacity = '1';
            }
        });

        if (moving || isActive) {
            animationFrameId = requestAnimationFrame(animate);
        } else {
            isActive = false;
        }
    }

    // Start animation immediately
    animate();

    return () => {
        document.removeEventListener('mousemove', updateTracking);
        document.removeEventListener('touchstart', updateTracking);
        document.removeEventListener('touchmove', updateTracking);
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    };
}
