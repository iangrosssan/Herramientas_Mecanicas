/* -------------------------
   Mobile detection
-------------------------- */
function isMobile() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/* -------------------------
   Project Data Integration
-------------------------- */
const summaries = {};
const repos = {};

if (window.SITE_DATA) {
    if (window.SITE_DATA.academic_projects) {
        window.SITE_DATA.academic_projects.forEach(p => {
            summaries[p.filename] = {
                title: p.title,
                text: p.text,
                youtubeUrl: p.youtubeUrl || null
            };
        });
    }
    if (window.SITE_DATA.code_projects) {
        window.SITE_DATA.code_projects.forEach(p => {
            repos[p.id] = {
                title: p.title,
                repo: p.repo,
                text: p.text,
                demoUrl: p.demoUrl || null
            };
        });
    }
}

function showPDF(id, filename) {
    document.querySelectorAll('.nav-item')
        .forEach(b => b.classList.remove('active'));

    const btn = document.getElementById(id);
    if (btn) btn.classList.add('active');

    // Find the summary by matching the filename. Since filename could have base path prepended,
    // we match it against the raw static keys in `summaries`.
    const base = window.SITE_BASE_URL && window.SITE_BASE_URL !== '/' ? window.SITE_BASE_URL : '';
    let summaryKey = filename;
    if (base && filename.startsWith(base)) {
        summaryKey = '/' + filename.substring(base.length);
    }

    const s = summaries[summaryKey];
    if (s && document.getElementById('doc-title')) {
        document.getElementById('doc-title').textContent = s.title;
        document.getElementById('doc-text').textContent = s.text;
    }

    // Update video button
    const videoBtn = document.getElementById('video-btn');
    const docSummary = document.getElementById('doc-summary');
    if (videoBtn) {
        if (s && s.youtubeUrl) {
            videoBtn.href = s.youtubeUrl;
            videoBtn.style.display = 'inline-flex';
            if (docSummary) docSummary.classList.add('has-demo');
        } else {
            videoBtn.style.display = 'none';
            if (docSummary) docSummary.classList.remove('has-demo');
        }
    }

    // Update mobile dropdown summary and close it
    const summaryEl = document.getElementById('mobile-summary-academico');
    if (summaryEl && s) {
        summaryEl.textContent = s.title;
    }

    // Update mobile video button
    const mobileVideoBtn = document.getElementById('mobile-video-btn');
    if (mobileVideoBtn) {
        if (s && s.youtubeUrl && window.innerWidth <= 900) {
            mobileVideoBtn.href = s.youtubeUrl;
            mobileVideoBtn.style.display = 'block';
        } else {
            mobileVideoBtn.style.display = 'none';
        }
    }
    const detailsWrap = document.querySelector('.mobile-dropdown');
    if (detailsWrap && window.innerWidth <= 900) {
        detailsWrap.open = false;
    }

    history.replaceState(null, '', `#${id}`);

    // Ensure the filename actually points to the correct GitHub Pages subdirectory
    const baseUrl = window.SITE_BASE_URL && window.SITE_BASE_URL !== '/' ? window.SITE_BASE_URL : '';
    // if baseUrl is "/Portafolio/" and filename is "/assets/...", properly format it:
    const safeFilename = baseUrl ? (baseUrl + filename.substring(1)) : filename;

    // Update mobile button if it exists
    const mobilePdfBtn = document.getElementById('mobile-pdf-btn');
    if (mobilePdfBtn) mobilePdfBtn.href = safeFilename;

    const viewer = document.getElementById('viewer');
    if (viewer) viewer.src = safeFilename;
}

/* -------------------------
   Repository viewer
-------------------------- */
/* Repos object is now built dynamically from SITE_DATA above */

function showCode(repoId) {
    const r = repos[repoId];
    if (!r) return;

    document.querySelectorAll('.nav-item')
        .forEach(b => b.classList.remove('active'));

    const btn = document.getElementById(repoId);
    if (btn) btn.classList.add('active');

    if (document.getElementById('doc-title')) {
        document.getElementById('doc-title').textContent = r.title;
        document.getElementById('doc-text').textContent = r.text;
    }

    // Show or hide the demo button
    const demoBtn = document.getElementById('demo-btn');
    const docSummary = document.getElementById('doc-summary');
    if (demoBtn) {
        if (r.demoUrl) {
            demoBtn.href = r.demoUrl;
            demoBtn.style.display = 'inline-flex';
            if (docSummary) docSummary.classList.add('has-demo');
        } else {
            demoBtn.style.display = 'none';
            if (docSummary) docSummary.classList.remove('has-demo');
        }
    }

    // Update mobile dropdown summary and close it
    const summaryEl = document.getElementById('mobile-summary-codigo');
    if (summaryEl && r) {
        summaryEl.textContent = r.title;
    }

    // Update mobile demo button
    const mobileDemoBtn = document.getElementById('mobile-demo-btn');
    if (mobileDemoBtn) {
        if (r.demoUrl && window.innerWidth <= 900) {
            mobileDemoBtn.href = r.demoUrl;
            mobileDemoBtn.style.display = 'block';
        } else {
            mobileDemoBtn.style.display = 'none';
        }
    }
    const detailsWrap = document.querySelector('.mobile-dropdown');
    if (detailsWrap && window.innerWidth <= 900) {
        detailsWrap.open = false;
    }

    const viewer = document.getElementById('viewer');
    const cacheBuster = Date.now();
    const base = window.SITE_BASE_URL || '/';

    // Update mobile button for code
    const mobileCodeBtn = document.getElementById('mobile-code-btn');
    if (mobileCodeBtn) mobileCodeBtn.href = `https://github.com/${r.repo}`;

    if (viewer) {
        viewer.src = `${base}repo-viewer.html#${encodeURIComponent(r.repo)}&v=${cacheBuster}`;
    }

    history.replaceState(null, '', `#${repoId}`);
}

/* -------------------------
   Restore state on reload
-------------------------- */
window.addEventListener('load', () => {
    const h = decodeURIComponent(location.hash.slice(1));
    if (!h) return;

    // Try as PDF id — look up with full asset path relative to domain root
    const rawPath = `/assets/repo_academico/${h}.pdf`;
    if (summaries[rawPath]) {
        const base = window.SITE_BASE_URL || '';
        // If base is '/', rawPath is already correct. If base is '/Portafolio/', avoid double slash
        const fullPath = base === '/' ? rawPath : base + rawPath.substring(1);
        showPDF(h, fullPath);
        return;
    }

    // Check if it's a code repo ID
    if (repos[h]) {
        showCode(h);
        return;
    }
});

/* -------------------------
   Footer timestamp (GitHub API)
-------------------------- */
window.addEventListener('DOMContentLoaded', async () => {
    const el = document.getElementById('last-update');
    if (!el) return;

    try {
        const response = await fetch('https://api.github.com/repos/iangrosssan/github_pages');
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        const d = new Date(data.pushed_at);

        const hh = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();

        el.textContent = `Última actualización: ${hh}:${min} ${dd}/${mm}/${yyyy}`;
    } catch (error) {
        console.error('Error fetching repo date:', error);
        const d = new Date();
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        el.textContent = `Última actualización: ${dd}/${mm}/${yyyy}`;
    }
});

// Initialize mobile UI on load and handle resize
function adjustSidebarForVewport() {
    const isDesktop = window.innerWidth > 900;
    document.querySelectorAll('.mobile-dropdown').forEach(d => {
        if (isDesktop) {
            d.setAttribute('open', '');
        } else if (!d.hasAttribute('data-touched')) {
            // Only auto-close on mobile if the user hasn't interacted with it yet
            d.removeAttribute('open');
        }
    });
}

window.addEventListener('DOMContentLoaded', adjustSidebarForVewport);
window.addEventListener('resize', adjustSidebarForVewport);

// Mark as touched when user toggles it manually
document.querySelectorAll('.mobile-dropdown summary').forEach(s => {
    s.addEventListener('click', () => {
        s.parentElement.setAttribute('data-touched', 'true');
    });
});