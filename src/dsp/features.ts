/**
 * DSP Features - computes the same features as the bot
 */

export interface AudioFeatures {
  level_dbfs: number;
  centroid_norm: number;
  rolloff_norm: number;
  flux_norm: number;
  vad_fraction: number;
  stationarity: number;
}

export interface FrameFeatures {
  rms: number;
  centroid: number;
  rolloff: number;
  flux: number;
  zcr: number;
}

const SAMPLE_RATE = 16000;

export class FeatureExtractor {
  private previousFrame: Float32Array | null = null;
  private frameCount = 0;

  /**
   * Process audio frame and extract features
   */
  processFrame(audioData: Float32Array): FrameFeatures {
    // RMS (Root Mean Square)
    const rms = Math.sqrt(audioData.reduce((sum, sample) => sum + sample * sample, 0) / audioData.length);
    
    // Convert to frequency domain using FFT
    const fft = this.fft(audioData);
    const magnitude = fft.slice(0, fft.length / 2);
    
    // Spectral centroid
    const centroid = this.spectralCentroid(magnitude);
    
    // Spectral rolloff
    const rolloff = this.spectralRolloff(magnitude);
    
    // Spectral flux (difference from previous frame)
    const flux = this.spectralFlux(magnitude);
    
    // Zero crossing rate
    const zcr = this.zeroCrossingRate(audioData);
    
    this.previousFrame = magnitude;
    this.frameCount++;
    
    return { rms, centroid, rolloff, flux, zcr };
  }

  /**
   * Aggregate features over time window
   */
  aggregateFeatures(frames: FrameFeatures[]): AudioFeatures {
    if (frames.length === 0) {
      return {
        level_dbfs: -60,
        centroid_norm: 0,
        rolloff_norm: 0,
        flux_norm: 0,
        vad_fraction: 0,
        stationarity: 0
      };
    }

    // Level in dBFS
    const rmsValues = frames.map(f => f.rms);
    const avgRms = rmsValues.reduce((sum, rms) => sum + rms, 0) / rmsValues.length;
    const level_dbfs = 20 * Math.log10(Math.max(avgRms, 1e-10));

    // Normalized centroid (0-1)
    const centroids = frames.map(f => f.centroid);
    const centroid_norm = Math.min(centroids.reduce((sum, c) => sum + c, 0) / centroids.length / (SAMPLE_RATE / 2), 1);

    // Normalized rolloff (0-1)
    const rolloffs = frames.map(f => f.rolloff);
    const rolloff_norm = Math.min(rolloffs.reduce((sum, r) => sum + r, 0) / rolloffs.length / (SAMPLE_RATE / 2), 1);

    // Normalized flux (0-1)
    const fluxes = frames.map(f => f.flux);
    const flux_norm = Math.min(fluxes.reduce((sum, f) => sum + f, 0) / fluxes.length, 1);

    // VAD (Voice Activity Detection) - simple energy-based
    const vadThreshold = 0.01;
    const vadFrames = frames.filter(f => f.rms > vadThreshold).length;
    const vad_fraction = vadFrames / frames.length;

    // Stationarity (inverse of flux)
    const stationarity = Math.max(0, 1 - flux_norm);

    return {
      level_dbfs,
      centroid_norm,
      rolloff_norm,
      flux_norm,
      vad_fraction,
      stationarity
    };
  }

  private fft(audioData: Float32Array): Float32Array {
    // Simple FFT implementation (in practice, use a library like FFTW)
    // This is a placeholder - in real implementation, use Web Audio API or FFT library
    const n = audioData.length;
    const real = new Float32Array(n);
    const imag = new Float32Array(n);
    
    // Copy input data
    for (let i = 0; i < n; i++) {
      real[i] = audioData[i];
    }
    
    // Simple FFT (not optimized)
    this.fftRecursive(real, imag, n);
    
    // Return magnitude
    const magnitude = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      magnitude[i] = Math.sqrt(real[i] * real[i] + imag[i] * imag[i]);
    }
    
    return magnitude;
  }

  private fftRecursive(real: Float32Array, imag: Float32Array, n: number): void {
    if (n <= 1) return;

    const evenReal = new Float32Array(n / 2);
    const evenImag = new Float32Array(n / 2);
    const oddReal = new Float32Array(n / 2);
    const oddImag = new Float32Array(n / 2);

    for (let i = 0; i < n / 2; i++) {
      evenReal[i] = real[i * 2];
      evenImag[i] = imag[i * 2];
      oddReal[i] = real[i * 2 + 1];
      oddImag[i] = imag[i * 2 + 1];
    }

    this.fftRecursive(evenReal, evenImag, n / 2);
    this.fftRecursive(oddReal, oddImag, n / 2);

    for (let k = 0; k < n / 2; k++) {
      const angle = -2 * Math.PI * k / n;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      
      const tempReal = cos * oddReal[k] - sin * oddImag[k];
      const tempImag = sin * oddReal[k] + cos * oddImag[k];
      
      real[k] = evenReal[k] + tempReal;
      imag[k] = evenImag[k] + tempImag;
      real[k + n / 2] = evenReal[k] - tempReal;
      imag[k + n / 2] = evenImag[k] - tempImag;
    }
  }

  private spectralCentroid(magnitude: Float32Array): number {
    let weightedSum = 0;
    let sum = 0;
    
    for (let i = 0; i < magnitude.length; i++) {
      const freq = (i * SAMPLE_RATE) / (magnitude.length * 2);
      weightedSum += freq * magnitude[i];
      sum += magnitude[i];
    }
    
    return sum > 0 ? weightedSum / sum : 0;
  }

  private spectralRolloff(magnitude: Float32Array): number {
    const threshold = 0.85; // 85% of total energy
    let totalEnergy = 0;
    let cumulativeEnergy = 0;
    
    for (let i = 0; i < magnitude.length; i++) {
      totalEnergy += magnitude[i];
    }
    
    for (let i = 0; i < magnitude.length; i++) {
      cumulativeEnergy += magnitude[i];
      if (cumulativeEnergy >= threshold * totalEnergy) {
        return (i * SAMPLE_RATE) / (magnitude.length * 2);
      }
    }
    
    return SAMPLE_RATE / 2;
  }

  private spectralFlux(magnitude: Float32Array): number {
    if (!this.previousFrame) {
      return 0;
    }
    
    let flux = 0;
    for (let i = 0; i < magnitude.length; i++) {
      const diff = magnitude[i] - this.previousFrame[i];
      flux += diff * diff;
    }
    
    return Math.sqrt(flux);
  }

  private zeroCrossingRate(audioData: Float32Array): number {
    let crossings = 0;
    for (let i = 1; i < audioData.length; i++) {
      if ((audioData[i] >= 0) !== (audioData[i - 1] >= 0)) {
        crossings++;
      }
    }
    return crossings / audioData.length;
  }
} 