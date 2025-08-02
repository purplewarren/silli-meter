/**
 * Session Export Utility - generates session JSON contract
 */

interface ExportData {
  config: {
    mode: 'helper' | 'low_power';
    family: string;
    session: string;
  };
  sessionData: any[];
  startTime: number;
  currentScore: number;
  currentBadges: string[];
}

export class SessionExporter {
  exportSession(data: ExportData): string {
    const duration = Date.now() - data.startTime;
    const durationSeconds = Math.floor(duration / 1000);
    
    // Calculate features summary
    const featuresSummary = this.calculateFeaturesSummary(data.sessionData);
    
    // Calculate scores for different time scales
    const scores = this.calculateScores(data.sessionData);
    
    // Calculate trend (used in scores object)
    
    const sessionJson = {
      ts_start: new Date(data.startTime).toISOString(),
      duration_s: durationSeconds,
      mode: data.config.mode,
      family_id: data.config.family,
      session_id: data.config.session,
      scales: { short_sec: 10, mid_sec: 60, long_sec: 600 },
      features_summary: featuresSummary,
      score: scores,
      badges: data.currentBadges,
      events: this.generateEvents(data.sessionData),
      pii: false,
      version: "pwa_0.1"
    };
    
    return JSON.stringify(sessionJson, null, 2);
  }

  private calculateFeaturesSummary(sessionData: any[]): any {
    if (sessionData.length === 0) {
      return {
        level_dbfs_p50: -60,
        level_dbfs_p90: -60,
        centroid_norm_mean: 0,
        flux_norm_mean: 0,
        vad_fraction: 0,
        stationarity: 0
      };
    }

    // Extract level_dbfs values
    const levels = sessionData.map(d => d.features.level_dbfs || -60);
    const centroids = sessionData.map(d => d.features.centroid_norm || 0);
    const fluxes = sessionData.map(d => d.features.flux_norm || 0);
    const vadFractions = sessionData.map(d => d.features.vad_fraction || 0);
    const stationarities = sessionData.map(d => d.features.stationarity || 0);

    // Calculate percentiles and means
    levels.sort((a, b) => a - b);
    const p50Index = Math.floor(levels.length * 0.5);
    const p90Index = Math.floor(levels.length * 0.9);

    return {
      level_dbfs_p50: levels[p50Index] || -60,
      level_dbfs_p90: levels[p90Index] || -60,
      centroid_norm_mean: centroids.reduce((sum, c) => sum + c, 0) / centroids.length,
      flux_norm_mean: fluxes.reduce((sum, f) => sum + f, 0) / fluxes.length,
      vad_fraction: vadFractions.reduce((sum, v) => sum + v, 0) / vadFractions.length,
      stationarity: stationarities.reduce((sum, s) => sum + s, 0) / stationarities.length
    };
  }

  private calculateScores(sessionData: any[]): any {
    if (sessionData.length === 0) {
      return { short: 0, mid: 0, long: 0, trend: "stable" };
    }

    // Calculate scores for different time windows
    const shortScores = this.calculateWindowScores(sessionData, 10); // 10 seconds
    const midScores = this.calculateWindowScores(sessionData, 60);   // 60 seconds
    const longScores = this.calculateWindowScores(sessionData, 600); // 600 seconds

    return {
      short: Math.round(shortScores.average),
      mid: Math.round(midScores.average),
      long: Math.round(longScores.average),
      trend: this.calculateTrend({ short: shortScores, mid: midScores, long: longScores })
    };
  }

  private calculateWindowScores(sessionData: any[], windowSeconds: number): any {
    const windowMs = windowSeconds * 1000;
    const now = Date.now();
    const recentData = sessionData.filter(d => 
      (now - d.timestamp) <= windowMs
    );

    if (recentData.length === 0) {
      return { average: 0, trend: "stable" };
    }

    // Calculate average score (simplified - in practice, use actual scoring)
    const scores = recentData.map(d => {
      // Simple scoring based on features
      let score = 100;
      score -= d.features.vad_fraction * 35;
      score -= d.features.flux_norm * 20;
      score -= d.features.centroid_norm * 35;
      score -= Math.max(0, Math.min(1, (d.features.level_dbfs + 60) / 60)) * 35;
      return Math.max(0, Math.min(100, score));
    });

    const average = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    
    return { average, scores };
  }

  private calculateTrend(scores: any): string {
    // Simple trend calculation
    if (scores.short > scores.mid && scores.mid > scores.long) {
      return "improving";
    } else if (scores.short < scores.mid && scores.mid < scores.long) {
      return "declining";
    } else {
      return "stable";
    }
  }

  private generateEvents(sessionData: any[]): any[] {
    const events = [];
    
    // Add suggestion events (simplified)
    if (sessionData.length > 0) {
      events.push({
        t: Math.floor(sessionData[0].timestamp / 1000),
        type: "suggestion",
        id: "session_start"
      });
    }
    
    return events;
  }
} 