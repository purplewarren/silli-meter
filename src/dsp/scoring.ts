/**
 * Scoring module - reads weights/tips JSON and computes scores
 */

import type { AudioFeatures } from './features.js';

export interface ScoringWeights {
  w1_vad: number;
  w2_flux: number;
  w3_centroid: number;
  w4_level: number;
  w5_steady_bonus: number;
}

export interface Tips {
  quiet: string[];
  speech: string[];
  tv_music: string[];
  white_noise: string[];
}

export interface ScoreResult {
  score: number;
  badges: string[];
  tips: string[];
}

export class Scorer {
  private weights: ScoringWeights;
  private tips: Tips;

  constructor() {
    // Default weights (same as bot)
    this.weights = {
      w1_vad: 35,
      w2_flux: 20,
      w3_centroid: 35,
      w4_level: 35,
      w5_steady_bonus: 10
    };
    
    // Default tips
    this.tips = {
      quiet: [
        "Quiet minute + 4-7-8 breathing; speak softer than a whisper.",
        "Dim lights to warm (~1800K); hide bright screens.",
        "Lullaby pacing ~60–70 BPM; mirror child, then fade."
      ],
      speech: [
        "Lower your voice gradually; use gentle whispers.",
        "Create a calm environment; reduce background noise.",
        "Use soothing tones; avoid sudden volume changes."
      ],
      tv_music: [
        "Turn down media volume; use subtitles if needed.",
        "Switch to calming sounds; avoid stimulating content.",
        "Create a quiet zone; minimize electronic distractions."
      ],
      white_noise: [
        "White noise is good for sleep; keep it consistent.",
        "Use gentle, steady sounds; avoid sudden changes.",
        "Maintain a peaceful environment; reduce interruptions."
      ]
    };
  }

  async loadWeightsAndTips(): Promise<void> {
    try {
      // Load weights
      const weightsResponse = await fetch('/scoring/weights.json');
      if (weightsResponse.ok) {
        this.weights = await weightsResponse.json();
      }
      
      // Load tips
      const tipsResponse = await fetch('/scoring/tips.json');
      if (tipsResponse.ok) {
        this.tips = await tipsResponse.json();
      }
    } catch (error) {
      console.warn('Could not load weights/tips, using defaults:', error);
    }
  }

  calculateScore(features: AudioFeatures): ScoreResult {
    // Normalize level_dbfs to 0..1
    const level_norm = Math.max(0, Math.min(1, (features.level_dbfs + 60) / 60));
    
    // Calculate base score
    let score = 100.0;
    score -= this.weights.w1_vad * features.vad_fraction;
    score -= this.weights.w2_flux * features.flux_norm;
    score -= this.weights.w3_centroid * features.centroid_norm;
    score -= this.weights.w4_level * level_norm;
    
    // Steady bonus for quiet, steady sounds
    const steady_bonus = (1.0 - features.flux_norm) * 
      (features.level_dbfs >= -40.0 && features.level_dbfs <= -25.0 ? 1 : 0);
    score += this.weights.w5_steady_bonus * steady_bonus;
    
    // White noise calibration bump
    const is_steady_low = (features.flux_norm < 0.12 &&
                          features.level_dbfs >= -40.0 && features.level_dbfs <= -25.0 &&
                          features.centroid_norm < 0.45);
    if (is_steady_low) {
      score += 6; // small bump for steady broadband at safe level
    }
    
    score = Math.max(0, Math.min(100, score));
    
    // Determine badges
    const badges = this.determineBadges(features);
    
    // Select tips based on score
    const tips = this.selectTips(score);
    
    return { score: Math.round(score), badges, tips };
  }

  private determineBadges(features: AudioFeatures): string[] {
    const badges: string[] = [];
    
    // Speech present
    if (features.vad_fraction > 0.3) {
      badges.push('Speech present');
    }
    
    // Steady
    if (features.stationarity > 0.7) {
      badges.push('Steady');
    }
    
    // Fluctuating
    if (features.flux_norm > 0.5) {
      badges.push('Fluctuating');
    }
    
    return badges;
  }

  private selectTips(score: number): string[] {
    let category: keyof Tips;
    
    if (score >= 70) {
      category = 'quiet';
    } else if (score >= 50) {
      category = 'speech';
    } else if (score >= 30) {
      category = 'tv_music';
    } else {
      category = 'white_noise';
    }
    
    return this.tips[category] || this.tips.speech;
  }
} 