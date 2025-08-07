/**
 * Main app - wires UI + modes + deep-link params with dyad routing
 */

import { Router } from './ui/router.js';
import { TantrumHomeScreen } from './ui/screens/tantrum/home.js';
import { TantrumCaptureScreen } from './ui/screens/tantrum/capture.js';
import { TantrumThermoScreen } from './ui/screens/tantrum/thermo.js';
import { TantrumHistoryScreen } from './ui/screens/tantrum/history.js';
import { TantrumSettingsScreen } from './ui/screens/tantrum/settings.js';
import { MealHomeScreen } from './ui/screens/meal/home.js';
import { MealLoggingScreen } from './ui/screens/meal/meal-logging.js';
import { MealInsightsScreen } from './ui/screens/meal/insights.js';
import { MealGalleryScreen } from './ui/screens/meal/gallery.js';
import { MealSettingsScreen } from './ui/screens/meal/settings.js';
import { createTantrumForm } from './ui/forms/tantrum.js';
import { localStore } from './util/local_store.js';
import './style.css';

interface AppConfig {
  mode: 'helper' | 'low_power';
  family: string;
  session: string;
  token: string | null;
  dyad: 'night' | 'tantrum' | 'meal';
}

class SilliApp {
  private config: AppConfig;
  private router: Router;
  private container: HTMLElement;
  private currentScreen: any = null;
  private tantrumForm: any = null;

  constructor() {
    this.config = this.parseUrlParams();
    console.log('App config:', this.config);
    this.stripTokenFromUrl();
    
    this.container = document.getElementById('app')!;
    this.router = new Router();
    
    this.initializeUI();
    this.setupRoutes();
  }

  private parseUrlParams(): AppConfig {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      mode: (urlParams.get('mode') as 'helper' | 'low_power') || 'helper',
      family: urlParams.get('family') || 'fam_unknown',
      session: urlParams.get('session') || `fam_unknown_${Date.now()}`,
      token: urlParams.get('tok') || null,
      dyad: (urlParams.get('dyad') as 'night' | 'tantrum' | 'meal') || 'night'
    };
  }

  private initializeUI(): void {
    // Set initial hash based on dyad
    if (!window.location.hash) {
      // Route to the appropriate dyad home screen
      if (this.config.dyad === 'tantrum') {
        window.location.hash = '#tantrum/home';
      } else if (this.config.dyad === 'meal') {
        window.location.hash = '#meal/home';
      } else {
        // Default to night helper
        window.location.hash = '#night/home';
      }
    }
  }

  private setupRoutes(): void {
    // Tantrum routes
    this.router.register({ dyad: 'tantrum', screen: 'home' }, () => {
      this.renderScreen(new TantrumHomeScreen(this.container, this.router));
    });

    this.router.register({ dyad: 'tantrum', screen: 'capture' }, () => {
      const route = this.router.getCurrentRoute();
      const intensity = route?.params?.intensity || '5';
      this.renderScreen(new TantrumCaptureScreen(this.container, this.router, intensity));
    });

    this.router.register({ dyad: 'tantrum', screen: 'thermo' }, () => {
      const route = this.router.getCurrentRoute();
      const intensity = route?.params?.intensity || '5';
      const hasAudio = route?.params?.hasAudio || 'false';
      const hasVideo = route?.params?.hasVideo || 'false';
      this.renderScreen(new TantrumThermoScreen(this.container, this.router, intensity, hasAudio, hasVideo));
    });

    this.router.register({ dyad: 'tantrum', screen: 'history' }, () => {
      this.renderScreen(new TantrumHistoryScreen(this.container, this.router));
    });

    this.router.register({ dyad: 'tantrum', screen: 'settings' }, () => {
      this.renderScreen(new TantrumSettingsScreen(this.container, this.router));
    });

    // New enhanced tantrum form route
    this.router.register({ dyad: 'tantrum', screen: 'form' }, () => {
      this.renderTantrumForm();
    });

    // Meal routes
    this.router.register({ dyad: 'meal', screen: 'home' }, () => {
      this.renderScreen(new MealHomeScreen(this.container, this.router));
    });

    this.router.register({ dyad: 'meal', screen: 'meal-logging' }, () => {
      const route = this.router.getCurrentRoute();
      const action = route?.params?.action || '';
      const rating = route?.params?.rating || '0';
      this.renderScreen(new MealLoggingScreen(this.container, this.router, action, rating));
    });

    this.router.register({ dyad: 'meal', screen: 'insights' }, () => {
      const route = this.router.getCurrentRoute();
      const rating = route?.params?.rating || '0';
      const hasImage = route?.params?.hasImage || 'false';
      const dietaryDiversity = route?.params?.dietaryDiversity || '0.5';
      const clutterScore = route?.params?.clutterScore || '0.5';
      const plateCoverage = route?.params?.plateCoverage || '0.5';
      const mode = route?.params?.mode || 'patterns';
      this.renderScreen(new MealInsightsScreen(this.container, this.router, rating, hasImage, dietaryDiversity, clutterScore, plateCoverage, mode));
    });

    this.router.register({ dyad: 'meal', screen: 'gallery' }, () => {
      this.renderScreen(new MealGalleryScreen(this.container, this.router));
    });

    this.router.register({ dyad: 'meal', screen: 'settings' }, () => {
      this.renderScreen(new MealSettingsScreen(this.container, this.router));
    });

    // Night routes (fallback to original functionality)
    this.router.register({ dyad: 'night', screen: 'home' }, () => {
      this.renderNightScreen();
    });
  }

  private renderTantrumForm(): void {
    // Clean up previous screen
    if (this.currentScreen && this.currentScreen.destroy) {
      this.currentScreen.destroy();
    }

    this.container.innerHTML = `
      <div class="screen tantrum-form">
        <header class="screen-header">
          <button class="back-btn" data-action="back">← Back</button>
          <h1>😤 Tantrum Tracker</h1>
        </header>

        <main class="screen-content">
          <div id="tantrum-form-container"></div>
        </main>

        <nav class="screen-nav">
          <button class="btn secondary" data-action="cancel">Cancel</button>
          <button class="btn primary" data-action="save">Save Session</button>
        </nav>
      </div>
    `;

    // Mount the enhanced tantrum form
    const formContainer = this.container.querySelector('#tantrum-form-container') as HTMLElement;
    this.tantrumForm = createTantrumForm();
    this.tantrumForm.mount(formContainer);

    // Bind events
    this.bindTantrumFormEvents();
  }

  private bindTantrumFormEvents(): void {
    // Back button
    const backBtn = this.container.querySelector('.back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.router.navigate({ dyad: 'tantrum', screen: 'home' });
      });
    }

    // Cancel button
    const cancelBtn = this.container.querySelector('[data-action="cancel"]');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.router.navigate({ dyad: 'tantrum', screen: 'home' });
      });
    }

    // Save button
    const saveBtn = this.container.querySelector('[data-action="save"]');
    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        await this.saveTantrumSession();
      });
    }
  }

  private async saveTantrumSession(): Promise<void> {
    if (!this.tantrumForm) return;

    const validation = this.tantrumForm.validate();
    if (!validation.ok) {
      alert(validation.message);
      return;
    }

    const context = this.tantrumForm.getContext();
    
    // Create session data
    const session: any = {
      id: `tantrum_${Date.now()}`,
      ts: new Date().toISOString(),
      family_id: this.config.family,
      session_id: this.config.session,
      ...context
    };

    try {
      // Save to local storage
      await localStore.saveSession(session);
      
      // Show success message
      alert('Session saved successfully!');
      
      // Reset form and navigate back
      this.tantrumForm.reset();
      this.router.navigate({ dyad: 'tantrum', screen: 'home' });
    } catch (error) {
      console.error('Error saving session:', error);
      alert('Error saving session. Please try again.');
    }
  }

  private renderScreen(screen: any): void {
    // Clean up previous screen
    if (this.currentScreen && this.currentScreen.destroy) {
      this.currentScreen.destroy();
    }

    this.currentScreen = screen;
    screen.render();
  }

  private renderNightScreen(): void {
    // Fallback to original night helper functionality
    const dyadName = 'Night Helper';
    
    this.container.innerHTML = `
      <div class="container">
        <header>
          <h1>Silli ${dyadName}</h1>
          <p class="mode">${this.config.mode === 'helper' ? 'Helper Mode' : 'Low-Power Mode'}</p>
        </header>
        
        <main>
          <div class="score-display">
            <div class="score-ring">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#2d2d2d" stroke-width="8"/>
                <circle cx="50" cy="50" r="45" fill="none" stroke="#6366f1" stroke-width="8" 
                        stroke-dasharray="283" stroke-dashoffset="283" 
                        transform="rotate(-90 50 50)" id="score-circle"/>
              </svg>
              <div class="score-text">
                <span id="score-value">0</span>
                <div class="score-label">Score</div>
              </div>
            </div>
          </div>

          <div class="badges">
            <h3>Badges</h3>
            <div id="badges-container"></div>
          </div>

          <div class="tips">
            <h3>Tips</h3>
            <div id="tips-container"></div>
          </div>

          <div class="controls">
            <button id="start-btn" class="btn primary">Start Session</button>
            <button id="stop-btn" class="btn secondary" disabled>Stop Session</button>
            <button id="export-btn" class="btn secondary" disabled>Export Results</button>
          </div>

          <div class="session-info">
            <p>Family: ${this.config.family}</p>
            <p>Session: ${this.config.session}</p>
            <p id="timer">Duration: 00:00</p>
          </div>
        </main>

        <footer>
          <div class="privacy">
            <p>🔒 All processing happens on your device. Audio stays private.</p>
          </div>
        </footer>
      </div>
    `;

    // Add basic night helper functionality here if needed
    console.log('Night helper screen rendered');
  }

  private stripTokenFromUrl(): void {
    if (this.config.token) {
      const url = new URL(window.location.href);
      url.searchParams.delete('tok');
      window.history.replaceState({}, '', url.toString());
    }
  }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  new SilliApp();
});
