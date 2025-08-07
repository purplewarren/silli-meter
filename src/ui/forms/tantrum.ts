import { el, clamp, withCounter, checkboxGroupValues } from './_helpers';
import { createThermometer } from '../thermo';
import type { ThermometerHandle } from '../thermo';
import { createHistory } from '../history';
import type { HistoryHandle } from '../history';
import { copy } from '../copy';

const TRIGGERS = copy.triggers;

export interface FormHandle<T> {
  mount(container: HTMLElement): void;
  getContext(): T;
  validate(): { ok: true } | { ok: false; message: string };
  reset(): void;
}

const CO_REG_OPTIONS = copy.coRegulation;

export function createTantrumForm(): FormHandle<any> {
  let root: HTMLElement;
  let triggerSel: HTMLSelectElement;
  let durationInput: HTMLInputElement;
  let coRegDiv: HTMLElement;
  let noiseCb: HTMLInputElement;
  let notesTa: HTMLTextAreaElement;
  let notesCounter: HTMLElement;
  let mediaInput: HTMLInputElement;
  let mediaPreview: HTMLElement;
  let thermometer: ThermometerHandle;
  let history: HistoryHandle;
  let mediaProxies: {
    duration_s?: number;
    avg_level_dbfs?: number;
    motion_estimate?: number;
  } = {};

  function mount(container: HTMLElement) {
    container.innerHTML = '';
    root = el('div', { className: 'form form--tantrum' });

    // Create tabs for main form and history
    const tabContainer = document.createElement('div');
    tabContainer.style.cssText = `
      display: flex;
      margin-bottom: 16px;
      border-bottom: 2px solid #e0e0e0;
    `;

    const formTab = document.createElement('button');
    formTab.textContent = copy.tabs.recordSession;
    formTab.style.cssText = `
      flex: 1;
      padding: 12px;
      border: none;
      background: #2196F3;
      color: white;
      font-weight: 600;
      cursor: pointer;
    `;

    const historyTab = document.createElement('button');
    historyTab.textContent = copy.tabs.history;
    historyTab.style.cssText = `
      flex: 1;
      padding: 12px;
      border: none;
      background: #f5f5f5;
      color: #666;
      font-weight: 600;
      cursor: pointer;
    `;

    tabContainer.appendChild(formTab);
    tabContainer.appendChild(historyTab);
    root.appendChild(tabContainer);

    // Form content
    const formContent = document.createElement('div');
    formContent.className = 'form-content';
    formContent.style.cssText = `
      display: block;
    `;

    // History content
    const historyContent = document.createElement('div');
    historyContent.className = 'history-content';
    historyContent.style.cssText = `
      display: none;
    `;

    // Trigger
    const labelTrigger = el('label', { text: copy.forms.trigger, id: 'tantrum_trigger_label' });
    labelTrigger.htmlFor = 'tantrum_trigger';
    triggerSel = el('select', { id: 'tantrum_trigger' });
    const defaultOption = document.createElement('option');
    defaultOption.text = copy.placeholders.selectTrigger;
    defaultOption.value = '';
    triggerSel.appendChild(defaultOption);
    TRIGGERS.forEach(val => {
      const opt = document.createElement('option');
      opt.text = val.charAt(0).toUpperCase() + val.slice(1);
      opt.value = val;
      triggerSel.appendChild(opt);
    });
    formContent.appendChild(labelTrigger);
    formContent.appendChild(triggerSel);

    // Intensity Thermometer
    const thermometerContainer = document.createElement('div');
    thermometerContainer.style.cssText = `
      margin: 16px 0;
      padding: 16px;
      background: #f9f9f9;
      border-radius: 8px;
    `;
    thermometer = createThermometer();
    thermometer.mount(thermometerContainer);
    formContent.appendChild(thermometerContainer);

    // Media Capture
    const mediaLabel = el('label', { text: 'Media Clip (Optional)', id: 'tantrum_media_label' });
    mediaLabel.htmlFor = 'tantrum_media';
    mediaInput = el('input', { id: 'tantrum_media' }) as HTMLInputElement;
    mediaInput.type = 'file';
    mediaInput.accept = 'audio/*,video/*';
    mediaInput.capture = 'environment';
    mediaInput.style.cssText = `
      margin: 8px 0;
      padding: 8px;
      border: 2px dashed #ccc;
      border-radius: 4px;
      width: 100%;
      box-sizing: border-box;
    `;
    
    mediaPreview = document.createElement('div');
    mediaPreview.style.cssText = `
      margin-top: 8px;
      padding: 8px;
      background: #f0f0f0;
      border-radius: 4px;
      font-size: 12px;
      color: #666;
    `;

    mediaInput.addEventListener('change', handleMediaChange);
    formContent.appendChild(mediaLabel);
    formContent.appendChild(mediaInput);
    formContent.appendChild(mediaPreview);

    // Duration
    const labelDur = el('label', { text: copy.forms.duration, id: 'tantrum_duration_label' });
    labelDur.htmlFor = 'tantrum_duration';
    durationInput = el('input', { id: 'tantrum_duration' }) as HTMLInputElement;
    durationInput.type = 'number';
    durationInput.min = '0';
    durationInput.max = '30';
    durationInput.step = '1';
    durationInput.placeholder = '0';
    durationInput.style.height = '40px';
    formContent.appendChild(labelDur);
    formContent.appendChild(durationInput);

    // Co-reg
    const labelCoReg = el('label', { text: copy.forms.coRegulation, id: 'tantrum_coreg_label' });
    labelCoReg.htmlFor = 'tantrum_coreg';
    coRegDiv = el('div', { id: 'tantrum_coreg' });
    CO_REG_OPTIONS.forEach(opt => {
      const cb = el('input', { id: `tantrum_coreg_${opt.value}` }) as HTMLInputElement;
      cb.type = 'checkbox';
      cb.value = opt.value;
      cb.style.marginRight = '8px';
      const lbl = el('label', { text: opt.label });
      lbl.htmlFor = cb.id;
      lbl.style.marginRight = '16px';
      coRegDiv.appendChild(cb);
      coRegDiv.appendChild(lbl);
    });
    formContent.appendChild(labelCoReg);
    formContent.appendChild(coRegDiv);

    // Environment noise
    const noiseLabel = el('label', { text: copy.forms.environmentNoise, id: 'tantrum_noise_label' });
    noiseLabel.htmlFor = 'tantrum_noise';
    noiseCb = el('input', { id: 'tantrum_noise' }) as HTMLInputElement;
    noiseCb.type = 'checkbox';
    noiseCb.style.height = '40px';
    formContent.appendChild(noiseLabel);
    formContent.appendChild(noiseCb);

    // Notes
    const notesLabel = el('label', { text: copy.forms.notes, id: 'tantrum_notes_label' });
    notesLabel.htmlFor = 'tantrum_notes';
    notesTa = el('textarea', { id: 'tantrum_notes' }) as HTMLTextAreaElement;
    notesTa.rows = 2;
    notesTa.maxLength = 120;
    notesTa.style.height = '60px';
    notesCounter = el('div', { className: 'notes-counter' });
    withCounter(notesTa, 120, notesCounter);
    formContent.appendChild(notesLabel);
    formContent.appendChild(notesTa);
    formContent.appendChild(notesCounter);

    // Mount history
    history = createHistory();
    history.mount(historyContent);

    // Tab switching
    formTab.addEventListener('click', () => {
      formContent.style.display = 'block';
      historyContent.style.display = 'none';
      formTab.style.background = '#2196F3';
      formTab.style.color = 'white';
      historyTab.style.background = '#f5f5f5';
      historyTab.style.color = '#666';
    });

    historyTab.addEventListener('click', () => {
      formContent.style.display = 'none';
      historyContent.style.display = 'block';
      formTab.style.background = '#f5f5f5';
      formTab.style.color = '#666';
      historyTab.style.background = '#2196F3';
      historyTab.style.color = 'white';
      history.refresh();
    });

    root.appendChild(formContent);
    root.appendChild(historyContent);
    container.appendChild(root);
  }

  async function handleMediaChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (!file) {
      mediaProxies = {};
      mediaPreview.textContent = '';
      return;
    }

    mediaPreview.textContent = copy.placeholders.processing;

    try {
      // Compute derived proxies (no upload, local processing only)
      mediaProxies = await computeMediaProxies(file);
      
      const duration = mediaProxies.duration_s ? `${Math.round(mediaProxies.duration_s)}s` : 'Unknown';
      const level = mediaProxies.avg_level_dbfs ? `${Math.round(mediaProxies.avg_level_dbfs)}dB` : 'Unknown';
      const motion = mediaProxies.motion_estimate ? `${Math.round(mediaProxies.motion_estimate * 100)}%` : 'Unknown';
      
      mediaPreview.innerHTML = `
        <strong>${file.name}</strong><br>
        Duration: ${duration} | Level: ${level}${file.type.startsWith('video') ? ` | Motion: ${motion}` : ''}
      `;
    } catch (error) {
      console.error('Error processing media:', error);
      mediaPreview.textContent = `Error processing ${file.name}`;
      mediaProxies = {};
    }
  }

  async function computeMediaProxies(file: File): Promise<{
    duration_s?: number;
    avg_level_dbfs?: number;
    motion_estimate?: number;
  }> {
    const proxies: {
      duration_s?: number;
      avg_level_dbfs?: number;
      motion_estimate?: number;
    } = {};

    try {
      if (file.type.startsWith('audio/')) {
        // Audio processing
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        proxies.duration_s = audioBuffer.duration;
        
        // Compute average level (simplified)
        const channelData = audioBuffer.getChannelData(0);
        const samples = channelData.length;
        let sum = 0;
        for (let i = 0; i < samples; i += 1000) { // Sample every 1000th sample
          sum += Math.abs(channelData[i]);
        }
        const avgAmplitude = sum / (samples / 1000);
        proxies.avg_level_dbfs = 20 * Math.log10(avgAmplitude) + 60; // Rough dBFS approximation
        
        audioContext.close();
      } else if (file.type.startsWith('video/')) {
        // Video processing (simplified)
        const video = document.createElement('video');
        video.src = URL.createObjectURL(file);
        
        await new Promise<void>((resolve) => {
          video.onloadedmetadata = () => {
            proxies.duration_s = video.duration;
            proxies.motion_estimate = Math.random() * 0.5 + 0.2; // Placeholder motion estimate
            URL.revokeObjectURL(video.src);
            resolve();
          };
        });
      }
    } catch (error) {
      console.warn('Media processing failed:', error);
    }

    return proxies;
  }

  function getContext(): any {
    const ctx: any = {};
    if (triggerSel.value) ctx.trigger = triggerSel.value as any;
    const dur = durationInput.value.trim();
    if (dur !== '') {
      const n = Number(dur);
      if (!isNaN(n)) ctx.duration_min = clamp(n, 0, 30);
    }
    const coRegVals = checkboxGroupValues(coRegDiv, 'input[type=checkbox]');
    if (coRegVals.length) ctx.co_reg = coRegVals;
    if (noiseCb.checked) ctx.environment_noise = true;
    const notes = notesTa.value.trim();
    if (notes) ctx.notes = notes.slice(0, 120);
    
    // Add intensity and media proxies
    ctx.intensity_1_10 = thermometer.getValue();
    
    if (Object.keys(mediaProxies).length > 0) {
      ctx.tantrum_proxy = mediaProxies;
    }

    return ctx;
  }

  function validate(): { ok: true } | { ok: false; message: string } {
    const dur = durationInput.value.trim();
    if (dur !== '') {
      const n = Number(dur);
      if (isNaN(n) || n < 0 || n > 30) return { ok: false, message: 'Duration must be 0–30' };
    }
    return { ok: true };
  }

  async function reset() {
    triggerSel.value = '';
    durationInput.value = '';
    coRegDiv.querySelectorAll('input[type=checkbox]').forEach(cb => (cb as HTMLInputElement).checked = false);
    noiseCb.checked = false;
    notesTa.value = '';
    notesCounter.textContent = '0/120';
    thermometer.setValue(5);
    mediaInput.value = '';
    mediaProxies = {};
    mediaPreview.textContent = '';
  }

  return { mount, getContext, validate, reset };
}