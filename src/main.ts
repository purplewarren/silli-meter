/**
 * Main app - wires UI + modes + deep-link params
 */


import { FeatureExtractor } from './dsp/features.js';
import { Scorer } from './dsp/scoring.js';
import { AudioProcessor } from './audio/worklet-node.js';
import { SessionExporter } from './util/export.js';
import { ShareCard } from './ui/share-card.js';
import './style.css';

const RELAY_INGEST_URL = 'https://silli-auto-ingest-relay.silli-tg-bot.workers.dev/ingest';

interface AppConfig {
  mode: 'helper' | 'low_power';
  family: string;
  session: string;
  token: string | null;
}

class SilliApp {
  private config: AppConfig;
  private audioProcessor: AudioProcessor | null = null;
  private featureExtractor: FeatureExtractor;
  private scorer: Scorer;
  private sessionExporter: SessionExporter;
  private shareCard: ShareCard;
  
  private isRunning = false;
  private startTime: number = 0;
  private sessionData: any[] = [];
  private currentScore = 0;
  private currentBadges: string[] = [];
  private currentTips: string[] = [];
  private lastTipTime = 0;

  constructor() {
    this.config = this.parseUrlParams();
    console.log('Token after parsing:', this.config.token ? 'FOUND' : 'NOT_FOUND');
    this.stripTokenFromUrl();
    console.log('Token after stripping:', this.config.token ? 'FOUND' : 'NOT_FOUND');
    this.featureExtractor = new FeatureExtractor();
    this.scorer = new Scorer();
    this.sessionExporter = new SessionExporter();
    this.shareCard = new ShareCard();
    
    this.initializeUI();
    this.loadWeightsAndTips();
  }

  private parseUrlParams(): AppConfig {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      mode: (urlParams.get('mode') as 'helper' | 'low_power') || 'helper',
      family: urlParams.get('family') || 'fam_unknown',
      session: urlParams.get('session') || `fam_unknown_${Date.now()}`,
      token: urlParams.get('tok') || null
    };
  }

  private async loadWeightsAndTips(): Promise<void> {
    await this.scorer.loadWeightsAndTips();
  }

  private initializeUI(): void {
    const app = document.getElementById('app')!;
    
    app.innerHTML = `
      <div class="container">
        <header>
          <h1>Silli Parent Night Helper</h1>
          <p class="mode">${this.config.mode === 'helper' ? 'Helper Mode' : 'Low-Power Mode'}</p>
        </header>
        
        <main>
          <div class="score-display">
            <div class="score-ring">
              <svg viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" stroke-width="8"/>
                <circle id="score-circle" cx="60" cy="60" r="50" fill="none" stroke="#6366f1" stroke-width="8" 
                        stroke-dasharray="314" stroke-dashoffset="314" transform="rotate(-90 60 60)"/>
              </svg>
              <div class="score-text">
                <span id="score-value">0</span>
                <span class="score-label">/100</span>
              </div>
            </div>
          </div>
          
          <div class="badges">
            <div id="badges-container"></div>
          </div>
          
          <div class="tips">
            <h3>Tips</h3>
            <div id="tips-container"></div>
          </div>
          
          <div class="controls">
            <button id="start-btn" class="btn primary">Start Session</button>
            <button id="stop-btn" class="btn secondary" disabled>Stop Session</button>
            <button id="export-btn" class="btn secondary" disabled>Process Results</button>
          </div>
          
          <div class="session-info">
            <p>Session: ${this.config.session}</p>
            <p>Duration: <span id="duration">00:00</span></p>
          </div>
        </main>
        
        <footer>
          <p class="privacy">Privacy: All analysis runs locally. No audio is uploaded.</p>
        </footer>
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    const startBtn = document.getElementById('start-btn')!;
    const stopBtn = document.getElementById('stop-btn')!;
    const exportBtn = document.getElementById('export-btn')!;

    startBtn.addEventListener('click', () => this.startSession());
    stopBtn.addEventListener('click', () => this.stopSession());
    exportBtn.addEventListener('click', () => this.exportResults());
  }

  private async startSession(): Promise<void> {
    try {
      this.audioProcessor = new AudioProcessor();
      await this.audioProcessor.initialize();
      
      this.isRunning = true;
      this.startTime = Date.now();
      this.sessionData = [];
      
      this.audioProcessor.start((audioData: Float32Array) => {
        this.processAudioFrame(audioData);
      });
      
      // Update UI
      (document.getElementById('start-btn') as HTMLButtonElement)!.disabled = true;
      (document.getElementById('stop-btn') as HTMLButtonElement)!.disabled = false;
      
      // Start timer
      this.updateTimer();
      
      // Request wake lock in helper mode
      if (this.config.mode === 'helper') {
        this.requestWakeLock();
      }
      
    } catch (error) {
      console.error('Failed to start session:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          alert('Microphone access denied. Please allow microphone permissions and try again.');
        } else if (error.name === 'NotFoundError') {
          alert('No microphone found. Please connect a microphone and try again.');
        } else {
          alert(`Audio initialization failed: ${error.message}. Please check microphone permissions and try again.`);
        }
      } else {
        alert('Could not start audio analysis. Please check microphone permissions and try again.');
      }
    }
  }

  private stopSession(): void {
    this.isRunning = false;
    this.audioProcessor?.stop();
    
    // Update UI
    (document.getElementById('start-btn') as HTMLButtonElement)!.disabled = false;
    (document.getElementById('stop-btn') as HTMLButtonElement)!.disabled = true;
    (document.getElementById('export-btn') as HTMLButtonElement)!.disabled = false;
  }

  private processAudioFrame(audioData: Float32Array): void {
    if (!this.isRunning) return;
    
    // Extract features
    const frameFeatures = this.featureExtractor.processFrame(audioData);
    
    // Store frame data
    this.sessionData.push({
      timestamp: Date.now() - this.startTime,
      features: frameFeatures
    });
    
    // Aggregate features every 10 seconds
    if (this.sessionData.length % 160 === 0) { // ~10 seconds at 16fps
      this.aggregateAndScore();
    }
  }

  private aggregateAndScore(): void {
    const recentFrames = this.sessionData.slice(-160); // Last 10 seconds
    const frameFeatures = recentFrames.map(d => d.features);
    
    // Aggregate features
    const aggregatedFeatures = this.featureExtractor.aggregateFeatures(frameFeatures);
    
    // Calculate score
    const result = this.scorer.calculateScore(aggregatedFeatures);
    
    // Update current state
    this.currentScore = result.score;
    this.currentBadges = result.badges;
    this.currentTips = result.tips;
    
    // Update UI
    this.updateScoreDisplay();
    this.updateBadges();
    
    // Show tip if enough time has passed
    const now = Date.now();
    if (now - this.lastTipTime > 60000) { // 1 minute
      this.showTip();
      this.lastTipTime = now;
    }
  }

  private updateScoreDisplay(): void {
    const scoreElement = document.getElementById('score-value')!;
    const circleElement = document.getElementById('score-circle')!;
    
    scoreElement.textContent = this.currentScore.toString();
    
    // Update progress ring
    const circumference = 2 * Math.PI * 50;
    const progress = this.currentScore / 100;
    const offset = circumference - (progress * circumference);
    circleElement.style.strokeDashoffset = offset.toString();
  }

  private updateBadges(): void {
    const container = document.getElementById('badges-container')!;
    container.innerHTML = this.currentBadges.map(badge => 
      `<span class="badge">${badge}</span>`
    ).join('');
  }

  private showTip(): void {
    const container = document.getElementById('tips-container')!;
    const tip = this.currentTips[Math.floor(Math.random() * this.currentTips.length)];
    
    container.innerHTML = `<p class="tip">${tip}</p>`;
  }

  private updateTimer(): void {
    if (!this.isRunning) return;
    
    const duration = Date.now() - this.startTime;
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    
    document.getElementById('duration')!.textContent = 
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    requestAnimationFrame(() => this.updateTimer());
  }

  private async requestWakeLock(): Promise<void> {
    try {
      if ('wakeLock' in navigator) {
        await navigator.wakeLock.request('screen');
        console.log('Wake lock acquired');
      }
    } catch (error) {
      console.warn('Could not acquire wake lock:', error);
    }
  }

  private async exportResults(): Promise<void> {
    const sessionJson = this.sessionExporter.exportSession({
      config: this.config,
      sessionData: this.sessionData,
      startTime: this.startTime,
      currentScore: this.currentScore,
      currentBadges: this.currentBadges
    });
    
    // Create PNG card
    const pngBlob = await this.shareCard.generateCard({
      score: this.currentScore,
      badges: this.currentBadges,
      duration: Date.now() - this.startTime
    });
    
    // Send data to relay
    await this.sendToRelay(sessionJson, pngBlob);
  }

  private async sendToRelay(sessionJson: string, pngBlob: Blob): Promise<void> {
    const exportBtn = document.getElementById('export-btn') as HTMLButtonElement;
    try {
      exportBtn.textContent = 'Sending to Silli...';
      exportBtn.disabled = true;

      const token = this.config.token;
      if (!token) {
        console.warn('No session token found in URL params (tok=...)');
        this.fallbackDownload(sessionJson, pngBlob, 'Missing session token. Files downloaded instead.');
        return;
      }

      console.log('Sending to relay with token:', token ? 'PRESENT' : 'MISSING');
      console.log('Relay URL:', RELAY_INGEST_URL);
      console.log('Session JSON length:', sessionJson.length);
      
      const resp = await fetch(RELAY_INGEST_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: sessionJson
      });

      console.log('Relay response status:', resp.status);
      
      if (!resp.ok) {
        const txt = await resp.text().catch(() => '');
        console.error('Relay error response:', txt);
        throw new Error(`Relay error: ${resp.status} ${txt}`);
      }
      
      const responseText = await resp.text();
      console.log('Relay success response:', responseText);

      // Success UI
      const success = document.createElement('div');
      success.innerHTML = `
        <div style="background: #f0fdf4; border: 1px solid #10b981; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <h4>✅ Session Sent to Silli</h4>
          <p>Your session report was delivered securely.</p>
          <p><strong>Session ID:</strong> ${this.config.session}</p>
          <p>You’ll see a confirmation in your Telegram chat.</p>
        </div>
      `;
      document.querySelector('.container')?.appendChild(success);

      exportBtn.textContent = 'Sent ✅';
    } catch (error) {
      console.error('Failed to send to relay:', error);
      this.fallbackDownload(sessionJson, pngBlob, 'Auto-send failed (offline or network issue). Files downloaded instead.');
      exportBtn.textContent = 'Downloaded';
    } finally {
      setTimeout(() => {
        exportBtn.textContent = 'Process Results';
        exportBtn.disabled = false;
      }, 3000);
    }
  }




  private downloadFile(content: any, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  private fallbackDownload(sessionJson: string, pngBlob: Blob, reason: string): void {
    this.downloadFile(sessionJson, 'session.json', 'application/json');
    this.downloadFile(pngBlob, 'session-card.png', 'image/png');

    const fallback = document.createElement('div');
    fallback.innerHTML = `
      <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 16px 0;">
        <h4>⚠️ Auto-send Unavailable</h4>
        <p>${reason}</p>
        <p><strong>Session ID:</strong> ${this.config.session}</p>
        <p>You can upload the session.json to the bot with /ingest as a fallback.</p>
      </div>
    `;
    document.querySelector('.container')?.appendChild(fallback);
  }

  private stripTokenFromUrl(): void {
    const u = new URL(window.location.href);
    if (u.searchParams.has('tok')) {
      u.searchParams.delete('tok');
      history.replaceState(null, '', u.toString());
    }
  }
}

// Initialize app
new SilliApp();
