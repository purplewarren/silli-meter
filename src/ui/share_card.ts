/**
 * Share card generation for all dyads
 */

export interface ShareCardData {
  dyad: 'night' | 'tantrum' | 'meal';
  metric: number;
  metricLabel: string;
  bullets: string[];
  timestamp: string;
  family_id?: string;
  session_id?: string;
}

export class ShareCard {
  /**
   * Generate share card data for a dyad
   */
  public static generateShareCard(
    dyad: 'night' | 'tantrum' | 'meal',
    metrics: any,
    context: any,
    tip: string,
    badge?: string
  ): ShareCardData {
    const metric = this.getDyadMetric(dyad, metrics);
    const metricLabel = this.getMetricLabel(dyad);
    const bullets = this.generateBullets(dyad, metrics, context, tip, badge);

    return {
      dyad,
      metric,
      metricLabel,
      bullets,
      timestamp: new Date().toISOString(),
      family_id: context.family_id,
      session_id: context.session_id
    };
  }

  private static getDyadMetric(dyad: string, metrics: any): number {
    switch (dyad) {
      case 'night':
        return metrics.score?.short || 0;
      case 'tantrum':
        return Math.round((metrics.escalation_index || 0) * 100);
      case 'meal':
        return Math.round(metrics.meal_mood || 0);
      default:
        return 0;
    }
  }

  private static getMetricLabel(dyad: string): string {
    switch (dyad) {
      case 'night':
        return 'Sleep Score';
      case 'tantrum':
        return 'Escalation Level';
      case 'meal':
        return 'Meal Mood';
      default:
        return 'Score';
    }
  }

  private static generateBullets(
    dyad: string,
    metrics: any,
    context: any,
    tip: string,
    badge?: string
  ): string[] {
    const bullets: string[] = [];

    // Add badge if present
    if (badge) {
      bullets.push(badge);
    }

    // Add dyad-specific insights
    switch (dyad) {
      case 'night':
        bullets.push(...this.generateNightBullets(metrics, context));
        break;
      case 'tantrum':
        bullets.push(...this.generateTantrumBullets(metrics, context));
        break;
      case 'meal':
        bullets.push(...this.generateMealBullets(metrics, context));
        break;
    }

    // Add tip (truncated if needed)
    if (tip && bullets.length < 2) {
      const truncatedTip = tip.length > 60 ? tip.substring(0, 57) + '...' : tip;
      bullets.push(truncatedTip);
    }

    // Ensure we don't exceed 2 bullets
    return bullets.slice(0, 2);
  }

  private static generateNightBullets(metrics: any, context: any): string[] {
    const bullets: string[] = [];
    
    if (metrics.score?.short > 80) {
      bullets.push('Excellent sleep environment');
    } else if (metrics.score?.short > 60) {
      bullets.push('Good sleep conditions');
    } else {
      bullets.push('Room for improvement');
    }

    if (context.duration_min && context.duration_min > 10) {
      bullets.push('Long recording session');
    }

    return bullets;
  }

  private static generateTantrumBullets(metrics: any, context: any): string[] {
    const bullets: string[] = [];
    
    const escalationLevel = metrics.escalation_index || 0;
    if (escalationLevel < 0.33) {
      bullets.push('Low escalation level');
    } else if (escalationLevel < 0.66) {
      bullets.push('Moderate escalation');
    } else {
      bullets.push('High escalation level');
    }

    if (context.trigger) {
      bullets.push(`Trigger: ${context.trigger}`);
    }

    return bullets;
  }

  private static generateMealBullets(metrics: any, _context: any): string[] {
    const bullets: string[] = [];
    
    const mealMood = metrics.meal_mood || 0;
    if (mealMood > 80) {
      bullets.push('High meal excitement');
    } else if (mealMood > 60) {
      bullets.push('Good meal mood');
    } else {
      bullets.push('Low meal interest');
    }

    if (metrics.dietary_diversity > 0.7) {
      bullets.push('Great food variety');
    } else if (metrics.dietary_diversity < 0.3) {
      bullets.push('Limited food variety');
    }

    return bullets;
  }

  /**
   * Create share card HTML
   */
  public static createShareCardHTML(data: ShareCardData): string {
    const dyadEmoji = this.getDyadEmoji(data.dyad);
    const metricColor = this.getMetricColor(data.dyad, data.metric);
    
    return `
      <div class="share-card" style="
        background: linear-gradient(135deg, #1e293b, #334155);
        border-radius: 16px;
        padding: 24px;
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        max-width: 400px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      ">
        <div style="display: flex; align-items: center; margin-bottom: 16px;">
          <div style="font-size: 32px; margin-right: 12px;">${dyadEmoji}</div>
          <div>
            <div style="font-size: 18px; font-weight: 600; margin-bottom: 4px;">
              ${data.dyad.charAt(0).toUpperCase() + data.dyad.slice(1)} Helper
            </div>
            <div style="font-size: 14px; opacity: 0.7;">
              ${new Date(data.timestamp).toLocaleDateString()}
            </div>
          </div>
        </div>
        
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 48px; font-weight: bold; color: ${metricColor}; margin-bottom: 8px;">
            ${data.metric}
          </div>
          <div style="font-size: 16px; opacity: 0.8;">
            ${data.metricLabel}
          </div>
        </div>
        
        <div style="margin-bottom: 16px;">
          ${data.bullets.map(bullet => `
            <div style="
              background: rgba(255, 255, 255, 0.1);
              border-radius: 8px;
              padding: 12px;
              margin-bottom: 8px;
              font-size: 14px;
              line-height: 1.4;
            ">
              • ${bullet}
            </div>
          `).join('')}
        </div>
        
        <div style="
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          padding-top: 16px;
          font-size: 12px;
          opacity: 0.6;
          text-align: center;
        ">
          Silli AI • Privacy-first analysis
        </div>
      </div>
    `;
  }

  private static getDyadEmoji(dyad: string): string {
    switch (dyad) {
      case 'night':
        return '🌙';
      case 'tantrum':
        return '😤';
      case 'meal':
        return '🍽️';
      default:
        return '📊';
    }
  }

  private static getMetricColor(dyad: string, metric: number): string {
    let threshold: number;
    
    switch (dyad) {
      case 'night':
        threshold = 70; // Higher is better
        break;
      case 'tantrum':
        threshold = 50; // Lower is better
        break;
      case 'meal':
        threshold = 70; // Higher is better
        break;
      default:
        threshold = 50;
    }

    const isGood = dyad === 'tantrum' ? metric < threshold : metric > threshold;
    
    if (isGood) {
      return '#22c55e'; // Green
    } else if (metric > threshold * 0.7) {
      return '#eab308'; // Yellow
    } else {
      return '#ef4444'; // Red
    }
  }

  /**
   * Download share card as image
   */
  public static async downloadShareCard(data: ShareCardData): Promise<void> {
    const html = this.createShareCardHTML(data);
    
    // Create a temporary container
    const container = document.createElement('div');
    container.innerHTML = html;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);
    
    try {
      // Use html2canvas if available, otherwise fallback to text
      if (typeof (window as any).html2canvas !== 'undefined') {
        const canvas = await (window as any).html2canvas(container.firstElementChild, {
          backgroundColor: null,
          scale: 2
        });
        
        const link = document.createElement('a');
        link.download = `silli-${data.dyad}-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      } else {
        // Fallback: download as text file
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `silli-${data.dyad}-${Date.now()}.json`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }
    } finally {
      document.body.removeChild(container);
    }
  }
}