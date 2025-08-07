/**
 * Meal Mood Companion - Home Screen
 */

import { Router } from '../../router.js';
import { copy } from '../../copy.js';

export class MealHomeScreen {
  private container: HTMLElement;
  private router: Router;
  private currentRating: number = 0;

  constructor(container: HTMLElement, router: Router) {
    this.container = container;
    this.router = router;
  }

  public render(): void {
    this.container.innerHTML = `
      <div class="screen meal-home">
        <header class="screen-header">
          <h1>🍽️ ${copy.app.mealMoodCompanion}</h1>
          <p class="subtitle">${copy.app.trackEatingPatterns}</p>
        </header>

        <main class="screen-content">
          <section class="rating-section">
            <h3>${copy.sections.howWasMeal}</h3>
            <div class="star-rating">
              <div class="stars">
                <button class="star-btn" data-rating="1">⭐</button>
                <button class="star-btn" data-rating="2">⭐</button>
                <button class="star-btn" data-rating="3">⭐</button>
                <button class="star-btn" data-rating="4">⭐</button>
                <button class="star-btn" data-rating="5">⭐</button>
              </div>
              <div class="rating-label">
                <span id="rating-text">${copy.descriptions.selectRating}</span>
              </div>
            </div>
          </section>

          <section class="actions-section">
            <h3>${copy.sections.whatWouldYouLike}</h3>
            <div class="action-buttons">
              <button class="btn primary action-btn" data-action="snap">
                <span class="icon">📷</span>
                <span class="label">${copy.buttons.snapMeal}</span>
                <span class="description">${copy.descriptions.takePhotoOfMeal}</span>
              </button>
              
              <button class="btn primary action-btn" data-action="question">
                <span class="icon">🎤</span>
                <span class="label">${copy.buttons.askQuestion}</span>
                <span class="description">${copy.descriptions.getInsightsAboutFeeding}</span>
              </button>
            </div>
          </section>

          <section class="quick-actions">
            <h3>${copy.sections.quickActions}</h3>
            <div class="quick-buttons">
              <button class="btn secondary quick-btn" data-action="log-meal">
                📝 ${copy.buttons.logMeal}
              </button>
              <button class="btn secondary quick-btn" data-action="view-patterns">
                📊 ${copy.buttons.viewPatterns}
              </button>
            </div>
          </section>

          <section class="privacy-notice">
            <p>🔒 ${copy.privacy.photosStayPrivate}</p>
          </section>
        </main>

        <nav class="screen-nav">
          <button class="nav-btn" data-screen="gallery">🖼️ ${copy.buttons.gallery}</button>
          <button class="nav-btn" data-screen="settings">⚙️ ${copy.buttons.settings}</button>
        </nav>
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    // Star rating
    const starButtons = this.container.querySelectorAll('.star-btn');
    starButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const rating = parseInt((e.currentTarget as HTMLElement).dataset.rating || '0');
        this.handleRatingChange(rating);
      });
    });

    // Action buttons
    const actionButtons = this.container.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = (e.currentTarget as HTMLElement).dataset.action || '';
        this.handleAction(action);
      });
    });

    // Quick action buttons
    const quickButtons = this.container.querySelectorAll('.quick-btn');
    quickButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = (e.currentTarget as HTMLElement).dataset.action || '';
        this.handleQuickAction(action);
      });
    });

    // Navigation buttons
    const navButtons = this.container.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const screen = (e.currentTarget as HTMLElement).dataset.screen as string;
        this.router.navigate({
          dyad: 'meal',
          screen: screen as any
        });
      });
    });
  }

  private handleRatingChange(rating: number): void {
    this.currentRating = rating;
    
    // Update star display
    const starButtons = this.container.querySelectorAll('.star-btn');
    starButtons.forEach((btn, index) => {
      const starBtn = btn as HTMLElement;
      if (index < rating) {
        starBtn.textContent = '⭐';
        starBtn.classList.add('active');
      } else {
        starBtn.textContent = '☆';
        starBtn.classList.remove('active');
      }
    });

    // Update rating text
    const ratingText = this.container.querySelector('#rating-text') as HTMLElement;
    if (ratingText) {
      const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
      ratingText.textContent = labels[rating] || 'Select a rating';
    }
  }

  private handleAction(action: string): void {
    switch (action) {
      case 'snap':
        this.router.navigate({
          dyad: 'meal',
          screen: 'meal-logging',
          params: { action, rating: this.currentRating.toString() }
        });
        break;
      case 'question':
        this.router.navigate({
          dyad: 'meal',
          screen: 'insights',
          params: { action, rating: this.currentRating.toString(), mode: 'question' }
        });
        break;
    }
  }

  private handleQuickAction(action: string): void {
    switch (action) {
      case 'log-meal':
        this.router.navigate({
          dyad: 'meal',
          screen: 'meal-logging',
          params: { action: 'log', rating: this.currentRating.toString() }
        });
        break;
      case 'view-patterns':
        this.router.navigate({
          dyad: 'meal',
          screen: 'insights'
        });
        break;
    }
  }

  public destroy(): void {
    // Clean up event listeners if needed
  }
} 