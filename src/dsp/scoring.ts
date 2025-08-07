/**
 * Unified scoring and tip selection for all dyads
 */

export interface TipData {
  tips: Record<string, Record<string, string[]>>;
  badges: Record<string, any>;
  [key: string]: any;
}

export class DyadScoring {
  private static tipCache: Map<string, TipData> = new Map();

  /**
   * Load tips data for a specific dyad
   */
  public static async loadTips(dyad: 'night' | 'tantrum' | 'meal'): Promise<TipData> {
    if (this.tipCache.has(dyad)) {
      return this.tipCache.get(dyad)!;
    }

    try {
      const response = await fetch(`/scoring/${dyad}/tips.json`);
      const tipsData = await response.json();
      this.tipCache.set(dyad, tipsData);
      return tipsData;
    } catch (error) {
      console.error(`Failed to load tips for ${dyad}:`, error);
      return { tips: {}, badges: {} };
    }
  }

  /**
   * Select a tip based on dyad context and metrics
   */
  public static selectTip(
    dyad: 'night' | 'tantrum' | 'meal',
    context: any,
    metrics: any
  ): { tip: string; badge?: string } {
    const tipsData = this.tipCache.get(dyad);
    if (!tipsData) {
      return { tip: 'Great session! Keep up the good work.' };
    }

    let tipCategory = 'general';
    let tipLevel = 'medium';

    // Dyad-specific tip selection logic
    switch (dyad) {
      case 'tantrum':
        tipCategory = this.selectTantrumTipCategory(context, metrics);
        tipLevel = this.selectTantrumTipLevel(metrics.escalation_index);
        break;
      
      case 'meal':
        tipCategory = this.selectMealTipCategory(context, metrics);
        tipLevel = this.selectMealTipLevel(metrics.meal_mood);
        break;
      
      case 'night':
        tipCategory = this.selectNightTipCategory(context, metrics);
        tipLevel = this.selectNightTipLevel(metrics.score?.short);
        break;
    }

    // Get tip from category and level
    const tips = tipsData.tips[tipCategory]?.[tipLevel] || 
                 tipsData.tips.general?.[tipLevel] || 
                 ['Great session! Keep up the good work.'];

    const tip = tips[Math.floor(Math.random() * tips.length)];

    // Check for badges
    const badge = this.checkForBadge(dyad, context, metrics, tipsData);

    return { tip, badge };
  }

  private static selectTantrumTipCategory(context: any, _metrics: any): string {
    const trigger = context.trigger || 'unknown';
    return trigger;
  }

  private static selectTantrumTipLevel(escalationIndex: number): string {
    if (escalationIndex < 0.33) return 'low';
    if (escalationIndex < 0.66) return 'medium';
    return 'high';
  }

  private static selectMealTipCategory(_context: any, metrics: any): string {
    // Check for specific issues first
    if (metrics.dietary_diversity < 0.3) return 'diversity';
    if (metrics.clutter_score > 0.7) return 'clutter';
    if (metrics.plate_coverage < 0.3 || metrics.plate_coverage > 0.8) return 'coverage';
    return 'mood';
  }

  private static selectMealTipLevel(mealMood: number): string {
    if (mealMood < 40) return 'low';
    if (mealMood < 70) return 'medium';
    return 'high';
  }

  private static selectNightTipCategory(_context: any, _metrics: any): string {
    // Night helper uses existing logic
    return 'general';
  }

  private static selectNightTipLevel(score: number): string {
    if (score < 30) return 'low';
    if (score < 70) return 'medium';
    return 'high';
  }

  private static checkForBadge(
    dyad: string,
    context: any,
    metrics: any,
    tipsData: TipData
  ): string | undefined {
    const badges = tipsData.badges || {};
    
    for (const [_badgeKey, badge] of Object.entries(badges)) {
      const badgeData = badge as any;
      const triggers = badgeData.trigger || [];
      
      let shouldAward = false;
      
      switch (dyad) {
        case 'tantrum':
          shouldAward = this.checkTantrumBadge(triggers, context, metrics);
          break;
        case 'meal':
          shouldAward = this.checkMealBadge(triggers, context, metrics);
          break;
        case 'night':
          shouldAward = this.checkNightBadge(triggers, context, metrics);
          break;
      }
      
      if (shouldAward) {
        return badgeData.name;
      }
    }
    
    return undefined;
  }

  private static checkTantrumBadge(triggers: string[], context: any, _metrics: any): boolean {
    const coRegActions = context.co_regulation || [];
    return triggers.some(trigger => coRegActions.includes(trigger));
  }

  private static checkMealBadge(triggers: string[], _context: any, metrics: any): boolean {
    return triggers.some(trigger => {
      switch (trigger) {
        case 'dietary_diversity':
          return metrics.dietary_diversity > 0.7;
        case 'plate_coverage':
          return metrics.plate_coverage >= 0.4 && metrics.plate_coverage <= 0.7;
        case 'meal_mood':
          return metrics.meal_mood > 80;
        default:
          return false;
      }
    });
  }

  private static checkNightBadge(triggers: string[], context: any, metrics: any): boolean {
    // Night helper badge logic
    return triggers.some(trigger => {
      switch (trigger) {
        case 'good_score':
          return metrics.score?.short > 70;
        case 'consistent':
          return context.consistency_score > 0.8;
        default:
          return false;
      }
    });
  }

  /**
   * Clear tip cache (useful for testing or updates)
   */
  public static clearCache(): void {
    this.tipCache.clear();
  }
} 