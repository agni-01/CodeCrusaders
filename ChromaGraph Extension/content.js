// ChromaGraph Content Script - Injected into Web Pages
(function() {
  let activeSettings = {"isEnabled":true,"deficiency":"deuteranopia","assistMode":"daltonize_patterns","intensity":85,"safePalette":"okabeIto","enableColorInspector":true,"enableDirectLabels":true,"enableEdgeStroke":true,"strokeWidth":2,"patternScale":1};
  let tooltipEl = null;

  // 1. Inject SVG Filters & Patterns into Document Head
  function injectSvgAssets() {
    if (document.getElementById('chromagraph-svg-defs')) return;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'chromagraph-svg-defs';
    svg.style.position = 'absolute';
    svg.style.width = '0';
    svg.style.height = '0';
    svg.style.overflow = 'hidden';

    svg.innerHTML = `
      <defs>
        <!-- Daltonize Deuteranopia -->
        <filter id="cg-daltonize-deuteranopia">
          <feColorMatrix type="matrix" values="1.2 0 0 0 0  0.6 0.1 0.4 0 0  0 0.4 0.9 0 0  0 0 0 1 0" />
        </filter>
        <!-- Daltonize Protanopia -->
        <filter id="cg-daltonize-protanopia">
          <feColorMatrix type="matrix" values="0.2 0.8 0.3 0 0  0 1 0 0 0  0 0.3 1.1 0 0  0 0 0 1 0" />
        </filter>
        <!-- Daltonize Tritanopia -->
        <filter id="cg-daltonize-tritanopia">
          <feColorMatrix type="matrix" values="1 0 0 0 0  0.3 0.8 0 0 0  0.5 0.4 0.2 0 0  0 0 0 1 0" />
        </filter>
        <!-- High Contrast Edges -->
        <filter id="cg-high-contrast">
          <feColorMatrix type="matrix" values="1.35 0 0 0 -0.15  0 1.35 0 0 -0.15  0 0 1.35 0 -0.15  0 0 0 1 0" />
        </filter>

        <!-- Hatch Pattern A: Diagonal 45deg -->
        <pattern id="cg-pattern-hatch-45" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" stroke-width="2.5" />
        </pattern>
        <!-- Hatch Pattern B: Polka Dots -->
        <pattern id="cg-pattern-dots" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="2" fill="currentColor" />
        </pattern>
        <!-- Hatch Pattern C: Crosshatch -->
        <pattern id="cg-pattern-cross" width="10" height="10" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="10" y2="10" stroke="currentColor" stroke-width="2" />
          <line x1="10" y1="0" x2="0" y2="10" stroke="currentColor" stroke-width="2" />
        </pattern>
        <!-- Hatch Pattern D: Horizontal Bars -->
        <pattern id="cg-pattern-horizontal" width="8" height="8" patternUnits="userSpaceOnUse">
          <line x1="0" y1="2" x2="8" y2="2" stroke="currentColor" stroke-width="3" />
        </pattern>
      </defs>
    `;
    document.body.appendChild(svg);
  }

  // 2. Apply styling and filters to chart elements
  function applyFilters(settings) {
    activeSettings = settings;
    injectSvgAssets();

    // Chart target selectors commonly used across D3, Highcharts, ChartJS, Plotly, Recharts, SVG
    const chartSelectors = 'svg, canvas, [role="img"], .recharts-wrapper, .highcharts-container, .plotly, img[src*="chart"], img[src*="graph"]';
    const chartElements = document.querySelectorAll(chartSelectors);

    chartElements.forEach((el) => {
      if (el.id === 'chromagraph-svg-defs') return;

      if (!settings.isEnabled) {
        el.style.filter = '';
        el.classList.remove('chromagraph-active');
        return;
      }

      el.classList.add('chromagraph-active');

      let filterVal = '';
      if (settings.assistMode === 'daltonize' || settings.assistMode === 'daltonize_patterns') {
        if (settings.deficiency.includes('deuter')) {
          filterVal = 'url(#cg-daltonize-deuteranopia) contrast(1.15)';
        } else if (settings.deficiency.includes('protan')) {
          filterVal = 'url(#cg-daltonize-protanopia) contrast(1.15)';
        } else if (settings.deficiency.includes('tritan')) {
          filterVal = 'url(#cg-daltonize-tritanopia) contrast(1.1)';
        } else if (settings.deficiency === 'achromatopsia') {
          filterVal = 'contrast(1.35) saturate(0)';
        }
      } else if (settings.assistMode === 'highContrast') {
        filterVal = 'url(#cg-high-contrast) contrast(1.25)';
      }

      el.style.filter = filterVal;
    });

    // 3. Inject patterns into SVG path and rect elements if mode enables patterns
    if (settings.isEnabled && (settings.assistMode === 'patterns' || settings.assistMode === 'daltonize_patterns')) {
      injectSvgPatterns();
    }
  }

  function injectSvgPatterns() {
    const shapes = document.querySelectorAll('svg:not(#chromagraph-svg-defs) path, svg:not(#chromagraph-svg-defs) rect');
    const patternIds = ['cg-pattern-hatch-45', 'cg-pattern-dots', 'cg-pattern-cross', 'cg-pattern-horizontal'];

    shapes.forEach((shape, idx) => {
      const fill = window.getComputedStyle(shape).fill;
      if (fill && fill !== 'none' && fill !== 'rgba(0, 0, 0, 0)') {
        shape.setAttribute('stroke', '#000');
        shape.setAttribute('stroke-width', activeSettings.enableEdgeStroke ? '2' : '0.5');
      }
    });
  }

  // 4. Color Inspector Eyedropper on Hover
  function initColorInspector() {
    if (tooltipEl) return;

    tooltipEl = document.createElement('div');
    tooltipEl.id = 'chromagraph-inspector-tooltip';
    tooltipEl.style.display = 'none';
    document.body.appendChild(tooltipEl);

    document.addEventListener('mousemove', (e) => {
      if (!activeSettings.isEnabled || !activeSettings.enableColorInspector) {
        tooltipEl.style.display = 'none';
        return;
      }

      const target = document.elementFromPoint(e.clientX, e.clientY);
      if (!target || target.id === 'chromagraph-inspector-tooltip' || !target.closest('svg, canvas, [role="img"]')) {
        tooltipEl.style.display = 'none';
        return;
      }

      const style = window.getComputedStyle(target);
      const fill = style.fill || style.backgroundColor;
      if (!fill || fill === 'none' || fill === 'rgba(0, 0, 0, 0)') {
        tooltipEl.style.display = 'none';
        return;
      }

      // Display tooltip
      tooltipEl.style.display = 'flex';
      tooltipEl.style.left = (e.clientX + 16) + 'px';
      tooltipEl.style.top = (e.clientY + 16) + 'px';
      tooltipEl.innerHTML = `
        <div style="width: 14px; height: 14px; border-radius: 3px; background: ${fill}; border: 1px solid #fff;"></div>
        <div style="font-size: 11px; font-weight: 600; color: #fff;">${fill}</div>
      `;
    });
  }

  // Listen for messages from popup
  if (window.chrome && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.type === 'CHROMAGRAPH_UPDATE') {
        applyFilters(request.settings);
        sendResponse({ status: 'ok' });
      }
    });
  }

  // Init on page load
  injectSvgAssets();
  initColorInspector();
  applyFilters(activeSettings);
})();