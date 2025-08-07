/**
 * Meal Mood Companion - History & Gallery Screen
 */

import { Router } from '../../router.js';

interface MealSession {
  timestamp: string;
  rating: number;
  mealMood: number;
  hasImage: boolean;
  dietaryDiversity: number;
  clutterScore: number;
  plateCoverage: number;
  tip: string;
  badge: string;
  thumbnail?: string;
  context?: any;
}

export class MealGalleryScreen {
  private container: HTMLElement;
  private router: Router;
  private sessions: MealSession[] = [];

  constructor(container: HTMLElement, router: Router) {
    this.container = container;
    this.router = router;
  }

  public render(): void {
    this.loadSessions();
    
    this.container.innerHTML = `
      <div class="screen meal-gallery">
        <header class="screen-header">
          <button class="back-btn" data-action="back">← Back</button>
          <h1>📸 Meal Gallery</h1>
        </header>

        <main class="screen-content">
          <section class="overview-section">
            <h3>Your Meal Journey</h3>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-number">${this.sessions.length}</div>
                <div class="stat-label">Meals</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${this.getAverageMood()}</div>
                <div class="stat-label">Avg Mood</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${this.getAverageRating()}</div>
                <div class="stat-label">Avg Rating</div>
              </div>
            </div>
          </section>

          <section class="trends-section">
            <h3>Trends & Patterns</h3>
            <div class="trends-grid">
              ${this.generateTrends()}
            </div>
          </section>

          <section class="insights-section">
            <h3>Key Insights</h3>
            <div class="insights-list">
              ${this.generateInsights()}
            </div>
          </section>

          <section class="gallery-section">
            <div class="section-header">
              <h3>Recent Meals (Last 30)</h3>
              <button class="btn secondary small" data-action="clear-all">Clear All</button>
            </div>
            <div class="gallery-grid" id="gallery-grid">
              ${this.renderGallery()}
            </div>
          </section>

          <section class="privacy-notice">
            <p>🔒 All data stays on your device. No cloud storage.</p>
          </section>
        </main>

        <nav class="screen-nav">
          <button class="btn secondary" data-action="export">📤 Export</button>
          <button class="btn primary" data-action="new-meal">➕ New Meal</button>
        </nav>
      </div>
    `;

    this.bindEvents();
  }

  private loadSessions(): void {
    const historyKey = 'meal_history';
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    this.sessions = history.slice(0, 30); // Keep only last 30
  }

  private getAverageMood(): string {
    if (this.sessions.length === 0) return '0';
    const total = this.sessions.reduce((sum, session) => sum + session.mealMood, 0);
    return (total / this.sessions.length).toFixed(0);
  }

  private getAverageRating(): string {
    if (this.sessions.length === 0) return '0.0';
    const total = this.sessions.reduce((sum, session) => sum + session.rating, 0);
    return (total / this.sessions.length).toFixed(1);
  }

  private generateTrends(): string {
    const trends = [];
    
    // Mood trend
    const avgMood = parseFloat(this.getAverageMood());
    if (avgMood > 70) {
      trends.push(`
        <div class="trend-card positive">
          <div class="trend-icon">😊</div>
          <div class="trend-content">
            <h4>High Meal Mood</h4>
            <p>Your child consistently enjoys meals (${avgMood}/100)</p>
          </div>
        </div>
      `);
    } else if (avgMood < 40) {
      trends.push(`
        <div class="trend-card negative">
          <div class="trend-icon">😐</div>
          <div class="trend-content">
            <h4>Low Meal Mood</h4>
            <p>Consider favorite foods and smaller portions</p>
          </div>
        </div>
      `);
    }
    
    // Diversity trend
    const avgDiversity = this.sessions.reduce((sum, s) => sum + s.dietaryDiversity, 0) / this.sessions.length;
    if (avgDiversity > 0.6) {
      trends.push(`
        <div class="trend-card positive">
          <div class="trend-icon">🌈</div>
          <div class="trend-content">
            <h4>Good Variety</h4>
            <p>Excellent dietary diversity in meals</p>
          </div>
        </div>
      `);
    }
    
    // Time pattern
    const timePatterns = this.analyzeTimePatterns();
    if (timePatterns.length > 0) {
      trends.push(`
        <div class="trend-card neutral">
          <div class="trend-icon">⏰</div>
          <div class="trend-content">
            <h4>Meal Timing</h4>
            <p>${timePatterns[0]}</p>
          </div>
        </div>
      `);
    }
    
    if (trends.length === 0) {
      return `
        <div class="trend-card neutral">
          <div class="trend-icon">📊</div>
          <div class="trend-content">
            <h4>Building Patterns</h4>
            <p>Continue logging meals to discover trends</p>
          </div>
        </div>
      `;
    }
    
    return trends.join('');
  }

  private generateInsights(): string {
    const insights = [];

    // Average Mood
    const avgMood = this.sessions.length > 0 ? this.sessions.reduce((sum, session) => sum + session.mealMood, 0) / this.sessions.length : 0;
    insights.push(`
      <div class="insight-item">
        <div class="insight-icon">😊</div>
        <div class="insight-content">
          <h4>Average Meal Mood</h4>
          <p>Your average meal mood is ${Math.round(avgMood)}/100</p>
        </div>
      </div>
    `);

    // Average Eaten Percentage (if available in context)
    const sessionsWithEatenPct = this.sessions.filter(s => s.context?.eaten_pct !== undefined);
    if (sessionsWithEatenPct.length > 0) {
      const avgEatenPct = sessionsWithEatenPct.reduce((sum, session) => sum + (session.context.eaten_pct || 0), 0) / sessionsWithEatenPct.length;
      insights.push(`
        <div class="insight-item">
          <div class="insight-icon">🍽️</div>
          <div class="insight-content">
            <h4>Average Eaten Percentage</h4>
            <p>Your child eats ${Math.round(avgEatenPct)}% of meals on average</p>
          </div>
        </div>
      `);
    }

    // Average Dietary Diversity
    const avgDiversity = this.sessions.length > 0 ? this.sessions.reduce((sum, session) => sum + session.dietaryDiversity, 0) / this.sessions.length : 0;
    insights.push(`
      <div class="insight-item">
        <div class="insight-icon">🌈</div>
        <div class="insight-content">
          <h4>Average Dietary Diversity</h4>
          <p>Your average dietary diversity is ${(avgDiversity * 100).toFixed(0)}%</p>
        </div>
      </div>
    `);

    return insights.join('');
  }

  private analyzeTimePatterns(): string[] {
    const patterns: string[] = [];
    
    // Analyze time of day patterns
    const hourCounts: { [hour: number]: number } = {};
    this.sessions.forEach(session => {
      const hour = new Date(session.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    const peakHour = Object.entries(hourCounts).reduce((a, b) => 
      hourCounts[parseInt(a[0])] > hourCounts[parseInt(b[0])] ? a : b
    );
    
    if (peakHour && hourCounts[parseInt(peakHour[0])] > 3) {
      const timeName = this.getTimeName(parseInt(peakHour[0]));
      patterns.push(`Most meals logged at ${timeName}`);
    }
    
    return patterns;
  }

  private getTimeName(hour: number): string {
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return '12:00 PM';
    return `${hour - 12}:00 PM`;
  }

  private renderGallery(): string {
    if (this.sessions.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-icon">📸</div>
          <h4>No Meals Yet</h4>
          <p>Start logging meals to see your gallery here.</p>
        </div>
      `;
    }
    
    return this.sessions.map((session, index) => {
      const date = new Date(session.timestamp);
      const timeString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      const stars = '⭐'.repeat(session.rating);
      
      return `
        <div class="meal-card" data-index="${index}">
          <div class="meal-image">
            ${session.hasImage ? 
              `<img src="${session.thumbnail || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTUwIDE1MCI+PHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI3NSIgeT0iNzUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij7wn5KHPzwvdGV4dD48L3N2Zz4='}" alt="Meal photo" />` :
              `<div class="no-image">📷</div>`
            }
          </div>
          <div class="meal-info">
            <div class="meal-date">${timeString} · mood=${Math.round(session.mealMood)}</div>
            <div class="meal-rating">${stars}</div>
            <div class="meal-metrics">
              <span class="metric">D: ${(session.dietaryDiversity * 100).toFixed(0)}%</span>
              <span class="metric">C: ${(session.clutterScore * 100).toFixed(0)}%</span>
              <span class="metric">P: ${(session.plateCoverage * 100).toFixed(0)}%</span>
            </div>
          </div>
          <button class="delete-btn" data-index="${index}">🗑️</button>
        </div>
      `;
    }).join('');
  }

  private bindEvents(): void {
    // Back button
    const backBtn = this.container.querySelector('.back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.router.navigate({ dyad: 'meal', screen: 'home' });
      });
    }

    // Export button
    const exportBtn = this.container.querySelector('[data-action="export"]');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.handleExport();
      });
    }

    // New meal button
    const newMealBtn = this.container.querySelector('[data-action="new-meal"]');
    if (newMealBtn) {
      newMealBtn.addEventListener('click', () => {
        this.router.navigate({ dyad: 'meal', screen: 'home' });
      });
    }

    // Clear all button
    const clearAllBtn = this.container.querySelector('[data-action="clear-all"]');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', () => {
        this.handleClearAll();
      });
    }

    // Delete individual meals
    const deleteBtns = this.container.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt((e.currentTarget as HTMLElement).dataset.index || '0');
        this.handleDeleteMeal(index);
      });
    });
  }

  private handleExport(): void {
    const exportData = {
      sessions: this.sessions,
      summary: {
        totalMeals: this.sessions.length,
        averageMood: this.getAverageMood(),
        averageRating: this.getAverageRating(),
        exportDate: new Date().toISOString()
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meal-gallery-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private handleClearAll(): void {
    if (confirm('Are you sure you want to delete all meal data? This cannot be undone.')) {
      localStorage.removeItem('meal_history');
      this.sessions = [];
      this.render(); // Re-render to show empty state
    }
  }

  private handleDeleteMeal(index: number): void {
    if (confirm('Delete this meal?')) {
      this.sessions.splice(index, 1);
      localStorage.setItem('meal_history', JSON.stringify(this.sessions));
      this.render(); // Re-render to update the gallery
    }
  }

  public destroy(): void {
    // Clean up if needed
  }
} 