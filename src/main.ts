/**
 * Main app - wires UI + modes + deep-link params
 */

import { FeatureExtractor } from './dsp/features.js';
import { Scorer } from './dsp/scoring.js';
import { AudioProcessor } from './audio/worklet-node.js';
import { SessionExporter } from './util/export.js';
import { ShareCard } from './ui/share-card.js';
import './style.css';

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
      token: urlParams.get('token') || null
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
    
    // Send data back to bot via Telegram
    await this.sendToBot(sessionJson, pngBlob);
  }

  private async sendToBot(sessionJson: string, pngBlob: Blob): Promise<void> {
    try {
      // Show sending status
      const exportBtn = document.getElementById('export-btn') as HTMLButtonElement;
      exportBtn.textContent = 'Sending to Bot...';
      exportBtn.disabled = true;
      
      // Send session data directly to bot via Telegram Bot API
      const botToken = this.getBotToken();
      const chatId = this.getChatId();
      
      console.log('Sending session to bot:', {
        score: this.currentScore,
        duration: this.formatDuration(Date.now() - this.startTime),
        badges: this.currentBadges,
        session: this.config.session,
        token: this.config.token ? '[REDACTED]' : 'none'
      });
      
      // Create session message
      const sessionMessage = `📊 **PWA Session Complete!**\n\n📊 Score: ${this.currentScore}/100\n⏱️ Duration: ${this.formatDuration(Date.now() - this.startTime)}\n🏷️ Badges: ${this.currentBadges.join(', ') || 'None detected'}\n📅 Session: ${this.config.session}${this.config.token ? `\n🔐 Token: ${this.config.token}` : ''}\n\nSession data has been sent to the bot.`;
      
      // Send to bot via Telegram Bot API
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: sessionMessage,
          parse_mode: 'Markdown'
        })
      });
      
      console.log('Bot response status:', response.status);
      
      if (response.ok) {
        // Show success message
        exportBtn.textContent = '✅ Sent to Bot';
        setTimeout(() => {
          exportBtn.textContent = 'Process Results';
          exportBtn.disabled = false;
        }, 3000);
        
        // Display success message
        const successMessage = document.createElement('div');
        successMessage.innerHTML = `
          <div style="background: #f0f9ff; border: 1px solid #10b981; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <h4>✅ Session Sent Successfully!</h4>
            <p>Your session data has been automatically sent to the bot.</p>
            <p><strong>Session ID:</strong> ${this.config.session}</p>
            <p>Check your Telegram chat for confirmation.</p>
          </div>
        `;
        document.querySelector('.container')?.appendChild(successMessage);
      } else {
        throw new Error(`Bot communication failed: ${response.status}`);
      }
      
    } catch (error) {
      console.error('Failed to process session:', error);
      
      // Fallback to download if processing fails
      this.downloadFile(sessionJson, 'session.json', 'application/json');
      this.downloadFile(pngBlob, 'session-card.png', 'image/png');
      
      const exportBtn = document.getElementById('export-btn') as HTMLButtonElement;
      exportBtn.textContent = 'Downloaded (Error occurred)';
      setTimeout(() => {
        exportBtn.textContent = 'Export Results';
        exportBtn.disabled = false;
      }, 3000);
    }
  }

  private getBotToken(): string {
    // Extract bot token from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const botToken = urlParams.get('bot_token');
    console.log('URL parameters:', window.location.search);
    console.log('Bot token from URL:', botToken ? '[REDACTED]' : 'NOT_FOUND');
    
    if (!botToken) {
      console.error('No bot_token found in URL parameters');
      console.log('Available URL parameters:', Array.from(urlParams.entries()).map(([k, v]) => [k, k === 'bot_token' ? '[REDACTED]' : v]));
      throw new Error('Bot token not provided');
    }
    
    // Decode the bot token in case it was URL encoded
    const decodedToken = decodeURIComponent(botToken);
    console.log('Decoded bot token:', '[REDACTED]');
    
    return decodedToken;
  }

  private getChatId(): string {
    // Extract chat ID from family ID
    const familyId = this.config.family;
    const chatId = familyId.replace('fam_', '');
    return chatId;
  }

  private formatDuration(duration: number): string {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
}

// Initialize app
new SilliApp();
