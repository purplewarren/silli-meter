/**
 * Meal Mood Companion - Instant Insights Screen
 */

import { Router } from '../../router.js';

export class MealInsightsScreen {
  private container: HTMLElement;
  private router: Router;
  private rating: string;
  private hasImage: boolean;
  private dietaryDiversity: number;
  private clutterScore: number;
  private plateCoverage: number;
  private mealMood: number = 0;
  private adjustedMood: number = 0;
  private currentTip: string = '';
  private currentBadge: string = '';
  private tipsData: any = null;

  constructor(container: HTMLElement, router: Router, rating: string, hasImage: string, dietaryDiversity: string, clutterScore: string, plateCoverage: string) {
    this.container = container;
    this.router = router;
    this.rating = rating;
    this.hasImage = hasImage === 'true';
    this.dietaryDiversity = parseFloat(dietaryDiversity);
    this.clutterScore = parseFloat(clutterScore);
    this.plateCoverage = parseFloat(plateCoverage);
  }

  public async render(): Promise<void> {
    await this.loadTipsData();
    this.calculateMealMood();
    
    this.container.innerHTML = `
      <div class="screen meal-insights">
        <header class="screen-header">
          <button class="back-btn" data-action="back">← Back</button>
          <h1>📊 Meal Insights</h1>
        </header>

        <main class="screen-content">
          <section class="mood-section">
            <h3>Meal Mood Score</h3>
            <div class="mood-display">
              <div class="mood-score">
                <div class="score-circle">
                  <span class="score-value" id="mood-score">${this.adjustedMood}</span>
                  <span class="score-label">/ 100</span>
                </div>
              </div>
              <div class="mood-description" id="mood-description">
                ${this.getMoodDescription()}
              </div>
            </div>
          </section>

          <section class="analysis-section">
            <h3>Image Analysis</h3>
            <div class="analysis-grid">
              <div class="analysis-card">
                <div class="analysis-icon">🌈</div>
                <h4>Dietary Diversity</h4>
                <div class="analysis-value">${(this.dietaryDiversity * 100).toFixed(0)}%</div>
                <div class="analysis-bar">
                  <div class="bar-fill" style="width: ${this.dietaryDiversity * 100}%"></div>
                </div>
              </div>
              
              <div class="analysis-card">
                <div class="analysis-icon">🎯</div>
                <h4>Clutter Score</h4>
                <div class="analysis-value">${(this.clutterScore * 100).toFixed(0)}%</div>
                <div class="analysis-bar">
                  <div class="bar-fill" style="width: ${this.clutterScore * 100}%"></div>
                </div>
              </div>
              
              <div class="analysis-card">
                <div class="analysis-icon">🍽️</div>
                <h4>Plate Coverage</h4>
                <div class="analysis-value">${(this.plateCoverage * 100).toFixed(0)}%</div>
                <div class="analysis-bar">
                  <div class="bar-fill" style="width: ${this.plateCoverage * 100}%"></div>
                </div>
              </div>
            </div>
          </section>

          <section class="tip-section">
            <h3>Personalized Tip</h3>
            <div class="tip-card">
              <div class="tip-content" id="tip-content">
                ${this.currentTip}
              </div>
            </div>
          </section>

          <section class="badge-section" id="badge-section" style="display: none;">
            <h3>Meal Achievement</h3>
            <div class="badge-card">
              <div class="badge-content" id="badge-content">
                <!-- Badge will be inserted here -->
              </div>
            </div>
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
    this.selectTip();
    this.checkForBadge();
  }

  private async loadTipsData(): Promise<void> {
    try {
      const response = await fetch('/scoring/meal/tips.json');
      this.tipsData = await response.json();
    } catch (error) {
      console.error('Failed to load tips data:', error);
      this.tipsData = { tips: {}, badges: {}, mood_adjustments: {} };
    }
  }

  private calculateMealMood(): void {
    // Base meal mood from rating (1-5 stars = 20-100)
    this.mealMood = parseInt(this.rating) * 20;
    
    // Apply image heuristics adjustments
    const diversityBonus = (this.dietaryDiversity - 0.5) * 10;
    const clutterPenalty = (this.clutterScore - 0.5) * 10;
    
    this.adjustedMood = Math.max(0, Math.min(100, 
      this.mealMood + diversityBonus - clutterPenalty
    ));
  }

  private getMoodDescription(): string {
    if (this.adjustedMood >= 80) return "Excellent! The child is very excited about this meal.";
    if (this.adjustedMood >= 60) return "Good! The child shows positive interest in the meal.";
    if (this.adjustedMood >= 40) return "Moderate. The child is somewhat interested in the meal.";
    if (this.adjustedMood >= 20) return "Low. The child shows minimal interest in the meal.";
    return "Very low. The child may not be interested in this meal.";
  }

  private selectTip(): void {
    if (!this.tipsData) return;
    
    // Select tip based on highest priority factor
    let tipCategory = 'mood';
    let tipLevel = this.getLevel(this.adjustedMood / 100);
    
    // Check if diversity is very low
    if (this.dietaryDiversity < 0.3) {
      tipCategory = 'diversity';
      tipLevel = 'low';
    }
    // Check if clutter is very high
    else if (this.clutterScore > 0.7) {
      tipCategory = 'clutter';
      tipLevel = 'high';
    }
    // Check if coverage is very low or high
    else if (this.plateCoverage < 0.3) {
      tipCategory = 'coverage';
      tipLevel = 'low';
    } else if (this.plateCoverage > 0.8) {
      tipCategory = 'coverage';
      tipLevel = 'high';
    }
    
    const tips = this.tipsData.tips[tipCategory]?.[tipLevel] || 
                 this.tipsData.tips.mood?.[tipLevel] || 
                 ['Great meal! Keep up the good work.'];
    
    this.currentTip = tips[Math.floor(Math.random() * tips.length)];
  }

  private getLevel(value: number): 'low' | 'medium' | 'high' {
    if (value < 0.33) return 'low';
    if (value < 0.66) return 'medium';
    return 'high';
  }

  private checkForBadge(): void {
    if (!this.tipsData) return;
    
    // Check for diversity champion
    if (this.dietaryDiversity > 0.7) {
      this.showBadge(this.tipsData.badges.diversity_champion);
    }
    // Check for portion perfect
    else if (this.plateCoverage >= 0.4 && this.plateCoverage <= 0.7) {
      this.showBadge(this.tipsData.badges.portion_perfect);
    }
    // Check for mood booster
    else if (this.adjustedMood > 80) {
      this.showBadge(this.tipsData.badges.mood_booster);
    }
  }

  private showBadge(badge: any): void {
    this.currentBadge = badge.name;
    
    const badgeSection = this.container.querySelector('#badge-section') as HTMLElement;
    const badgeContent = this.container.querySelector('#badge-content') as HTMLElement;
    
    if (badgeSection && badgeContent) {
      badgeSection.style.display = 'block';
      badgeContent.innerHTML = `
        <div class="badge-display">
          <div class="badge-icon">${badge.name}</div>
          <div class="badge-description">${badge.description}</div>
        </div>
      `;
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
    const sessionData = this.prepareSessionData();
    this.saveToHistory(sessionData);
    
    // Navigate to gallery
    this.router.navigate({ dyad: 'meal', screen: 'gallery' });
  }

  private async handleExport(): Promise<void> {
    // Create export JSON
    const exportData = {
      dyad: 'meal',
      timestamp: new Date().toISOString(),
      rating: parseInt(this.rating),
      metrics: {
        meal_mood: this.adjustedMood
      },
      media_summaries: {
        image: {
          dietary_diversity: this.dietaryDiversity,
          clutter_score: this.clutterScore,
          plate_coverage: this.plateCoverage
        }
      },
      tip: this.currentTip,
      badge: this.currentBadge
    };
    
    // Download JSON file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meal-session-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private prepareSessionData(): any {
    return {
      timestamp: new Date().toISOString(),
      rating: parseInt(this.rating),
      mealMood: this.adjustedMood,
      hasImage: this.hasImage,
      dietaryDiversity: this.dietaryDiversity,
      clutterScore: this.clutterScore,
      plateCoverage: this.plateCoverage,
      tip: this.currentTip,
      badge: this.currentBadge
    };
  }

  private saveToHistory(sessionData: any): void {
    const historyKey = 'meal_history';
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    
    // Add new session
    history.unshift(sessionData);
    
    // Keep only last 30 sessions
    if (history.length > 30) {
      history.splice(30);
    }
    
    localStorage.setItem(historyKey, JSON.stringify(history));
  }

  public destroy(): void {
    // Clean up if needed
  }
} 