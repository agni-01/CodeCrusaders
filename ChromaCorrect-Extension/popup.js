// ChromaCorrect Chrome Extension Popup Controller
const defaultSettings = {
  isEnabled: true,
  deficiency: 'deuteranopia',
  assistMode: 'daltonize_patterns',
  intensity: 85,
  enableColorInspector: true,
  enableEdgeStroke: true,
  enableDirectLabels: true
};

document.addEventListener('DOMContentLoaded', () => {
  const toggleEnabled = document.getElementById('toggle-enabled');
  const deficiencySelect = document.getElementById('deficiency-select');
  const assistModeSelect = document.getElementById('assist-mode-select');
  const intensitySlider = document.getElementById('intensity-slider');
  const intensityValue = document.getElementById('intensity-value');
  const toggleInspector = document.getElementById('toggle-inspector');
  const toggleEdges = document.getElementById('toggle-edges');
  const toggleLabels = document.getElementById('toggle-labels');
  const toggleImages = document.getElementById('toggle-images');
  const applyBtn = document.getElementById('apply-btn');
  const resetBtn = document.getElementById('reset-btn');

  // Load stored settings
  if (chrome?.storage?.sync) {
    chrome.storage.sync.get(defaultSettings, (settings) => {
      toggleEnabled.checked = settings.isEnabled;
      deficiencySelect.value = settings.deficiency;
      assistModeSelect.value = settings.assistMode;
      intensitySlider.value = settings.intensity;
      intensityValue.textContent = settings.intensity + '%';
      toggleInspector.checked = settings.enableColorInspector;
      toggleEdges.checked = settings.enableEdgeStroke;
      toggleLabels.checked = settings.enableDirectLabels;
      if (toggleImages && settings.enableImageCorrection !== undefined) {
        toggleImages.checked = settings.enableImageCorrection;
      }
    });
  }

  intensitySlider.addEventListener('input', (e) => {
    intensityValue.textContent = e.target.value + '%';
  });

  function getSettings() {
    return {
      isEnabled: toggleEnabled.checked,
      deficiency: deficiencySelect.value,
      assistMode: assistModeSelect.value,
      intensity: parseInt(intensitySlider.value, 10),
      enableColorInspector: toggleInspector.checked,
      enableEdgeStroke: toggleEdges.checked,
      enableDirectLabels: toggleLabels.checked,
      enableImageCorrection: toggleImages ? toggleImages.checked : true
    };
  }

  function saveAndApply() {
    const settings = getSettings();
    if (chrome?.storage?.sync) {
      chrome.storage.sync.set(settings);
    }
    // Send message to active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'CHROMACORRECT_UPDATE', settings });
      }
    });
  }

  applyBtn.addEventListener('click', saveAndApply);
  toggleEnabled.addEventListener('change', saveAndApply);
  deficiencySelect.addEventListener('change', saveAndApply);
  assistModeSelect.addEventListener('change', saveAndApply);
  intensitySlider.addEventListener('change', saveAndApply);
  toggleInspector.addEventListener('change', saveAndApply);
  toggleEdges.addEventListener('change', saveAndApply);
  toggleLabels.addEventListener('change', saveAndApply);
  if (toggleImages) toggleImages.addEventListener('change', saveAndApply);

  resetBtn.addEventListener('click', () => {
    toggleEnabled.checked = false;
    saveAndApply();
  });
});