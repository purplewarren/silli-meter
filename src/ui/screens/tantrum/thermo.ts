/**
 * Tantrum Translator - Thermometer & Analysis Screen
 */

import { Router } from '../../router.js';

export class TantrumThermoScreen {
  private container: HTMLElement;
  private router: Router;
  private intensity: string;
  private hasAudio: boolean;
  private hasVideo: boolean;
  private escalationIndex: number = 0;
  private currentTip: string = '';
  private currentBadge: string = '';
  private tipsData: any = null;
  private formHandle: any = null;

  constructor(container: HTMLElement, router: Router, intensity: string, hasAudio: string, hasVideo: string) {
    this.container = container;
    this.router = router;
    this.intensity = intensity;
    this.hasAudio = hasAudio === 'true';
    this.hasVideo = hasVideo === 'true';
  }

  public async render(): Promise<void> {
    await this.loadTipsData();
    
    this.container.innerHTML = `
      <div class="screen tantrum-thermo">
        <header class="screen-header">
          <button class="back-btn" data-action="back">← Back</button>
          <h1>📊 Emotion Thermometer</h1>
        </header>

        <main class="screen-content">
          <section class="thermometer-section">
            <h3>Live Intensity Reading</h3>
            <div class="thermometer">
              <div class="thermometer-scale">
                <div class="thermometer-fill" id="thermometer-fill" style="height: ${this.intensity}0%"></div>
                <div class="thermometer-marker" id="thermometer-marker" style="bottom: ${this.intensity}0%">
                  <span class="marker-value" id="marker-value">${this.intensity}</span>
                </div>
              </div>
              <div class="thermometer-labels">
                <span class="label">Calm</span>
                <span class="label">Moderate</span>
                <span class="label">Intense</span>
              </div>
            </div>
            
            <div class="intensity-sources">
              <div class="source-item">
                <span class="label">User Rating:</span>
                <span class="value">${this.intensity}/10</span>
              </div>
              <div class="source-item" id="computed-intensity" style="display: none;">
                <span class="label">Computed:</span>
                <span class="value" id="computed-value">-</span>
              </div>
            </div>
          </section>

          <section class="analysis-section">
            <h3>Analysis Results</h3>
            <div class="analysis-grid">
              <div class="analysis-card">
                <div class="analysis-icon">📈</div>
                <h4>Escalation Index</h4>
                <div class="analysis-value" id="escalation-value">${this.escalationIndex.toFixed(2)}</div>
              </div>
              
              <div class="analysis-card">
                <div class="analysis-icon">🎤</div>
                <h4>Audio Analysis</h4>
                <div class="analysis-value" id="audio-status">${this.hasAudio ? 'Available' : 'None'}</div>
              </div>
              
              <div class="analysis-card">
                <div class="analysis-icon">🎥</div>
                <h4>Video Analysis</h4>
                <div class="analysis-value" id="video-status">${this.hasVideo ? 'Available' : 'None'}</div>
              </div>
            </div>
          </section>

          <section class="tip-section">
            <h3>Actionable Tip</h3>
            <div class="tip-card">
              <div class="tip-content" id="tip-content">
                Loading tip...
              </div>
            </div>
          </section>

          <section class="badge-section" id="badge-section" style="display: none;">
            <h3>Positive Action</h3>
            <div class="badge-card">
              <div class="badge-content" id="badge-content">
                <!-- Badge will be inserted here -->
              </div>
            </div>
          </section>

          <section class="context-section">
            <h3>Additional Context</h3>
            <div id="context-form"></div>
          </section>

          <section class="privacy-notice">
            <p>🔒 Analysis completed on your device. No data was sent to servers.</p>
          </section>
        </main>

        <nav class="screen-nav">
          <button class="btn secondary" data-action="save">💾 Save</button>
          <button class="btn primary" data-action="export">📤 Export Results</button>
        </nav>
      </div>
    `;

    this.bindEvents();
    await this.performAnalysis();
    this.setupContextForm();
  }

  private async loadTipsData(): Promise<void> {
    try {
      const response = await fetch('/scoring/tantrum/tips.json');
      this.tipsData = await response.json();
    } catch (error) {
      console.error('Failed to load tips data:', error);
      this.tipsData = { tips: {}, badges: {}, escalation_bins: {} };
    }
  }

  private async performAnalysis(): Promise<void> {
    // Simulate analysis (in real implementation, this would process actual media)
    this.escalationIndex = Math.random() * 0.8 + 0.1; // 0.1 to 0.9
    
    // Update UI
    this.updateThermometer();
    this.updateAnalysis();
    this.selectTip();
  }

  private updateThermometer(): void {
    const computedIntensity = Math.round(this.escalationIndex * 10);
    const displayIntensity = this.intensity || computedIntensity.toString();
    
    const fill = this.container.querySelector('#thermometer-fill') as HTMLElement;
    const marker = this.container.querySelector('#thermometer-marker') as HTMLElement;
    const value = this.container.querySelector('#marker-value') as HTMLElement;
    const computedDiv = this.container.querySelector('#computed-intensity') as HTMLElement;
    const computedValue = this.container.querySelector('#computed-value') as HTMLElement;
    
    if (fill && marker && value) {
      fill.style.height = `${displayIntensity}0%`;
      marker.style.bottom = `${displayIntensity}0%`;
      value.textContent = displayIntensity;
    }
    
    if (computedDiv && computedValue) {
      computedDiv.style.display = 'block';
      computedValue.textContent = `${computedIntensity}/10`;
    }
  }

  private updateAnalysis(): void {
    const escalationValue = this.container.querySelector('#escalation-value') as HTMLElement;
    if (escalationValue) {
      escalationValue.textContent = this.escalationIndex.toFixed(2);
    }
  }

  private selectTip(): void {
    if (!this.tipsData) return;
    
    // Get trigger from form or use default
    const trigger = 'unknown'; // In real implementation, get from form
    const escalationLevel = this.getEscalationLevel(this.escalationIndex);
    
    const tips = this.tipsData.tips[trigger]?.[escalationLevel] || 
                 this.tipsData.tips.unknown?.[escalationLevel] || 
                 ['Stay calm and present - your child needs your stability'];
    
    this.currentTip = tips[Math.floor(Math.random() * tips.length)];
    
    const tipContent = this.container.querySelector('#tip-content') as HTMLElement;
    if (tipContent) {
      tipContent.textContent = this.currentTip;
    }
  }

  private getEscalationLevel(escalationIndex: number): 'low' | 'medium' | 'high' {
    if (escalationIndex < 0.33) return 'low';
    if (escalationIndex < 0.66) return 'medium';
    return 'high';
  }

  private setupContextForm(): void {
    const contextForm = this.container.querySelector('#context-form');
    if (contextForm) {
      // Form setup will be implemented when needed
      contextForm.innerHTML = '<p>Context form will be available in future updates.</p>';
    }
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

    // Export button
    const exportBtn = this.container.querySelector('[data-action="export"]');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.handleExport();
      });
    }
  }

  private async handleSave(): Promise<void> {
    // Save to local storage
    this.saveToHistory(this.prepareSessionData());
    
    // Navigate to history
    this.router.navigate({ dyad: 'tantrum', screen: 'history' });
  }

  private async handleExport(): Promise<void> {
    // Create export JSON
    const exportData = {
      dyad: 'tantrum',
      timestamp: new Date().toISOString(),
      intensity_user: parseInt(this.intensity),
      metrics: {
        escalation_index: this.escalationIndex
      },
      media_summaries: {
        has_audio: this.hasAudio,
        has_video: this.hasVideo,
        audio: {
          rms_p50: 0.5, // Example values
          vad_fraction: 0.3
        },
        video: {
          motion_score_p95: this.hasVideo ? 0.7 : undefined
        }
      },
      context: this.formHandle ? this.formHandle.getContext() : {},
      tip: this.currentTip,
      badge: this.currentBadge
    };
    
    // Download JSON file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tantrum-session-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private prepareSessionData(): any {
    return {
      timestamp: new Date().toISOString(),
      intensity: parseInt(this.intensity),
      escalationIndex: this.escalationIndex,
      hasAudio: this.hasAudio,
      hasVideo: this.hasVideo,
      tip: this.currentTip,
      badge: this.currentBadge,
      context: this.formHandle ? this.formHandle.getContext() : {}
    };
  }

  private saveToHistory(sessionData: any): void {
    const historyKey = 'tantrum_history';
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    
    // Add new session
    history.unshift(sessionData);
    
    // Keep only last 14 sessions
    if (history.length > 14) {
      history.splice(14);
    }
    
    localStorage.setItem(historyKey, JSON.stringify(history));
  }

  public destroy(): void {
    if (this.formHandle) {
      // Clean up form if needed
    }
  }
} 