/**
 * Meal Mood Companion - Meal Logging Screen
 */

import { Router } from '../../router.js';
import { copy } from '../../copy.js';

export class MealLoggingScreen {
  private container: HTMLElement;
  private router: Router;
  private action: string;
  private rating: string;
  private textDescription: string | null = null;

  constructor(container: HTMLElement, router: Router, action: string, rating: string) {
    this.container = container;
    this.router = router;
    this.action = action;
    this.rating = rating;
  }

  public render(): void {
    const actionConfig = this.getActionConfig();
    
    this.container.innerHTML = `
      <div class="screen meal-logging">
        <header class="screen-header">
          <button class="back-btn" data-action="back">← Back</button>
          <h1>${actionConfig.title}</h1>
        </header>

        <main class="screen-content">
          <section class="capture-section">
            <div class="capture-area">
              <div class="capture-placeholder">
                <span class="icon">${actionConfig.icon}</span>
                <p>${actionConfig.description}</p>
              </div>
              
              <div class="capture-controls">
                <button class="btn primary capture-btn" data-action="capture">
                  ${actionConfig.buttonText}
                </button>
                
                <button class="btn secondary upload-btn" data-action="upload">
                  📁 Upload Photo
                </button>
              </div>
            </div>
          </section>

          <section class="meal-details">
            <h3>Meal Details</h3>
            <div class="details-form">
              <div class="form-group">
                <label>Meal Type</label>
                <select class="form-select" id="meal-type">
                  <option value="">Select meal type</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Food Items</label>
                <input type="text" class="form-input" id="food-items" placeholder="e.g., pasta, chicken, broccoli">
              </div>
              
              <div class="form-group">
                <label>Rating</label>
                <div class="rating-display">
                  <span class="stars">
                    ${'⭐'.repeat(parseInt(this.rating) || 0)}${'☆'.repeat(5 - (parseInt(this.rating) || 0))}
                  </span>
                  <span class="rating-text">${this.getRatingText()}</span>
                </div>
              </div>
              
              <div class="form-group">
                <label>Notes (optional)</label>
                <textarea class="form-textarea" id="meal-notes" placeholder="Any observations about the meal..."></textarea>
              </div>
            </div>
          </section>

          <section class="privacy-notice">
            <p>🔒 ${copy.privacy.dataStaysLocal}</p>
          </section>
        </main>

        <nav class="screen-nav">
          <button class="btn secondary" data-action="cancel">${copy.buttons.cancel}</button>
          <button class="btn primary" data-action="save" disabled>${copy.buttons.saveMeal}</button>
        </nav>
      </div>
    `;

    this.bindEvents();
  }

  private getActionConfig() {
    switch (this.action) {
      case 'snap':
        return {
          title: '📷 Snap Meal',
          icon: '📷',
          description: 'Take a photo of the meal',
          buttonText: 'Take Photo'
        };
      case 'log':
        return {
          title: '📝 Log Meal',
          icon: '📝',
          description: 'Log meal details manually',
          buttonText: 'Start Logging'
        };
      default:
        return {
          title: 'Meal Logging',
          icon: '🍽️',
          description: 'Log your meal details',
          buttonText: 'Start'
        };
    }
  }

  private getRatingText(): string {
    const rating = parseInt(this.rating) || 0;
    const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    return labels[rating] || 'No rating';
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
    const captureBtn = this.container.querySelector('.capture-btn');
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

    // Cancel button
    const cancelBtn = this.container.querySelector('[data-action="cancel"]');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.router.navigate({ dyad: 'meal', screen: 'home' });
      });
    }

    // Save button
    const saveBtn = this.container.querySelector('[data-action="save"]');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.handleSave();
      });
    }

    // Form validation
    const formInputs = this.container.querySelectorAll('.form-input, .form-select, .form-textarea');
    formInputs.forEach(input => {
      input.addEventListener('input', () => {
        this.validateForm();
      });
    });
  }

  private handleCapture(): void {
    // Check if we're in "log" mode (manual text entry)
    if (this.action === 'log') {
      this.showTextInputMode();
      return;
    }

    // For "snap" mode, try to use camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Try to access camera directly
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          this.showCameraCapture(stream);
        })
        .catch(error => {
          console.log('Camera access failed, falling back to file input:', error);
          this.openFileInput(true); // true = prefer camera
        });
    } else {
      // Fallback to file input with camera preference
      this.openFileInput(true);
    }
  }

  private handleUpload(): void {
    // Always use file picker for upload
    this.openFileInput(false); // false = file picker only
  }

  private openFileInput(preferCamera: boolean): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    if (preferCamera) {
      input.capture = 'environment'; // Use back camera
    }
    
    input.addEventListener('change', (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        this.handleImageSelected(file);
      }
    });
    
    input.click();
  }

  private showCameraCapture(stream: MediaStream): void {
    const captureArea = this.container.querySelector('.capture-area');
    if (captureArea) {
      captureArea.innerHTML = `
        <div class="camera-capture">
          <video id="camera-video" autoplay playsinline style="width: 100%; max-height: 300px; border-radius: 8px;"></video>
          <div class="camera-controls">
            <button class="btn primary capture-photo-btn" data-action="capture-photo">📸 Take Photo</button>
            <button class="btn secondary cancel-camera-btn" data-action="cancel-camera">❌ Cancel</button>
          </div>
        </div>
      `;
      
      const video = captureArea.querySelector('#camera-video') as HTMLVideoElement;
      video.srcObject = stream;
      
      // Bind camera controls
      const capturePhotoBtn = captureArea.querySelector('.capture-photo-btn');
      const cancelCameraBtn = captureArea.querySelector('.cancel-camera-btn');
      
      if (capturePhotoBtn) {
        capturePhotoBtn.addEventListener('click', () => {
          this.capturePhotoFromCamera(video, stream);
        });
      }
      
      if (cancelCameraBtn) {
        cancelCameraBtn.addEventListener('click', () => {
          stream.getTracks().forEach(track => track.stop());
          this.render(); // Re-render to show original controls
        });
      }
    }
  }

  private capturePhotoFromCamera(video: HTMLVideoElement, stream: MediaStream): void {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
          this.handleImageSelected(file);
        }
        stream.getTracks().forEach(track => track.stop());
      }, 'image/jpeg', 0.8);
    }
  }

  private showTextInputMode(): void {
    const captureArea = this.container.querySelector('.capture-area');
    if (captureArea) {
      captureArea.innerHTML = `
        <div class="text-input-mode">
          <div class="text-input-placeholder">
            <span class="icon">📝</span>
            <p>Describe the meal manually</p>
          </div>
          
          <div class="text-input-controls">
            <textarea class="form-textarea" id="meal-description" placeholder="Describe what was served, how much was eaten, any observations..."></textarea>
            <button class="btn primary text-save-btn" data-action="save-text">💾 Save Description</button>
          </div>
        </div>
      `;
      
      // Bind text save button
      const textSaveBtn = captureArea.querySelector('.text-save-btn');
      if (textSaveBtn) {
        textSaveBtn.addEventListener('click', () => {
          this.handleTextDescription();
        });
      }
    }
  }

  private handleTextDescription(): void {
    const textArea = this.container.querySelector('#meal-description') as HTMLTextAreaElement;
    const description = textArea?.value.trim();
    
    if (description) {
      // Store the text description
      this.textDescription = description;
      this.enableSaveButton();
      
      // Show confirmation
      const captureArea = this.container.querySelector('.capture-area');
      if (captureArea) {
        captureArea.innerHTML = `
          <div class="text-description-saved">
            <div class="saved-icon">✅</div>
            <p>Description saved!</p>
            <div class="saved-text">${description.substring(0, 100)}${description.length > 100 ? '...' : ''}</div>
            <button class="btn secondary edit-text-btn" data-action="edit-text">✏️ Edit</button>
          </div>
        `;
        
        // Bind edit button
        const editBtn = captureArea.querySelector('.edit-text-btn');
        if (editBtn) {
          editBtn.addEventListener('click', () => {
            this.showTextInputMode();
            const textArea = this.container.querySelector('#meal-description') as HTMLTextAreaElement;
            if (textArea) {
              textArea.value = description;
            }
          });
        }
      }
    } else {
      alert('Please enter a meal description.');
    }
  }

  private handleImageSelected(file: File): void {
    // Display the selected image
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      this.displayImage(imageData);
      this.enableSaveButton();
    };
    reader.readAsDataURL(file);
  }

  private displayImage(imageData: string): void {
    const captureArea = this.container.querySelector('.capture-area');
    if (captureArea) {
      captureArea.innerHTML = `
        <div class="captured-image">
          <img src="${imageData}" alt="Captured meal" style="max-width: 100%; max-height: 300px; border-radius: 8px;">
          <button class="btn secondary retake-btn" data-action="retake">🔄 Retake Photo</button>
        </div>
      `;
      
      // Bind retake button
      const retakeBtn = captureArea.querySelector('.retake-btn');
      if (retakeBtn) {
        retakeBtn.addEventListener('click', () => {
          this.render(); // Re-render to show capture controls again
        });
      }
    }
  }

  private validateForm(): void {
    const mealType = (this.container.querySelector('#meal-type') as HTMLSelectElement)?.value;
    const foodItems = (this.container.querySelector('#food-items') as HTMLInputElement)?.value;
    
    const isValid = mealType && foodItems.trim();
    const saveBtn = this.container.querySelector('[data-action="save"]') as HTMLButtonElement;
    
    if (saveBtn) {
      saveBtn.disabled = !isValid;
    }
  }

  private enableSaveButton(): void {
    const saveBtn = this.container.querySelector('[data-action="save"]') as HTMLButtonElement;
    if (saveBtn) {
      saveBtn.disabled = false;
    }
  }

  private handleSave(): void {
    // TODO: Implement save functionality
    console.log('Saving meal log');
    
    // Log the text description if available
    if (this.textDescription) {
      console.log('Text description:', this.textDescription);
    }
    
    // Navigate to insights
    this.router.navigate({
      dyad: 'meal',
      screen: 'insights',
      params: { action: 'saved', rating: this.rating }
    });
  }

  public destroy(): void {
    // Clean up event listeners if needed
  }
} 