/**
 * Tantrum Translator - Settings & Privacy Screen
 */

import { Router } from '../../router.js';

export class TantrumSettingsScreen {
  private container: HTMLElement;
  private router: Router;

  constructor(container: HTMLElement, router: Router) {
    this.container = container;
    this.router = router;
  }

  public render(): void {
    this.container.innerHTML = `
      <div class="screen tantrum-settings">
        <header class="screen-header">
          <button class="back-btn" data-action="back">← Back</button>
          <h1>⚙️ Settings & Privacy</h1>
        </header>

        <main class="screen-content">
          <section class="privacy-section">
            <h3>🔒 Privacy & Data</h3>
            <div class="privacy-info">
              <div class="privacy-item">
                <div class="privacy-icon">📱</div>
                <div class="privacy-content">
                  <h4>On-Device Processing</h4>
                  <p>All audio, video, and text analysis happens on your device. Nothing is sent to our servers.</p>
                </div>
              </div>
              
              <div class="privacy-item">
                <div class="privacy-icon">🗂️</div>
                <div class="privacy-content">
                  <h4>Local Storage</h4>
                  <p>Your session data is stored locally on your device. You control what gets shared.</p>
                </div>
              </div>
              
              <div class="privacy-item">
                <div class="privacy-icon">🔐</div>
                <div class="privacy-content">
                  <h4>Secure Sharing</h4>
                  <p>When you choose to share, only summary data is sent via encrypted channels.</p>
                </div>
              </div>
            </div>
          </section>

          <section class="preferences-section">
            <h3>⚙️ Preferences</h3>
            <div class="preferences-list">
              <div class="preference-item">
                <div class="preference-label">
                  <span>Auto-save sessions</span>
                  <span class="preference-description">Save analysis results automatically</span>
                </div>
                <label class="toggle">
                  <input type="checkbox" checked>
                  <span class="toggle-slider"></span>
                </label>
              </div>
              
              <div class="preference-item">
                <div class="preference-label">
                  <span>Show patterns</span>
                  <span class="preference-description">Display insights and trends</span>
                </div>
                <label class="toggle">
                  <input type="checkbox" checked>
                  <span class="toggle-slider"></span>
                </label>
              </div>
              
              <div class="preference-item">
                <div class="preference-label">
                  <span>Reminder notifications</span>
                  <span class="preference-description">Gentle reminders to log sessions</span>
                </div>
                <label class="toggle">
                  <input type="checkbox">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </section>

          <section class="data-section">
            <h3>📊 Data Management</h3>
            <div class="data-actions">
              <button class="btn secondary data-btn" data-action="export-all">
                📤 Export All Data
              </button>
              <button class="btn secondary data-btn" data-action="clear-data">
                🗑️ Clear All Data
              </button>
            </div>
          </section>

          <section class="about-section">
            <h3>ℹ️ About</h3>
            <div class="about-content">
              <p><strong>Tantrum Translator v1.0</strong></p>
              <p>Helping you understand your child's emotional world through gentle, privacy-first analysis.</p>
              <p class="version">Version 1.0.0 • Built with ❤️ for families</p>
            </div>
          </section>
        </main>

        <nav class="screen-nav">
          <button class="btn primary" data-action="done">Done</button>
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

    // Done button
    const doneBtn = this.container.querySelector('[data-action="done"]');
    if (doneBtn) {
      doneBtn.addEventListener('click', () => {
        this.router.navigate({ dyad: 'tantrum', screen: 'home' });
      });
    }

    // Export all data
    const exportAllBtn = this.container.querySelector('[data-action="export-all"]');
    if (exportAllBtn) {
      exportAllBtn.addEventListener('click', () => {
        this.handleExportAll();
      });
    }

    // Clear all data
    const clearDataBtn = this.container.querySelector('[data-action="clear-data"]');
    if (clearDataBtn) {
      clearDataBtn.addEventListener('click', () => {
        this.handleClearData();
      });
    }

    // Toggle switches
    const toggles = this.container.querySelectorAll('.toggle input');
    toggles.forEach(toggle => {
      toggle.addEventListener('change', (e) => {
        this.handlePreferenceChange(e.target as HTMLInputElement);
      });
    });
  }

  private handleExportAll(): void {
    // TODO: Implement export all functionality
    console.log('Exporting all tantrum data');
    
    const exportBtn = this.container.querySelector('[data-action="export-all"]') as HTMLButtonElement;
    if (exportBtn) {
      exportBtn.textContent = '✓ Exported';
      exportBtn.disabled = true;
      
      setTimeout(() => {
        exportBtn.textContent = '📤 Export All Data';
        exportBtn.disabled = false;
      }, 2000);
    }
  }

  private handleClearData(): void {
    // TODO: Implement clear data functionality with confirmation
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      console.log('Clearing all tantrum data');
      
      const clearBtn = this.container.querySelector('[data-action="clear-data"]') as HTMLButtonElement;
      if (clearBtn) {
        clearBtn.textContent = '✓ Cleared';
        clearBtn.disabled = true;
        
        setTimeout(() => {
          clearBtn.textContent = '🗑️ Clear All Data';
          clearBtn.disabled = false;
        }, 2000);
      }
    }
  }

  private handlePreferenceChange(toggle: HTMLInputElement): void {
    const preference = toggle.closest('.preference-item')?.querySelector('.preference-label span')?.textContent;
    console.log(`Preference changed: ${preference} = ${toggle.checked}`);
    
    // TODO: Save preference to local storage
  }

  public destroy(): void {
    // Clean up event listeners if needed
  }
} 