/**
 * Tantrum Translator - Home Screen
 */

import { Router } from '../../router.js';
import { copy } from '../../copy.js';

export class TantrumHomeScreen {
  private container: HTMLElement;
  private router: Router;
  private intensitySlider: HTMLInputElement | null = null;

  constructor(container: HTMLElement, router: Router) {
    this.container = container;
    this.router = router;
  }

  public render(): void {
    this.container.innerHTML = `
      <div class="screen tantrum-home">
        <header class="screen-header">
          <h1>😤 ${copy.app.tantrumTranslator}</h1>
          <p class="subtitle">${copy.app.understandBeneathSurface}</p>
        </header>

        <main class="screen-content">
          <section class="intensity-section">
            <h3>${copy.sections.howIntense}</h3>
            <div class="intensity-control">
              <input type="range" id="intensity-slider" min="1" max="10" value="5" class="intensity-slider">
              <div class="intensity-labels">
                <span>${copy.intensity.mild}</span>
                <span>${copy.intensity.extreme}</span>
              </div>
              <div class="intensity-value">
                <span id="intensity-value">5</span>
              </div>
            </div>
          </section>

          <section class="actions-section">
            <h3>${copy.sections.howWouldYouLike}</h3>
            <div class="action-buttons">
              <button class="btn primary action-btn" data-action="voice">
                <span class="icon">🎤</span>
                <span class="label">${copy.buttons.uploadVoice}</span>
                <span class="description">${copy.descriptions.recordOrUpload}</span>
              </button>
              
              <button class="btn primary action-btn" data-action="video">
                <span class="icon">🎥</span>
                <span class="label">${copy.buttons.uploadVideo}</span>
                <span class="description">${copy.descriptions.recordOrUploadVideo}</span>
              </button>
              
              <button class="btn primary action-btn" data-action="text">
                <span class="icon">📝</span>
                <span class="label">${copy.buttons.addText}</span>
                <span class="description">${copy.descriptions.describeWhatHappened}</span>
              </button>
            </div>
          </section>

          <section class="privacy-notice">
            <p>🔒 ${copy.privacy.onDeviceProcessing}</p>
          </section>
        </main>

        <nav class="screen-nav">
          <button class="nav-btn" data-screen="history">📊 ${copy.buttons.history}</button>
          <button class="nav-btn" data-screen="settings">⚙️ ${copy.buttons.settings}</button>
        </nav>
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    // Intensity slider
    this.intensitySlider = this.container.querySelector('#intensity-slider') as HTMLInputElement;
    const intensityValue = this.container.querySelector('#intensity-value') as HTMLElement;
    
    if (this.intensitySlider && intensityValue) {
      this.intensitySlider.addEventListener('input', (e) => {
        const value = (e.target as HTMLInputElement).value;
        intensityValue.textContent = value;
      });
    }

    // Action buttons
    const actionButtons = this.container.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = (e.currentTarget as HTMLElement).dataset.action || '';
        const intensity = this.intensitySlider?.value || '5';
        
        this.router.navigate({
          dyad: 'tantrum',
          screen: 'capture',
          params: { action, intensity }
        });
      });
    });

    // Navigation buttons
    const navButtons = this.container.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const screen = (e.currentTarget as HTMLElement).dataset.screen as string;
        this.router.navigate({
          dyad: 'tantrum',
          screen: screen as any
        });
      });
    });
  }

  public destroy(): void {
    // Clean up event listeners if needed
  }
} 