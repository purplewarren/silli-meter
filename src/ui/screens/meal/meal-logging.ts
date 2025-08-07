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
    // TODO: Implement photo capture logic
    console.log(`Capturing meal photo with rating ${this.rating}`);
    
    // For now, just enable the save button
    this.enableSaveButton();
  }

  private handleUpload(): void {
    // TODO: Implement photo upload logic
    console.log('Uploading meal photo');
    
    // For now, just enable the save button
    this.enableSaveButton();
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