/**
 * Tantrum Translator - Capture Screen
 */

import { Router } from '../../router.js';
import { copy } from '../../copy.js';

export class TantrumCaptureScreen {
  private container: HTMLElement;
  private router: Router;
  private intensity: string;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private videoChunks: Blob[] = [];
  private isRecording = false;
  private recordingStartTime = 0;
  private recordingTimer: number | null = null;
  private captureType: 'audio' | 'video' = 'audio';

  constructor(container: HTMLElement, router: Router, intensity: string) {
    this.container = container;
    this.router = router;
    this.intensity = intensity;
  }

  public render(): void {
    this.container.innerHTML = `
      <div class="screen tantrum-capture">
        <header class="screen-header">
          <button class="back-btn" data-action="back">← Back</button>
          <h1>🎤 Capture Tantrum</h1>
        </header>

        <main class="screen-content">
          <section class="capture-section">
            <div class="capture-area">
              <div class="capture-placeholder" id="capture-placeholder">
                <span class="icon">🎤</span>
                <p>Ready to record audio or upload media</p>
              </div>
              
              <div class="recording-display" id="recording-display" style="display: none;">
                <div class="recording-indicator">
                  <div class="pulse-dot"></div>
                  <span id="recording-time">00:00</span>
                </div>
                <p>Recording... Tap to stop</p>
              </div>
              
              <div class="capture-controls">
                <button class="btn primary capture-btn" id="capture-btn" data-action="capture">
                  Start Recording
                </button>
                
                <button class="btn secondary upload-btn" data-action="upload">
                  📁 Upload File
                </button>
              </div>
            </div>
          </section>

          <section class="context-section">
            <h3>Context</h3>
            <div class="context-info">
              <div class="context-item">
                <span class="label">Intensity Level:</span>
                <span class="value">${this.intensity}/10</span>
              </div>
              <div class="context-item">
                <span class="label">Type:</span>
                <span class="value" id="capture-type">Audio</span>
              </div>
            </div>
          </section>

          <section class="privacy-notice">
            <p>🔒 ${copy.privacy.recordingsNeverLeave}</p>
          </section>
        </main>

        <nav class="screen-nav">
          <button class="btn secondary" data-action="cancel">${copy.buttons.cancel}</button>
          <button class="btn primary" data-action="analyze" disabled>${copy.buttons.analyze}</button>
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
        this.stopRecording();
        this.router.navigate({ dyad: 'tantrum', screen: 'home' });
      });
    }

    // Capture button
    const captureBtn = this.container.querySelector('#capture-btn');
    if (captureBtn) {
      captureBtn.addEventListener('click', () => {
        if (this.isRecording) {
          this.stopRecording();
        } else {
          this.startRecording();
        }
      });
    }

    // Upload button
    const uploadBtn = this.container.querySelector('.upload-btn');
    if (uploadBtn) {
      uploadBtn.addEventListener('click', () => {
        this.handleUpload();
      });
    }

    // Cancel button
    const cancelBtn = this.container.querySelector('[data-action="cancel"]');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.stopRecording();
        this.router.navigate({ dyad: 'tantrum', screen: 'home' });
      });
    }

    // Analyze button
    const analyzeBtn = this.container.querySelector('[data-action="analyze"]');
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', () => {
        this.handleAnalyze();
      });
    }
  }

  private async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: { width: 640, height: 480 } 
      });

      this.isRecording = true;
      this.recordingStartTime = Date.now();
      this.captureType = stream.getVideoTracks().length > 0 ? 'video' : 'audio';
      
      // Update UI
      this.updateRecordingUI();
      
      // Start recording
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: this.captureType === 'video' ? 'video/webm' : 'audio/webm'
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (this.captureType === 'video') {
          this.videoChunks.push(event.data);
        } else {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.enableAnalyzeButton();
      };

      this.mediaRecorder.start();
      this.startTimer();

    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Could not access microphone/camera. Please check permissions.');
    }
  }

  private stopRecording(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.stopTimer();
      
      // Stop all tracks
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      
      // Update UI
      this.updateRecordingUI();
    }
  }

  private updateRecordingUI(): void {
    const placeholder = this.container.querySelector('#capture-placeholder') as HTMLElement;
    const recordingDisplay = this.container.querySelector('#recording-display') as HTMLElement;
    const captureBtn = this.container.querySelector('#capture-btn') as HTMLButtonElement;
    const captureType = this.container.querySelector('#capture-type');

    if (this.isRecording) {
      placeholder!.style.display = 'none';
      recordingDisplay!.style.display = 'block';
      captureBtn.textContent = 'Stop Recording';
      captureBtn.classList.add('recording');
    } else {
      placeholder!.style.display = 'block';
      recordingDisplay!.style.display = 'none';
      captureBtn.textContent = 'Start Recording';
      captureBtn.classList.remove('recording');
    }

    if (captureType) {
      captureType.textContent = this.captureType === 'video' ? 'Video' : 'Audio';
    }
  }

  private startTimer(): void {
    this.recordingTimer = window.setInterval(() => {
      const elapsed = Date.now() - this.recordingStartTime;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      const timeDisplay = this.container.querySelector('#recording-time');
      if (timeDisplay) {
        timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }
  }

  private handleUpload(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*,video/*';
    input.multiple = false;

    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        this.processUploadedFile(file);
      }
    };

    input.click();
  }

  private async processUploadedFile(file: File): Promise<void> {
    const isVideo = file.type.startsWith('video/');
    this.captureType = isVideo ? 'video' : 'audio';

    // Update UI
    const captureType = this.container.querySelector('#capture-type');
    if (captureType) {
      captureType.textContent = this.captureType === 'video' ? 'Video' : 'Audio';
    }

    // Store file for analysis
    if (isVideo) {
      this.videoChunks = [file];
    } else {
      this.audioChunks = [file];
    }

    this.enableAnalyzeButton();
  }

  private enableAnalyzeButton(): void {
    const analyzeBtn = this.container.querySelector('[data-action="analyze"]') as HTMLButtonElement;
    if (analyzeBtn) {
      analyzeBtn.disabled = false;
    }
  }

  private async handleAnalyze(): Promise<void> {
    // Navigate to analysis with media data
    this.router.navigate({
      dyad: 'tantrum',
      screen: 'thermo',
      params: { 
        intensity: this.intensity,
        hasAudio: this.audioChunks.length > 0 ? 'true' : 'false',
        hasVideo: this.videoChunks.length > 0 ? 'true' : 'false'
      }
    });
  }

  public destroy(): void {
    this.stopRecording();
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
    }
  }
} 