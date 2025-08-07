/**
 * Video motion analysis via frame differencing
 */

export interface MotionAnalysis {
  motionScore: number; // 0-1 scale
  frameCount: number;
  averageMotion: number;
  peakMotion: number;
  motionPercentiles: {
    p50: number;
    p75: number;
    p90: number;
    p95: number;
  };
}

export class VideoAnalyzer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private previousFrame: ImageData | null = null;
  private motionScores: number[] = [];

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  /**
   * Analyze video file for motion using frame differencing
   */
  public async analyzeVideo(videoFile: File): Promise<MotionAnalysis> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      
      video.onloadedmetadata = () => {
        this.canvas.width = video.videoWidth;
        this.canvas.height = video.videoHeight;
        this.motionScores = [];
        this.previousFrame = null;
        
        video.currentTime = 0;
        this.analyzeFrames(video, resolve, reject);
      };
      
      video.onerror = () => reject(new Error('Failed to load video'));
      video.src = URL.createObjectURL(videoFile);
    });
  }

  /**
   * Analyze video blob for motion
   */
  public async analyzeVideoBlob(videoBlob: Blob): Promise<MotionAnalysis> {
    const file = new File([videoBlob], 'video.webm', { type: 'video/webm' });
    return this.analyzeVideo(file);
  }

  private analyzeFrames(video: HTMLVideoElement, resolve: (result: MotionAnalysis) => void, reject: (error: Error) => void): void {
    const frameInterval = 1000 / 10; // 10 FPS sampling
    let frameCount = 0;
    const maxFrames = 600; // Max 60 seconds at 10 FPS

    const processFrame = () => {
      if (frameCount >= maxFrames || video.ended) {
        const result = this.calculateMotionAnalysis();
        URL.revokeObjectURL(video.src);
        resolve(result);
        return;
      }

      try {
        // Draw current frame to canvas
        this.ctx.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);
        const currentFrame = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        // Calculate motion score if we have a previous frame
        if (this.previousFrame) {
          const motionScore = this.calculateFrameDifference(this.previousFrame, currentFrame);
          this.motionScores.push(motionScore);
        }

        this.previousFrame = currentFrame;
        frameCount++;

        // Schedule next frame
        setTimeout(() => {
          video.currentTime += frameInterval / 1000;
          processFrame();
        }, frameInterval);

      } catch (error) {
        reject(new Error('Failed to process video frame'));
      }
    };

    video.onseeked = processFrame;
    video.currentTime = 0;
  }

  /**
   * Calculate motion between two frames using pixel differencing
   */
  private calculateFrameDifference(frame1: ImageData, frame2: ImageData): number {
    const data1 = frame1.data;
    const data2 = frame2.data;
    let totalDifference = 0;
    let pixelCount = 0;

    // Sample every 4th pixel for performance (RGB channels)
    for (let i = 0; i < data1.length; i += 16) {
      const r1 = data1[i];
      const g1 = data1[i + 1];
      const b1 = data1[i + 2];
      
      const r2 = data2[i];
      const g2 = data2[i + 1];
      const b2 = data2[i + 2];

      // Calculate color difference
      const diff = Math.abs(r2 - r1) + Math.abs(g2 - g1) + Math.abs(b2 - b1);
      totalDifference += diff;
      pixelCount++;
    }

    // Normalize to 0-1 scale
    return pixelCount > 0 ? Math.min(totalDifference / (pixelCount * 765), 1) : 0;
  }

  /**
   * Calculate final motion analysis from collected scores
   */
  private calculateMotionAnalysis(): MotionAnalysis {
    if (this.motionScores.length === 0) {
      return {
        motionScore: 0,
        frameCount: 0,
        averageMotion: 0,
        peakMotion: 0,
        motionPercentiles: { p50: 0, p75: 0, p90: 0, p95: 0 }
      };
    }

    const sortedScores = [...this.motionScores].sort((a, b) => a - b);
    const averageMotion = this.motionScores.reduce((sum, score) => sum + score, 0) / this.motionScores.length;
    const peakMotion = Math.max(...this.motionScores);

    // Calculate percentiles
    const p50 = this.calculatePercentile(sortedScores, 50);
    const p75 = this.calculatePercentile(sortedScores, 75);
    const p90 = this.calculatePercentile(sortedScores, 90);
    const p95 = this.calculatePercentile(sortedScores, 95);

    // Overall motion score (weighted average of peak and average)
    const motionScore = (peakMotion * 0.7) + (averageMotion * 0.3);

    return {
      motionScore,
      frameCount: this.motionScores.length,
      averageMotion,
      peakMotion,
      motionPercentiles: { p50, p75, p90, p95 }
    };
  }

  /**
   * Calculate percentile from sorted array
   */
  private calculatePercentile(sortedArray: number[], percentile: number): number {
    const index = Math.floor((percentile / 100) * (sortedArray.length - 1));
    return sortedArray[index] || 0;
  }

  /**
   * Extract audio from video file
   */
  public async extractAudioFromVideo(videoFile: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.muted = false;
      video.playsInline = true;
      
      video.onloadedmetadata = () => {
        // Create media stream from video element
        const mediaStream = (video as any).captureStream?.() || new MediaStream();
        const audioStream = new MediaStream(mediaStream.getAudioTracks());
        
        const mediaRecorder = new MediaRecorder(audioStream, {
          mimeType: 'audio/webm'
        });
        
        const audioChunks: Blob[] = [];
        
        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };
        
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          resolve(audioBlob);
        };
        
        mediaRecorder.start();
        video.play();
        
        video.onended = () => {
          mediaRecorder.stop();
          URL.revokeObjectURL(video.src);
        };
      };
      
      video.onerror = () => reject(new Error('Failed to extract audio'));
      video.src = URL.createObjectURL(videoFile);
    });
  }
} 