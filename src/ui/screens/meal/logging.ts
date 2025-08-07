/**
 * Meal Mood Companion - Meal Logging Screen
 */

import { Router } from '../../router.js';

export class MealLoggingScreen {
  private container: HTMLElement;
  private router: Router;
  private rating: string;
  private capturedImage: File | null = null;
  private imageAnalysis: any = null;
  private formHandle: any = null;

  constructor(container: HTMLElement, router: Router, _action: string, rating: string) {
    this.container = container;
    this.router = router;
    this.rating = rating;
  }

  public render(): void {
    this.container.innerHTML = `
      <div class="screen meal-logging">
        <header class="screen-header">
          <button class="back-btn" data-action="back">← Back</button>
          <h1>📷 Meal Logging</h1>
        </header>

        <main class="screen-content">
          <section class="capture-section">
            <h3>Capture Your Meal</h3>
            <div class="capture-area">
              <div class="capture-placeholder" id="capture-placeholder">
                <span class="icon">📷</span>
                <p>Take a photo of your meal or upload an image</p>
              </div>
              
              <div class="captured-image" id="captured-image" style="display: none;">
                <img id="meal-image" src="" alt="Meal photo" />
                <div class="image-overlay">
                  <button class="btn secondary small" data-action="retake">Retake</button>
                </div>
              </div>
              
              <div class="capture-controls">
                <button class="btn primary capture-btn" id="capture-btn" data-action="capture">
                  📷 Take Photo
                </button>
                
                <button class="btn secondary upload-btn" data-action="upload">
                  📁 Upload Image
                </button>
              </div>
            </div>
          </section>

          <section class="quick-rating-section">
            <h3>Quick Rating</h3>
            <div class="star-rating">
              ${this.generateStarRating()}
            </div>
          </section>

          <section class="meal-details-section">
            <h3>Meal Details</h3>
            <div id="meal-form"></div>
          </section>

          <section class="privacy-notice">
            <p>🔒 Your photos are analyzed on your device and never uploaded.</p>
          </section>
        </main>

        <nav class="screen-nav">
          <button class="btn secondary" data-action="cancel">Cancel</button>
          <button class="btn primary" data-action="analyze" disabled>Analyze Meal</button>
        </nav>
      </div>
    `;

    this.bindEvents();
    this.setupMealForm();
  }

  private generateStarRating(): string {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isActive = i <= parseInt(this.rating);
      stars.push(`
        <button class="star-btn ${isActive ? 'active' : ''}" data-rating="${i}">
          ${isActive ? '⭐' : '☆'}
        </button>
      `);
    }
    return stars.join('');
  }

  private setupMealForm(): void {
    const mealForm = this.container.querySelector('#meal-form');
    if (mealForm) {
      // Form setup will be implemented when needed
      mealForm.innerHTML = '<p>Meal form will be available in future updates.</p>';
    }
  }

  private bindEvents(): void {
    // Back button
    const backBtn = this.container.querySelector('.back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.router.navigate({ dyad: 'meal', screen: 'home' });
      });
    }

    // Capture button
    const captureBtn = this.container.querySelector('#capture-btn');
    if (captureBtn) {
      captureBtn.addEventListener('click', () => {
        this.handleCapture();
      });
    }

    // Upload button
    const uploadBtn = this.container.querySelector('.upload-btn');
    if (uploadBtn) {
      uploadBtn.addEventListener('click', () => {
        this.handleUpload();
      });
    }

    // Retake button
    const retakeBtn = this.container.querySelector('[data-action="retake"]');
    if (retakeBtn) {
      retakeBtn.addEventListener('click', () => {
        this.handleRetake();
      });
    }

    // Star rating
    const starBtns = this.container.querySelectorAll('.star-btn');
    starBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const rating = (btn as HTMLElement).dataset.rating || '0';
        this.handleRatingChange(parseInt(rating));
      });
    });

    // Cancel button
    const cancelBtn = this.container.querySelector('[data-action="cancel"]');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.router.navigate({ dyad: 'meal', screen: 'home' });
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

  private async handleCapture(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });

      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      // Wait for video to be ready
      await new Promise(resolve => {
        video.onloadedmetadata = resolve;
      });

      // Create canvas to capture frame
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Capture frame
      ctx.drawImage(video, 0, 0);
      
      // Stop stream
      stream.getTracks().forEach(track => track.stop());

      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          this.capturedImage = new File([blob], 'meal-photo.jpg', { type: 'image/jpeg' });
          this.displayCapturedImage(URL.createObjectURL(blob));
          this.enableAnalyzeButton();
        }
      }, 'image/jpeg', 0.8);

    } catch (error) {
      console.error('Failed to capture photo:', error);
      alert('Could not access camera. Please check permissions.');
    }
  }

  private handleUpload(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = false;

    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        this.capturedImage = file;
        this.displayCapturedImage(URL.createObjectURL(file));
        this.enableAnalyzeButton();
      }
    };

    input.click();
  }

  private handleRetake(): void {
    this.capturedImage = null;
    this.imageAnalysis = null;
    this.updateCaptureUI();
  }

  private displayCapturedImage(src: string): void {
    const placeholder = this.container.querySelector('#capture-placeholder') as HTMLElement;
    const capturedImage = this.container.querySelector('#captured-image') as HTMLElement;
    const mealImage = this.container.querySelector('#meal-image') as HTMLImageElement;

    if (placeholder && capturedImage && mealImage) {
      placeholder.style.display = 'none';
      capturedImage.style.display = 'block';
      mealImage.src = src;
    }
  }

  private updateCaptureUI(): void {
    const placeholder = this.container.querySelector('#capture-placeholder') as HTMLElement;
    const capturedImage = this.container.querySelector('#captured-image') as HTMLElement;

    if (placeholder && capturedImage) {
      placeholder.style.display = 'block';
      capturedImage.style.display = 'none';
    }
  }

  private handleRatingChange(rating: number): void {
    this.rating = rating.toString();
    
    // Update star display
    const starBtns = this.container.querySelectorAll('.star-btn');
    starBtns.forEach((btn, index) => {
      const isActive = index < rating;
      btn.innerHTML = isActive ? '⭐' : '☆';
      btn.classList.toggle('active', isActive);
    });
  }

  private enableAnalyzeButton(): void {
    const analyzeBtn = this.container.querySelector('[data-action="analyze"]') as HTMLButtonElement;
    if (analyzeBtn) {
      analyzeBtn.disabled = false;
    }
  }

  private async handleAnalyze(): Promise<void> {
    if (!this.capturedImage) return;

    try {
      // Simulate image analysis (in real implementation, this would use ImageAnalyzer)
      this.imageAnalysis = {
        dietaryDiversity: Math.random() * 0.8 + 0.1,
        clutterScore: Math.random() * 0.6 + 0.2,
        plateCoverage: Math.random() * 0.7 + 0.2
      };
      
      // Navigate to insights with data
      this.router.navigate({
        dyad: 'meal',
        screen: 'insights',
        params: {
          rating: this.rating,
          hasImage: 'true',
          dietaryDiversity: this.imageAnalysis.dietaryDiversity.toFixed(2),
          clutterScore: this.imageAnalysis.clutterScore.toFixed(2),
          plateCoverage: this.imageAnalysis.plateCoverage.toFixed(2)
        }
      });
    } catch (error) {
      console.error('Failed to analyze image:', error);
      alert('Failed to analyze image. Please try again.');
    }
  }

  public destroy(): void {
    if (this.formHandle) {
      // Clean up form if needed
    }
  }
} 