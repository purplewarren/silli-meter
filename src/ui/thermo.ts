/**
 * Thermometer component for tantrum intensity tracking
 * Live 1-10 slider with debounced updates and intensity bands
 */

export interface ThermometerHandle {
  mount(container: HTMLElement): void;
  getValue(): number;
  setValue(value: number): void;
  onValueChange(callback: (value: number) => void): void;
  destroy(): void;
}

const INTENSITY_BANDS = [
  { min: 1, max: 3, label: 'Calm', color: '#4CAF50' },
  { min: 4, max: 6, label: 'Rising', color: '#FF9800' },
  { min: 7, max: 10, label: 'High', color: '#F44336' }
];

export function createThermometer(): ThermometerHandle {
  let root: HTMLElement;
  let slider: HTMLInputElement;
  let valueDisplay: HTMLElement;
  let bandDisplay: HTMLElement;
  let valueChangeCallbacks: ((value: number) => void)[] = [];
  let debounceTimer: number | null = null;
  let currentValue = 5; // Default to middle

  function mount(container: HTMLElement) {
    container.innerHTML = '';
    root = document.createElement('div');
    root.className = 'thermometer';
    root.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
      min-width: 200px;
    `;

    // Title
    const title = document.createElement('h3');
    title.textContent = 'Intensity Level';
    title.style.cssText = `
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    `;
    root.appendChild(title);

    // Value display
    valueDisplay = document.createElement('div');
    valueDisplay.style.cssText = `
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      color: #333;
      min-height: 32px;
    `;
    root.appendChild(valueDisplay);

    // Band display
    bandDisplay = document.createElement('div');
    bandDisplay.style.cssText = `
      font-size: 14px;
      text-align: center;
      font-weight: 500;
      min-height: 20px;
    `;
    root.appendChild(bandDisplay);

    // Slider container
    const sliderContainer = document.createElement('div');
    sliderContainer.style.cssText = `
      position: relative;
      padding: 8px 0;
    `;

    // Slider
    slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '1';
    slider.max = '10';
    slider.step = '1';
    slider.value = currentValue.toString();
    slider.style.cssText = `
      width: 100%;
      height: 8px;
      border-radius: 4px;
      background: linear-gradient(to right, #4CAF50 0%, #4CAF50 30%, #FF9800 30%, #FF9800 60%, #F44336 60%, #F44336 100%);
      outline: none;
      -webkit-appearance: none;
    `;

    // Custom slider styling
    slider.addEventListener('input', handleSliderInput);
    slider.addEventListener('change', handleSliderChange);

    // Add custom slider thumb styling
    const style = document.createElement('style');
    style.textContent = `
      .thermometer input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #2196F3;
        cursor: pointer;
        border: 2px solid #fff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      .thermometer input[type="range"]::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #2196F3;
        cursor: pointer;
        border: 2px solid #fff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
    `;
    document.head.appendChild(style);

    sliderContainer.appendChild(slider);
    root.appendChild(sliderContainer);

    // Scale labels
    const scaleContainer = document.createElement('div');
    scaleContainer.style.cssText = `
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    `;

    const lowLabel = document.createElement('span');
    lowLabel.textContent = '1';
    const highLabel = document.createElement('span');
    highLabel.textContent = '10';
    
    scaleContainer.appendChild(lowLabel);
    scaleContainer.appendChild(highLabel);
    root.appendChild(scaleContainer);

    container.appendChild(root);
    updateDisplay();
  }

  function handleSliderInput() {
    const value = parseInt(slider.value);
    if (value !== currentValue) {
      currentValue = value;
      updateDisplay();
      
      // Debounce the callback
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = window.setTimeout(() => {
        valueChangeCallbacks.forEach(callback => callback(currentValue));
      }, 150); // 150ms debounce
    }
  }

  function handleSliderChange() {
    // Immediate callback on change (not just input)
    valueChangeCallbacks.forEach(callback => callback(currentValue));
  }

  function updateDisplay() {
    valueDisplay.textContent = currentValue.toString();
    
    const band = INTENSITY_BANDS.find(b => currentValue >= b.min && currentValue <= b.max);
    if (band) {
      bandDisplay.textContent = band.label;
      bandDisplay.style.color = band.color;
    } else {
      bandDisplay.textContent = '';
    }
  }

  function getValue(): number {
    return currentValue;
  }

  function setValue(value: number) {
    const clampedValue = Math.max(1, Math.min(10, Math.round(value)));
    if (clampedValue !== currentValue) {
      currentValue = clampedValue;
      if (slider) {
        slider.value = currentValue.toString();
      }
      updateDisplay();
    }
  }

  function onValueChange(callback: (value: number) => void) {
    valueChangeCallbacks.push(callback);
  }

  function destroy() {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    valueChangeCallbacks = [];
    if (root && root.parentNode) {
      root.parentNode.removeChild(root);
    }
  }

  return {
    mount,
    getValue,
    setValue,
    onValueChange,
    destroy
  };
} 