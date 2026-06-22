/**
 * Premium Browser-Based Blog Article Scraper & Exporter
 * 
 * Instructions:
 * 1. Open the blog landing page of any website (e.g. https://example.com/blog).
 * 2. Open Developer Tools (F12, or Right Click -> Inspect).
 * 3. Go to the "Console" tab.
 * 4. Paste this entire script and press Enter.
 * 5. Use the floating overlay dashboard to test selectors, crawl pages, and download the data to Excel/CSV.
 */

(function () {
  'use strict';

  // Avoid multiple instances running simultaneously
  const existingUI = document.getElementById('blog-scraper-overlay-ui');
  if (existingUI) {
    existingUI.remove();
  }

  // ----------------------------------------------------
  // CSS STYLES (Glassmorphism, harmonies, premium feel)
  // ----------------------------------------------------
  const styleEl = document.createElement('style');
  styleEl.id = 'blog-scraper-styles';
  styleEl.textContent = `
    #blog-scraper-overlay-ui {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 380px;
      max-height: calc(100vh - 40px);
      background: rgba(18, 18, 28, 0.88);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
      color: #e5e7eb;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
      z-index: 2147483647;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-sizing: border-box;
      animation: scraperFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes scraperFadeIn {
      from { opacity: 0; transform: translateY(10px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    #blog-scraper-overlay-ui * {
      box-sizing: border-box;
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
    }

    /* Scrollbar Styling */
    #blog-scraper-overlay-ui *::-webkit-scrollbar {
      width: 4px;
    }
    #blog-scraper-overlay-ui *::-webkit-scrollbar-track {
      background: transparent;
    }
    #blog-scraper-overlay-ui *::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
    }

    /* Drag Handle Header */
    .scraper-header {
      padding: 14px 18px;
      background: rgba(255, 255, 255, 0.02);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      cursor: move;
      display: flex;
      justify-content: space-between;
      align-items: center;
      user-select: none;
    }

    .scraper-brand {
      display: flex;
      flex-direction: column;
    }

    .scraper-title {
      font-size: 15px;
      font-weight: 700;
      letter-spacing: -0.01em;
      background: linear-gradient(135deg, #a78bfa, #22d3ee);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .scraper-subtitle {
      font-size: 10px;
      color: #9ca3af;
      margin-top: 2px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .scraper-close-btn {
      background: transparent;
      border: none;
      color: #9ca3af;
      font-size: 18px;
      cursor: pointer;
      line-height: 1;
      padding: 4px;
      transition: color 0.2s;
    }

    .scraper-close-btn:hover {
      color: #ef4444;
    }

    /* Main Scrollable Content Container */
    .scraper-body {
      padding: 18px;
      overflow-y: auto;
      max-height: calc(100vh - 120px);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* Setup / Form Groups */
    .scraper-section-title {
      font-size: 11px;
      font-weight: 600;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .scraper-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-bottom: 10px;
    }

    .scraper-label {
      font-size: 11px;
      font-weight: 500;
      color: #d1d5db;
    }

    .scraper-input {
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 12px;
      color: #fff;
      font-family: monospace;
      outline: none;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .scraper-input:focus {
      border-color: #8b5cf6;
      box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.25);
      background: rgba(0, 0, 0, 0.4);
    }

    /* Buttons */
    .scraper-btn-group {
      display: flex;
      gap: 8px;
      margin-top: 4px;
    }

    .scraper-btn {
      flex: 1;
      padding: 9px 14px;
      font-size: 12px;
      font-weight: 600;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      text-align: center;
    }

    .scraper-btn-primary {
      background: linear-gradient(135deg, #7c3aed, #06b6d4);
      color: #fff;
      box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
    }

    .scraper-btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(124, 58, 237, 0.35);
      filter: brightness(1.1);
    }

    .scraper-btn-primary:active:not(:disabled) {
      transform: translateY(0);
    }

    .scraper-btn-secondary {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #e5e7eb;
    }

    .scraper-btn-secondary:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
    }

    .scraper-btn-danger {
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #fca5a5;
    }

    .scraper-btn-danger:hover:not(:disabled) {
      background: rgba(239, 68, 68, 0.35);
      color: #fff;
    }

    .scraper-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Live Logs & Terminal Console */
    .scraper-log-panel {
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 10px 14px;
      max-height: 120px;
      overflow-y: auto;
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
      font-size: 11px;
      color: #34d399;
      line-height: 1.5;
    }

    .scraper-log-line {
      margin-bottom: 2px;
      white-space: pre-wrap;
      word-break: break-all;
    }

    .scraper-log-line.error { color: #f87171; }
    .scraper-log-line.info { color: #60a5fa; }
    .scraper-log-line.warn { color: #fbbf24; }

    /* Progress Indicators */
    .scraper-progress-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 10px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .scraper-stats-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .scraper-stat-item {
      display: flex;
      flex-direction: column;
    }

    .scraper-stat-label {
      font-size: 10px;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .scraper-stat-value {
      font-size: 16px;
      font-weight: 700;
      color: #fff;
    }

    .scraper-progress-track {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 4px;
      height: 6px;
      width: 100%;
      overflow: hidden;
    }

    .scraper-progress-bar {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #7c3aed, #06b6d4);
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Live Preview Section */
    .scraper-preview-section {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .scraper-preview-table-container {
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      max-height: 150px;
      overflow-y: auto;
    }

    .scraper-preview-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
    }

    .scraper-preview-table th {
      position: sticky;
      top: 0;
      background: rgba(24, 24, 37, 0.95);
      color: #9ca3af;
      text-align: left;
      padding: 6px 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      font-weight: 600;
    }

    .scraper-preview-table td {
      padding: 6px 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
      color: #d1d5db;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 140px;
    }

    .scraper-preview-table tr:hover td {
      background: rgba(255, 255, 255, 0.03);
    }

    .scraper-delay-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-top: 4px;
    }
  `;
  document.head.appendChild(styleEl);

  // ----------------------------------------------------
  // HTML BUILDER & STATE INITS
  // ----------------------------------------------------
  const ui = document.createElement('div');
  ui.id = 'blog-scraper-overlay-ui';
  ui.innerHTML = `
    <div class="scraper-header" id="scraper-drag-handle">
      <div class="scraper-brand">
        <span class="scraper-title">⚡ Blog Article Extractor</span>
        <span class="scraper-subtitle">Engine v1.0.0</span>
      </div>
      <button class="scraper-close-btn" id="scraper-close" title="Close Panel">×</button>
    </div>
    <div class="scraper-body">
      
      <!-- Selectors Form Card -->
      <div class="scraper-form-panel">
        <div class="scraper-section-title">🕵️‍♂️ Selectors Setup</div>
        
        <div class="scraper-field">
          <label class="scraper-label" for="sel-article">Article Container CSS Selector</label>
          <input class="scraper-input" id="sel-article" type="text" placeholder="e.g. article, .post-card" value="">
        </div>

        <div class="scraper-field">
          <label class="scraper-label" for="sel-title">Title CSS Selector (Relative)</label>
          <input class="scraper-input" id="sel-title" type="text" placeholder="e.g. h2, .post-title, a[href]" value="">
        </div>

        <div class="scraper-field">
          <label class="scraper-label" for="sel-link">Link CSS Selector (Relative)</label>
          <input class="scraper-input" id="sel-link" type="text" placeholder="e.g. a[href], .read-more" value="">
        </div>

        <div class="scraper-field">
          <label class="scraper-label" for="sel-next">Next Page Link Selector (Global)</label>
          <input class="scraper-input" id="sel-next" type="text" placeholder="e.g. a.next, [rel='next']" value="">
        </div>

        <div class="scraper-delay-row">
          <label class="scraper-label" for="val-delay">Request Delay (ms)</label>
          <input class="scraper-input" id="val-delay" type="number" min="0" max="10000" step="100" value="500" style="width: 80px;">
        </div>

        <div class="scraper-btn-group" style="margin-top: 12px;">
          <button class="scraper-btn scraper-btn-secondary" id="btn-detect">🔍 Auto-Detect</button>
          <button class="scraper-btn scraper-btn-secondary" id="btn-test">🧪 Test Parse</button>
        </div>
      </div>

      <!-- Crawler Controller / Progress panel -->
      <div class="scraper-progress-card">
        <div class="scraper-stats-row">
          <div class="scraper-stat-item">
            <span class="scraper-stat-label">Articles Scraped</span>
            <span class="scraper-stat-value" id="stat-articles">0</span>
          </div>
          <div class="scraper-stat-item" style="text-align: right;">
            <span class="scraper-stat-label">Pages Crawled</span>
            <span class="scraper-stat-value" id="stat-pages">0</span>
          </div>
        </div>

        <div class="scraper-progress-track">
          <div class="scraper-progress-bar" id="progress-bar"></div>
        </div>

        <div class="scraper-btn-group">
          <button class="scraper-btn scraper-btn-primary" id="btn-start">🚀 Start Crawling</button>
          <button class="scraper-btn scraper-btn-danger" id="btn-stop" disabled>⏹️ Stop</button>
        </div>
      </div>

      <!-- Live Terminal Panel -->
      <div class="scraper-section-title">📰 Logs</div>
      <div class="scraper-log-panel" id="scraper-log">
        <div class="scraper-log-line info">Dashboard ready. Run Auto-Detect or adjust CSS selectors to start.</div>
      </div>

      <!-- Scraped Data Live Preview -->
      <div class="scraper-preview-section" id="preview-panel" style="display: none;">
        <div class="scraper-section-title">📊 Live Data Preview (<span id="preview-count">0</span>)</div>
        <div class="scraper-preview-table-container">
          <table class="scraper-preview-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>URL</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody id="preview-tbody">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>
        
        <div class="scraper-btn-group" style="margin-top: 6px;">
          <button class="scraper-btn scraper-btn-primary" id="btn-xlsx" disabled>📥 Export Excel (.xlsx)</button>
          <button class="scraper-btn scraper-btn-secondary" id="btn-csv" disabled>📝 Download CSV</button>
        </div>
      </div>

    </div>
  `;
  document.body.appendChild(ui);

  // Cache DOM references
  const elArticle = document.getElementById('sel-article');
  const elTitle = document.getElementById('sel-title');
  const elLink = document.getElementById('sel-link');
  const elNext = document.getElementById('sel-next');
  const elDelay = document.getElementById('val-delay');
  const btnDetect = document.getElementById('btn-detect');
  const btnTest = document.getElementById('btn-test');
  const btnStart = document.getElementById('btn-start');
  const btnStop = document.getElementById('btn-stop');
  const btnXlsx = document.getElementById('btn-xlsx');
  const btnCsv = document.getElementById('btn-csv');
  const statArticles = document.getElementById('stat-articles');
  const statPages = document.getElementById('stat-pages');
  const progressBar = document.getElementById('progress-bar');
  const logPanel = document.getElementById('scraper-log');
  const previewPanel = document.getElementById('preview-panel');
  const previewCount = document.getElementById('preview-count');
  const previewTbody = document.getElementById('preview-tbody');
  const closeBtn = document.getElementById('scraper-close');

  // Crawler State
  let isCrawling = false;
  let articlesList = [];
  let visitedUrls = new Set();
  let currentPageUrl = window.location.href;

  // ----------------------------------------------------
  // LOGGING UTILITIES
  // ----------------------------------------------------
  function log(message, type = 'default') {
    const logLine = document.createElement('div');
    logLine.className = `scraper-log-line ${type}`;
    logLine.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logPanel.appendChild(logLine);
    logPanel.scrollTop = logPanel.scrollHeight;
    console.log(`[Blog Scraper] ${message}`);
  }

  // ----------------------------------------------------
  // DRAG & DROP DASHBOARD
  // ----------------------------------------------------
  const dragHandle = document.getElementById('scraper-drag-handle');
  let activeDrag = false;
  let currentX, currentY, initialX, initialY;
  let xOffset = 0, yOffset = 0;

  dragHandle.addEventListener('mousedown', dragStart);
  document.addEventListener('mouseup', dragEnd);
  document.addEventListener('mousemove', drag);

  function dragStart(e) {
    if (e.target.closest('#scraper-close')) return;
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
    activeDrag = true;
  }

  function dragEnd() {
    activeDrag = false;
  }

  function drag(e) {
    if (activeDrag) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      xOffset = currentX;
      yOffset = currentY;
      ui.style.transform = `translate(${currentX}px, ${currentY}px)`;
    }
  }

  closeBtn.addEventListener('click', () => {
    ui.remove();
    logPanel.innerHTML = '';
  });

  // ----------------------------------------------------
  // CRAWLING SELECTOR HEURISTICS (Shopify, WordPress, Generic)
  // ----------------------------------------------------
  const SELECTOR_TEMPLATES = {
    articles: [
      'article', 
      '.post-card', 
      '.blog-post', 
      '.article-card', 
      '.post', 
      '.entry', 
      '.article', 
      '.post-item', 
      '.grid-item', 
      '.blog-articles__article'
    ],
    titles: [
      'h2', 'h3', 'h4', 
      '.post-title', 
      '.article-title', 
      '.entry-title', 
      '.card-title', 
      'a.article-title', 
      '.title',
      'h1'
    ],
    links: [
      'a[href]', 
      '.post-title a', 
      '.article-title a', 
      '.read-more', 
      'a.article-card__link'
    ],
    next: [
      'a[rel="next"]', 
      '.pagination__next', 
      '.pagination-next', 
      '.pagination-item--next', 
      '.wpr-load-more-btn',
      '.load-more-btn',
      '.load-more',
      'a:has-text("Next")', 
      'a:has-text("Older")', 
      'a:has-text("Load More")',
      'a[aria-label*="Next"]', 
      '.next a', 
      '.next-page',
      'a.next'
    ]
  };

  // Helper to isolate repeating elements (excluding parent elements wrapping children of same selector)
  function getLeafElements(doc, selector) {
    try {
      const elements = doc.querySelectorAll(selector);
      if (elements.length === 0) return [];
      return Array.from(elements).filter(el => {
        const children = el.querySelectorAll(selector);
        return children.length === 0;
      });
    } catch (_) {
      return [];
    }
  }

  // Helper to check if an element is inside a utility container (header, footer, sidebar, nav menus, etc.)
  function isInsideUtilityContainer(el, isPagination = false) {
    let current = el.parentElement;
    while (current && current.tagName && current.tagName.toLowerCase() !== 'body' && current.tagName.toLowerCase() !== 'html') {
      const tag = current.tagName.toLowerCase();
      // For pagination, we allow <nav> containers
      if (['header', 'footer', 'aside'].includes(tag) || (!isPagination && tag === 'nav')) {
        return true;
      }
      
      const id = (current.id || '').toLowerCase();
      if (
        id.includes('header') ||
        id.includes('footer') ||
        id.includes('sidebar') ||
        id.includes('aside') ||
        id.includes('social') ||
        id.includes('breadcrumbs') ||
        id.includes('cookie') ||
        id.includes('popup') ||
        id.includes('modal') ||
        id.includes('comments') ||
        id.includes('menu') ||
        (isPagination ? (id.includes('nav-menu') || id.includes('main-nav') || id.includes('header-nav') || id.includes('navigation-menu')) : id.includes('nav'))
      ) {
        return true;
      }
      
      const className = (current.className || '');
      if (typeof className === 'string' && className) {
        const cLower = className.toLowerCase();
        if (
          cLower.includes('header') ||
          cLower.includes('footer') ||
          cLower.includes('sidebar') ||
          cLower.includes('aside') ||
          cLower.includes('social') ||
          cLower.includes('breadcrumbs') ||
          cLower.includes('cookie') ||
          cLower.includes('popup') ||
          cLower.includes('modal') ||
          cLower.includes('comments') ||
          cLower.includes('menu') ||
          (isPagination ? (cLower.includes('nav-menu') || cLower.includes('main-nav') || cLower.includes('header-nav') || cLower.includes('navigation-menu')) : cLower.includes('nav'))
        ) {
          return true;
        }
      }
      current = current.parentElement;
    }
    return false;
  }


  // Heuristic to check if element has header content
  function hasHeading(el) {
    if (el.querySelector('h1, h2, h3, h4, h5, h6, [role="heading"]')) return true;
    if (el.querySelector('.title, .post-title, .entry-title, .article-title, .card-title, .elementor-post__title')) return true;
    const anchors = el.querySelectorAll('a[href]');
    for (const a of anchors) {
      if (a.textContent.trim().length > 15) return true;
    }
    return false;
  }

  // Automatic repeater and selector search
  function runAutoDetect(doc = document) {
    log('Running auto-detection heuristics...');
    
    const candidateSelectors = new Set();
    SELECTOR_TEMPLATES.articles.forEach(s => candidateSelectors.add(s));

    // Dynamic class scanning
    const allElements = doc.querySelectorAll('*');
    allElements.forEach(el => {
      if (el.className && typeof el.className === 'string') {
        const classes = el.className.split(/\s+/).filter(Boolean);
        classes.forEach(c => {
          const cLower = c.toLowerCase();
          if (
            cLower.includes('post') || 
            cLower.includes('article') || 
            cLower.includes('card') || 
            cLower.includes('entry') || 
            cLower.includes('item') ||
            cLower.includes('row') ||
            cLower.includes('grid') ||
            cLower.includes('athing')
          ) {
            candidateSelectors.add('.' + c);
          }
        });
      }
      const tag = el.tagName.toLowerCase();
      if (['article', 'tr', 'li'].includes(tag)) {
        candidateSelectors.add(tag);
      }
    });

    const scoredCandidates = [];

    candidateSelectors.forEach(sel => {
      const leaves = getLeafElements(doc, sel);
      // Filter out elements residing inside utility containers
      const filteredLeaves = leaves.filter(el => !isInsideUtilityContainer(el));
      
      if (filteredLeaves.length >= 3 && filteredLeaves.length <= 150) {
        let linksCount = 0;
        let headingsCount = 0;
        filteredLeaves.forEach(el => {
          if (el.querySelector('a[href]')) linksCount++;
          if (hasHeading(el)) headingsCount++;
        });
        
        const consistency = (linksCount / filteredLeaves.length) * (headingsCount / filteredLeaves.length);
        if (consistency > 0.4) {
          const score = filteredLeaves.length * consistency;
          scoredCandidates.push({ selector: sel, count: filteredLeaves.length, score, leaves: filteredLeaves });
        }
      }
    });

    scoredCandidates.sort((a, b) => b.score - a.score);

    let bestArticleSelector = 'article';
    let detectedLeaves = [];
    if (scoredCandidates.length > 0) {
      bestArticleSelector = scoredCandidates[0].selector;
      detectedLeaves = scoredCandidates[0].leaves;
      log(`Detected Article Container: "${bestArticleSelector}" (found ${detectedLeaves.length} items)`, 'info');
    } else {
      log('No matching article containers detected. Defaulting to "article".', 'warn');
    }

    elArticle.value = bestArticleSelector;

    // Detect Title Selector
    let bestTitleSelector = '';
    if (detectedLeaves.length > 0) {
      const titleCandidates = [
        '.elementor-post__title a',
        '.elementor-post__title',
        '.post-title a',
        '.post-title',
        '.entry-title a',
        '.entry-title',
        '.article-title a',
        '.article-title',
        'h3 a',
        'h3',
        'h2 a',
        'h2',
        'h4 a',
        'h4',
        '.title a',
        '.title',
        'a.article-title',
        'h1 a',
        'h1',
        'a'
      ];

      let bestFreq = 0;
      for (const tSel of titleCandidates) {
        let freq = 0;
        detectedLeaves.forEach(el => {
          if (el.querySelector(tSel)) freq++;
        });
        if (freq > bestFreq && freq >= detectedLeaves.length * 0.7) {
          bestFreq = freq;
          bestTitleSelector = tSel;
          if (freq === detectedLeaves.length) break;
        }
      }

      if (!bestTitleSelector) {
        const classFreq = {};
        detectedLeaves.forEach(el => {
          el.querySelectorAll('*').forEach(child => {
            if (child.className && typeof child.className === 'string') {
              const classes = child.className.split(/\s+/).filter(Boolean);
              classes.forEach(c => {
                if (c.toLowerCase().includes('title')) {
                  classFreq['.' + c] = (classFreq['.' + c] || 0) + 1;
                }
              });
            }
          });
        });
        let maxClassFreq = 0;
        let bestClass = '';
        for (const [cls, freq] of Object.entries(classFreq)) {
          if (freq > maxClassFreq) {
            maxClassFreq = freq;
            bestClass = cls;
          }
        }
        if (maxClassFreq >= detectedLeaves.length * 0.7) {
          bestTitleSelector = bestClass;
        }
      }

      if (!bestTitleSelector) {
        bestTitleSelector = 'a';
      }
    }

    elTitle.value = bestTitleSelector;
    log(`Detected Relative Title: "${bestTitleSelector}"`, 'info');

    // Detect Link Selector
    let bestLinkSelector = '';
    if (detectedLeaves.length > 0 && bestTitleSelector) {
      const sample = detectedLeaves[0];
      const titleEl = sample.querySelector(bestTitleSelector);
      if (titleEl && titleEl.tagName === 'A' && titleEl.getAttribute('href')) {
        bestLinkSelector = '';
      } else if (titleEl && titleEl.querySelector('a[href]')) {
        bestLinkSelector = 'a';
      } else {
        const firstLink = sample.querySelector('a[href]');
        if (firstLink) {
          if (firstLink.className) {
            bestLinkSelector = 'a.' + firstLink.className.split(/\s+/).filter(Boolean)[0];
          } else {
            bestLinkSelector = 'a';
          }
        }
      }
    }

    elLink.value = bestLinkSelector;
    log(`Detected Relative Link: "${bestLinkSelector || 'Same as Title element'}"`, 'info');

    // Detect Next Page Selector
    let bestNextSelector = 'a[rel="next"]';
    let foundNext = false;
    for (const selector of SELECTOR_TEMPLATES.next) {
      if (selector.includes(':has-text')) {
        const textToFind = selector.match(/"([^"]+)"/)[1];
        const allAnchors = doc.querySelectorAll('a[href]');
        for (const a of allAnchors) {
          if (isInsideUtilityContainer(a, true)) continue;
          const cleanText = a.textContent.trim().toLowerCase();
          if (cleanText.includes(textToFind.toLowerCase())) {
            bestNextSelector = `a[href] (Contains text "${textToFind}")`;
            foundNext = true;
            break;
          }
        }
      } else {
        const nextElements = doc.querySelectorAll(selector);
        for (const nextEl of nextElements) {
          if (isInsideUtilityContainer(nextEl, true)) continue;
          if (nextEl && nextEl.getAttribute('href')) {
            bestNextSelector = selector;
            foundNext = true;
            break;
          }
        }
      }
      if (foundNext) break;
    }

    if (!foundNext) {
      const allLinks = doc.querySelectorAll('a[href]');
      for (const a of allLinks) {
        if (isInsideUtilityContainer(a, true)) continue;
        const txt = a.textContent.trim().toLowerCase();
        if (
          txt === 'next' || 
          txt === 'older' || 
          txt === 'load more' || 
          txt === 'show more' ||
          txt === 'loadmore' ||
          txt === 'showmore' ||
          txt === '>' || 
          txt === '»' || 
          txt === 'next ›' || 
          txt === 'next page' ||
          txt.includes('older posts') ||
          txt.includes('older entries') ||
          txt.includes('load more posts')
        ) {
          if (a.className) {
            bestNextSelector = 'a.' + a.className.split(/\s+/).filter(Boolean).join('.');
          } else {
            bestNextSelector = `a[href] (Text matches "${a.textContent.trim()}")`;
          }
          foundNext = true;
          break;
        }
      }
    }


    elNext.value = bestNextSelector;
    if (foundNext) {
      log(`Detected Global Next Button: "${bestNextSelector}"`, 'info');
    } else {
      log(`Next Button Selector is unresolved. Defaulting to: "a[rel='next']"`, 'warn');
    }
  }

  runAutoDetect();

  btnDetect.addEventListener('click', () => runAutoDetect());

  // ----------------------------------------------------
  // PARSING & CRAWLING ENGINE
  // ----------------------------------------------------
  function extractPageArticles(doc, pageIndex, baseUrl) {
    const articleSel = elArticle.value.trim();
    const titleSel = elTitle.value.trim();
    const linkSel = elLink.value.trim();
    
    if (!articleSel) {
      log('Error: Article selector is empty.', 'error');
      return [];
    }

    const elements = getLeafElements(doc, articleSel);
    const parsed = [];

    elements.forEach(articleEl => {
      if (isInsideUtilityContainer(articleEl)) return;
      let title = '';

      let url = '';
      let date = '';
      let author = '';

      if (titleSel) {
        const titleEl = articleEl.querySelector(titleSel);
        if (titleEl) title = titleEl.textContent.trim().replace(/\s+/g, ' ');
      } else {
        title = articleEl.textContent.trim().split('\n')[0];
      }

      let linkEl;
      if (linkSel) {
        linkEl = articleEl.querySelector(linkSel);
      } else if (titleSel) {
        const titleEl = articleEl.querySelector(titleSel);
        if (titleEl && titleEl.tagName === 'A') {
          linkEl = titleEl;
        } else if (titleEl) {
          linkEl = titleEl.querySelector('a[href]');
        }
      }
      
      if (!linkEl) {
        linkEl = articleEl.querySelector('a[href]');
      }

      if (linkEl) {
        const rawHref = linkEl.getAttribute('href');
        try {
          url = new URL(rawHref, baseUrl).href;
        } catch (_) {
          url = rawHref;
        }
      }

      const dateEl = articleEl.querySelector('time, [datetime], .date, .post-date, .published');
      if (dateEl) {
        date = dateEl.getAttribute('datetime') || dateEl.textContent.trim();
      }

      const authorEl = articleEl.querySelector('.author, .post-author, [itemprop="author"]');
      if (authorEl) {
        author = authorEl.textContent.trim().replace(/^by\s+/i, '');
      }

      if (title && url) {
        parsed.push({
          title,
          url,
          date: date || 'N/A',
          author: author || 'N/A',
          page: pageIndex
        });
      }
    });

    return parsed;
  }

  function findNextPageUrl(doc, baseUrl) {
    const nextSel = elNext.value.trim();
    if (!nextSel) return null;

    if (nextSel.includes('(Contains text "') || nextSel.includes('(Text matches "')) {
      const textMatch = nextSel.match(/"([^"]+)"/)[1].toLowerCase();
      const allAnchors = doc.querySelectorAll('a[href]');
      for (const a of allAnchors) {
        if (isInsideUtilityContainer(a, true)) continue;
        if (a.textContent.trim().toLowerCase().includes(textMatch)) {
          const rawHref = a.getAttribute('href');
          try {
            return new URL(rawHref, baseUrl).href;
          } catch (_) {
            return null;
          }
        }
      }
      return null;
    }

    const nextElements = doc.querySelectorAll(nextSel);
    for (const nextLink of nextElements) {
      if (isInsideUtilityContainer(nextLink, true)) continue;
      const rawHref = nextLink.getAttribute('href');
      if (rawHref) {
        try {
          return new URL(rawHref, baseUrl).href;
        } catch (_) {
          return null;
        }
      }
    }
    return null;
  }


  // TEST PARSE BUTTON
  btnTest.addEventListener('click', () => {
    const testParsed = extractPageArticles(document, 1, window.location.href);
    log(`Test Parsed current page: Found ${testParsed.length} articles.`, 'info');
    
    if (testParsed.length > 0) {
      log(`Example #1: "${testParsed[0].title}" -> ${testParsed[0].url}`, 'info');
      
      previewPanel.style.display = 'flex';
      previewCount.textContent = testParsed.length;
      previewTbody.innerHTML = testParsed.slice(0, 5).map(item => `
        <tr>
          <td title="${item.title}">${item.title}</td>
          <td title="${item.url}"><a href="${item.url}" target="_blank" style="color: #60a5fa;">Link</a></td>
          <td title="${item.date}">${item.date}</td>
        </tr>
      `).join('');
      if (testParsed.length > 5) {
        previewTbody.innerHTML += `<tr><td colspan="3" style="text-align: center; color: #9ca3af; font-style: italic;">Showing top 5 preview items...</td></tr>`;
      }
    } else {
      log(`No articles found with current selectors. Check class names in DevTools.`, 'warn');
    }
  });

  // START CRAWLING BUTTON
  btnStart.addEventListener('click', async () => {
    isCrawling = true;
    articlesList = [];
    visitedUrls.clear();
    currentPageUrl = window.location.href;

    btnStart.disabled = true;
    btnStop.disabled = false;
    btnXlsx.disabled = true;
    btnCsv.disabled = true;
    elArticle.disabled = true;
    elTitle.disabled = true;
    elLink.disabled = true;
    elNext.disabled = true;
    btnDetect.disabled = true;
    btnTest.disabled = true;
    elDelay.disabled = true;

    log('==================================================');
    log('🏁 Starting blog crawler...', 'info');
    log(`Base URL: ${currentPageUrl}`, 'info');

    let pageCounter = 1;
    const sleepDelay = parseInt(elDelay.value) || 500;

    previewPanel.style.display = 'flex';
    previewTbody.innerHTML = '';
    previewCount.textContent = '0';
    statArticles.textContent = '0';
    statPages.textContent = '0';
    progressBar.style.width = '10%';

    while (isCrawling && currentPageUrl) {
      if (visitedUrls.has(currentPageUrl)) {
        log(`Circular reference detected: already crawled ${currentPageUrl}. Stopping.`, 'warn');
        break;
      }

      log(`Fetching & parsing page ${pageCounter}... [URL: ${currentPageUrl}]`);
      statPages.textContent = pageCounter;
      visitedUrls.add(currentPageUrl);

      let docToParse = document;
      
      if (pageCounter > 1) {
        try {
          const response = await fetch(currentPageUrl);
          if (!response.ok) {
            log(`Failed to fetch page ${pageCounter}: HTTP ${response.status}`, 'error');
            break;
          }
          const htmlText = await response.text();
          const parser = new DOMParser();
          docToParse = parser.parseFromString(htmlText, 'text/html');
        } catch (err) {
          log(`Network Error loading page ${pageCounter}: ${err.message}`, 'error');
          break;
        }
      }

      const foundOnPage = extractPageArticles(docToParse, pageCounter, currentPageUrl);
      log(`Page ${pageCounter} returned ${foundOnPage.length} articles.`, 'info');

      if (foundOnPage.length === 0) {
        if (pageCounter === 1) {
          log('No articles found on the first page. Crawl terminated. Please check your selectors.', 'error');
        } else {
          log('No articles found on this page. Reached the end of content.', 'info');
        }
        break;
      }

      articlesList.push(...foundOnPage);
      
      statArticles.textContent = articlesList.length;
      previewCount.textContent = articlesList.length;
      
      previewTbody.innerHTML = articlesList.slice(-10).reverse().map(item => `
        <tr>
          <td title="${item.title}">${item.title}</td>
          <td title="${item.url}"><a href="${item.url}" target="_blank" style="color: #60a5fa;">Link</a></td>
          <td title="${item.date}">${item.date}</td>
        </tr>
      `).join('');
      if (articlesList.length > 10) {
        previewTbody.innerHTML += `<tr><td colspan="3" style="text-align: center; color: #9ca3af; font-style: italic;">...and ${articlesList.length - 10} more items above</td></tr>`;
      }

      progressBar.style.width = `${Math.min(25 + pageCounter * 15, 95)}%`;

      const nextPage = findNextPageUrl(docToParse, currentPageUrl);
      if (nextPage) {
        currentPageUrl = nextPage;
        pageCounter++;
        if (isCrawling) {
          await new Promise(resolve => setTimeout(resolve, sleepDelay));
        }
      } else {
        log('No pagination links / Next page found. Reached end of crawl.', 'info');
        currentPageUrl = null;
      }
    }

    progressBar.style.width = '100%';
    finishCrawling();
  });

  // STOP CRAWLING BUTTON
  btnStop.addEventListener('click', () => {
    log('Crawling stop requested by user. Terminating process...', 'warn');
    isCrawling = false;
  });

  function finishCrawling() {
    isCrawling = false;
    btnStart.disabled = false;
    btnStop.disabled = true;
    elArticle.disabled = false;
    elTitle.disabled = false;
    elLink.disabled = false;
    elNext.disabled = false;
    btnDetect.disabled = false;
    btnTest.disabled = false;
    elDelay.disabled = false;

    log(`✅ Crawl completed. Found a total of ${articlesList.length} articles.`, 'info');
    
    if (articlesList.length > 0) {
      btnXlsx.disabled = false;
      btnCsv.disabled = false;
    }
  }

  // ----------------------------------------------------
  // EXPORT UTILITIES (XLSX Dynamic Script injection & Fallbacks)
  // ----------------------------------------------------

  // Helper to trigger download using Blob URL with deferred revocation to bypass Chrome's UUID renaming bug
  function triggerBlobDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Stop propagation of click to prevent tracking/routing scripts from intercepting
    link.addEventListener('click', e => {
      e.stopPropagation();
    });
    
    document.body.appendChild(link);
    
    // Dispatch a clean MouseEvent click
    const clickEvent = new MouseEvent('click', {
      bubbles: false,
      cancelable: true
    });
    link.dispatchEvent(clickEvent);
    
    // Remove element from DOM after a short delay, not synchronously
    setTimeout(() => {
      document.body.removeChild(link);
      
      // Delay revoking the ObjectURL by 15 seconds to ensure Chrome completes downloading and resolving the filename metadata
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 15000);
    }, 100);
  }

  // 1. XLSX (SheetJS) Exporter
  btnXlsx.addEventListener('click', () => {
    log('Loading SheetJS for spreadsheet generation...');
    
    if (typeof XLSX === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
      
      script.onload = () => {
        log('SheetJS library loaded successfully.', 'info');
        saveAsXlsx();
      };
      
      script.onerror = () => {
        log('Content Security Policy (CSP) or network error blocked SheetJS injection. Defaulting to CSV export...', 'error');
        saveAsCsv();
      };
      
      document.head.appendChild(script);
    } else {
      saveAsXlsx();
    }
  });

  function saveAsXlsx() {
    try {
      const domainName = window.location.hostname.replace('www.', '');
      const filename = `blog-articles-${domainName}-${new Date().toISOString().slice(0,10)}.xlsx`;

      const wb = XLSX.utils.book_new();
      
      const wsData = [
        ["Title", "Article URL", "Publication Date", "Author", "Page Crawled"],
        ...articlesList.map(a => [a.title, a.url, a.date, a.author, a.page])
      ];

      const ws = XLSX.utils.aoa_to_sheet(wsData);

      ws['!cols'] = [
        { wch: 45 }, // Title
        { wch: 60 }, // URL
        { wch: 20 }, // Date
        { wch: 25 }, // Author
        { wch: 12 }  // Page
      ];

      XLSX.utils.book_append_sheet(wb, ws, "Scraped Articles");
      
      // Use XLSX.write to get array buffer
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      
      triggerBlobDownload(blob, filename);
      log(`🎉 Excel file downloaded successfully: ${filename}`, 'info');
    } catch (err) {
      log(`Excel generation error: ${err.message}. Trying CSV fallback...`, 'error');
      saveAsCsv();
    }
  }

  // 2. CSV Exporter
  btnCsv.addEventListener('click', () => {
    saveAsCsv();
  });

  function saveAsCsv() {
    try {
      const domainName = window.location.hostname.replace('www.', '');
      const filename = `blog-articles-${domainName}-${new Date().toISOString().slice(0,10)}.csv`;

      const headers = ["Title", "Article URL", "Publication Date", "Author", "Page Crawled"];
      const rows = articlesList.map(a => [
        `"${a.title.replace(/"/g, '""')}"`,
        `"${a.url.replace(/"/g, '""')}"`,
        `"${a.date.replace(/"/g, '""')}"`,
        `"${a.author.replace(/"/g, '""')}"`,
        a.page
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      
      const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
      triggerBlobDownload(blob, filename);
      log(`🎉 CSV file downloaded successfully: ${filename}`, 'info');
    } catch (err) {
      log(`CSV generation failed: ${err.message}`, 'error');
    }
  }

})();
