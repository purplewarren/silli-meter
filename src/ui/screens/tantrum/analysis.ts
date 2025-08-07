/**
 * Tantrum Translator - Analysis Screen
 */

import { Router } from '../../router.js';

export class TantrumAnalysisScreen {
  private container: HTMLElement;
  private router: Router;
  private intensity: string;

  constructor(container: HTMLElement, router: Router, intensity: string) {
    this.container = container;
    this.router = router;
    this.intensity = intensity;
  }

  public render(): void {
    this.container.innerHTML = `
      <div class="screen tantrum-analysis">
        <header class="screen-header">
          <button class="back-btn" data-action="back">← Back</button>
          <h1>📊 Analysis Results</h1>
        </header>

        <main class="screen-content">
          <section class="thermometer-section">
            <h3>Emotional Thermometer</h3>
            <div class="thermometer">
              <div class="thermometer-scale">
                <div class="thermometer-fill" style="height: ${this.intensity}0%"></div>
                <div class="thermometer-marker" style="bottom: ${this.intensity}0%">
                  <span class="marker-value">${this.intensity}</span>
                </div>
              </div>
              <div class="thermometer-labels">
                <span class="label">Calm</span>
                <span class="label">Moderate</span>
                <span class="label">Intense</span>
              </div>
            </div>
          </section>

          <section class="insights-section">
            <h3>What This Might Mean</h3>
            <div class="insights-grid">
              <div class="insight-card">
                <div class="insight-icon">🧠</div>
                <h4>Brain Development</h4>
                <p>Your child's prefrontal cortex is still developing. This is normal behavior for their age.</p>
              </div>
              
              <div class="insight-card">
                <div class="insight-icon">😤</div>
                <h4>Communication Gap</h4>
                <p>They may be struggling to express complex emotions or needs verbally.</p>
              </div>
              
              <div class="insight-card">
                <div class="insight-icon">⚡</div>
                <h4>Energy Release</h4>
                <p>This could be a way to release built-up energy or frustration from the day.</p>
              </div>
            </div>
          </section>

          <section class="suggestions-section">
            <h3>Gentle Suggestions</h3>
            <div class="suggestions-list">
              <div class="suggestion-item">
                <span class="icon">🤗</span>
                <span class="text">Stay calm and present - your child needs your stability</span>
              </div>
              <div class="suggestion-item">
                <span class="icon">🗣️</span>
                <span class="text">Use simple, calm words to name their feelings</span>
              </div>
              <div class="suggestion-item">
                <span class="icon">⏰</span>
                <span class="text">Wait for the storm to pass before problem-solving</span>
              </div>
            </div>
          </section>

          <section class="privacy-notice">
            <p>🔒 Analysis completed on your device. No data was sent to servers.</p>
          </section>
        </main>

        <nav class="screen-nav">
          <button class="btn secondary" data-action="save">💾 Save</button>
          <button class="btn primary" data-action="share">📤 Share</button>
        </nav>
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    // Back button
    const backBtn = this.container.querySelector('.back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.router.navigate({ dyad: 'tantrum', screen: 'home' });
      });
    }

    // Save button
    const saveBtn = this.container.querySelector('[data-action="save"]');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.handleSave();
      });
    }

    // Share button
    const shareBtn = this.container.querySelector('[data-action="share"]');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        this.handleShare();
      });
    }
  }

  private handleSave(): void {
    // TODO: Implement save functionality
    console.log('Saving tantrum analysis');
    
    // Navigate to history
    this.router.navigate({ dyad: 'tantrum', screen: 'history' });
  }

  private handleShare(): void {
    // TODO: Implement share functionality
    console.log('Sharing tantrum analysis');
    
    // For now, just show a success message
    const shareBtn = this.container.querySelector('[data-action="share"]') as HTMLButtonElement;
    if (shareBtn) {
      shareBtn.textContent = '✓ Shared';
      shareBtn.disabled = true;
      
      setTimeout(() => {
        shareBtn.textContent = '📤 Share';
        shareBtn.disabled = false;
      }, 2000);
    }
  }

  public destroy(): void {
    // Clean up event listeners if needed
  }
} 