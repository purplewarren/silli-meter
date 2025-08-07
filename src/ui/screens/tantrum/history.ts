/**
 * Tantrum Translator - History & Insights Screen
 */

import { Router } from '../../router.js';

interface TantrumSession {
  timestamp: string;
  intensity: number;
  escalationIndex: number;
  hasAudio: boolean;
  hasVideo: boolean;
  tip: string;
  badge: string;
  context: any;
}

export class TantrumHistoryScreen {
  private container: HTMLElement;
  private router: Router;
  private sessions: TantrumSession[] = [];

  constructor(container: HTMLElement, router: Router) {
    this.container = container;
    this.router = router;
  }

  public render(): void {
    this.loadSessions();
    
    this.container.innerHTML = `
      <div class="screen tantrum-history">
        <header class="screen-header">
          <button class="back-btn" data-action="back">← Back</button>
          <h1>📊 History & Insights</h1>
        </header>

        <main class="screen-content">
          <section class="overview-section">
            <h3>Your Journey</h3>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-number">${this.sessions.length}</div>
                <div class="stat-label">Sessions</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${this.getAverageIntensity()}</div>
                <div class="stat-label">Avg Intensity</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${this.getPatternsCount()}</div>
                <div class="stat-label">Patterns Found</div>
              </div>
            </div>
          </section>

          <section class="patterns-section">
            <h3>Patterns We've Noticed</h3>
            <div class="patterns-list">
              ${this.generatePatterns()}
            </div>
          </section>

          <section class="insights-section">
            <h3>Key Insights</h3>
            <div class="insights-list">
              ${this.generateInsights()}
            </div>
          </section>

          <section class="sessions-section">
            <div class="section-header">
              <h3>Recent Sessions (Last 14 Days)</h3>
              <button class="btn secondary small" data-action="clear-all">Clear All</button>
            </div>
            <div class="sessions-list" id="sessions-list">
              ${this.renderSessions()}
            </div>
          </section>

          <section class="privacy-notice">
            <p>🔒 All data stays on your device. No cloud storage.</p>
          </section>
        </main>

        <nav class="screen-nav">
          <button class="btn secondary" data-action="export">📤 Export</button>
          <button class="btn primary" data-action="new-session">➕ New Session</button>
        </nav>
      </div>
    `;

    this.bindEvents();
  }

  private loadSessions(): void {
    const historyKey = 'tantrum_history';
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    this.sessions = history.slice(0, 14); // Keep only last 14
  }

  private getAverageIntensity(): string {
    if (this.sessions.length === 0) return '0.0';
    const total = this.sessions.reduce((sum, session) => sum + session.intensity, 0);
    return (total / this.sessions.length).toFixed(1);
  }

  private getPatternsCount(): number {
    // Count unique patterns (triggers, time patterns, etc.)
    const triggers = new Set(this.sessions.map(s => s.context?.trigger).filter(Boolean));
    const timePatterns = this.analyzeTimePatterns();
    return triggers.size + (timePatterns.length > 0 ? 1 : 0);
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
    
    if (peakHour && hourCounts[parseInt(peakHour[0])] > 2) {
      patterns.push(`Peak time: ${peakHour[0]}:00`);
    }
    
    return patterns;
  }

  private generatePatterns(): string {
    const patterns = [];
    
    // Time pattern
    const timePatterns = this.analyzeTimePatterns();
    if (timePatterns.length > 0) {
      patterns.push(`
        <div class="pattern-item">
          <div class="pattern-icon">⏰</div>
          <div class="pattern-content">
            <h4>Time of Day</h4>
            <p>${timePatterns[0]}</p>
          </div>
        </div>
      `);
    }
    
    // Trigger patterns
    const triggerCounts: { [trigger: string]: number } = {};
    this.sessions.forEach(session => {
      const trigger = session.context?.trigger;
      if (trigger) {
        triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
      }
    });
    
    const topTrigger = Object.entries(triggerCounts).reduce((a, b) => 
      triggerCounts[a[0]] > triggerCounts[b[0]] ? a : b
    );
    
    if (topTrigger && triggerCounts[topTrigger[0]] > 2) {
      patterns.push(`
        <div class="pattern-item">
          <div class="pattern-icon">🎯</div>
          <div class="pattern-content">
            <h4>Common Trigger</h4>
            <p>Most frequent trigger: ${topTrigger[0]}</p>
          </div>
        </div>
      `);
    }
    
    // Intensity pattern
    const avgIntensity = parseFloat(this.getAverageIntensity());
    if (avgIntensity > 6) {
      patterns.push(`
        <div class="pattern-item">
          <div class="pattern-icon">📈</div>
          <div class="pattern-content">
            <h4>High Intensity</h4>
            <p>Average intensity is ${avgIntensity.toFixed(1)}/10</p>
          </div>
        </div>
      `);
    }
    
    if (patterns.length === 0) {
      return `
        <div class="pattern-item">
          <div class="pattern-icon">📊</div>
          <div class="pattern-content">
            <h4>Building Patterns</h4>
            <p>Continue logging sessions to discover patterns</p>
          </div>
        </div>
      `;
    }
    
    return patterns.join('');
  }

  private generateInsights(): string {
    const insights = [];

    // Average Escalation
    const avgEscalation = this.sessions.length > 0 ? this.sessions.reduce((sum, session) => sum + session.escalationIndex, 0) / this.sessions.length : 0;
    insights.push(`
      <div class="insight-item">
        <div class="insight-icon">⚡</div>
        <div class="insight-content">
          <h4>Average Escalation</h4>
          <p>Your average escalation index is ${avgEscalation.toFixed(2)}</p>
        </div>
      </div>
    `);

    // Most Common Trigger
    const triggerCounts: { [trigger: string]: number } = {};
    this.sessions.forEach(session => {
      const trigger = session.context?.trigger;
      if (trigger) {
        triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
      }
    });

    const topTrigger = Object.entries(triggerCounts).reduce((a, b) => 
      triggerCounts[a[0]] > triggerCounts[b[0]] ? a : b
    );

    if (topTrigger && triggerCounts[topTrigger[0]] > 2) {
      insights.push(`
        <div class="insight-item">
          <div class="insight-icon">🎯</div>
          <div class="insight-content">
            <h4>Common Trigger</h4>
            <p>Most frequent trigger: ${topTrigger[0]}</p>
          </div>
        </div>
      `);
    }

    // Environment Noise Percentage
    const totalSessions = this.sessions.length;
    const sessionsWithAudio = this.sessions.filter(s => s.hasAudio).length;
    const sessionsWithVideo = this.sessions.filter(s => s.hasVideo).length;
    const sessionsWithBoth = this.sessions.filter(s => s.hasAudio && s.hasVideo).length;

    const audioNoise = (sessionsWithAudio / totalSessions) * 100;
    const videoNoise = (sessionsWithVideo / totalSessions) * 100;
    const combinedNoise = ((sessionsWithAudio + sessionsWithVideo - sessionsWithBoth) / totalSessions) * 100;

    insights.push(`
      <div class="insight-item">
        <div class="insight-icon">🔊</div>
        <div class="insight-content">
          <h4>Environment Noise</h4>
          <p>Audio noise: ${audioNoise.toFixed(1)}%, Video noise: ${videoNoise.toFixed(1)}%, Combined noise: ${combinedNoise.toFixed(1)}%</p>
        </div>
      </div>
    `);

    return insights.join('');
  }

  private renderSessions(): string {
    if (this.sessions.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-icon">📊</div>
          <h4>No Sessions Yet</h4>
          <p>Start your first tantrum session to see your history here.</p>
        </div>
      `;
    }
    
    return this.sessions.map((session, index) => {
      const date = new Date(session.timestamp);
      const timeString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      const trigger = session.context?.trigger || 'Unknown';
      const notes = session.context?.notes || '';
      
      return `
        <div class="session-item" data-index="${index}">
          <div class="session-header">
            <div class="session-date">${timeString} · esc=${session.escalationIndex.toFixed(2)}</div>
            <button class="delete-btn" data-index="${index}">🗑️</button>
          </div>
          <div class="session-details">
            <div class="session-intensity">Intensity: ${session.intensity}/10</div>
            <div class="session-trigger">Trigger: ${trigger}</div>
            ${session.hasAudio ? '<div class="session-media">🎤 Audio</div>' : ''}
            ${session.hasVideo ? '<div class="session-media">🎥 Video</div>' : ''}
            ${notes ? `<div class="session-notes">${notes}</div>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  private bindEvents(): void {
    // Back button
    const backBtn = this.container.querySelector('.back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.router.navigate({ dyad: 'tantrum', screen: 'home' });
      });
    }

    // Export button
    const exportBtn = this.container.querySelector('[data-action="export"]');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.handleExport();
      });
    }

    // New session button
    const newSessionBtn = this.container.querySelector('[data-action="new-session"]');
    if (newSessionBtn) {
      newSessionBtn.addEventListener('click', () => {
        this.router.navigate({ dyad: 'tantrum', screen: 'home' });
      });
    }

    // Clear all button
    const clearAllBtn = this.container.querySelector('[data-action="clear-all"]');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', () => {
        this.handleClearAll();
      });
    }

    // Delete individual sessions
    const deleteBtns = this.container.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt((e.currentTarget as HTMLElement).dataset.index || '0');
        this.handleDeleteSession(index);
      });
    });
  }

  private handleExport(): void {
    const exportData = {
      sessions: this.sessions,
      summary: {
        totalSessions: this.sessions.length,
        averageIntensity: this.getAverageIntensity(),
        patternsCount: this.getPatternsCount(),
        exportDate: new Date().toISOString()
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tantrum-history-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private handleClearAll(): void {
    if (confirm('Are you sure you want to delete all tantrum session data? This cannot be undone.')) {
      localStorage.removeItem('tantrum_history');
      this.sessions = [];
      this.render(); // Re-render to show empty state
    }
  }

  private handleDeleteSession(index: number): void {
    if (confirm('Delete this session?')) {
      this.sessions.splice(index, 1);
      localStorage.setItem('tantrum_history', JSON.stringify(this.sessions));
      this.render(); // Re-render to update the list
    }
  }

  public destroy(): void {
    // Clean up event listeners if needed
  }
} 