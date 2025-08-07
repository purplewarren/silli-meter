/**
 * On-device image analysis for meal photos
 */

export interface ImageAnalysis {
  dietaryDiversity: number; // 0-1 scale
  clutterScore: number; // 0-1 scale
  plateCoverage: number; // 0-1 scale
  thumbnail: string; // base64 data URL
}

export class ImageAnalyzer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  /**
   * Analyze meal image for dietary diversity, clutter, and plate coverage
   */
  public async analyzeMealImage(imageFile: File): Promise<ImageAnalysis> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          // Set canvas size
          this.canvas.width = img.width;
          this.canvas.height = img.height;
          
          // Draw image to canvas
          this.ctx.drawImage(img, 0, 0);
          
          // Get image data
          const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
          
          // Analyze image
          const dietaryDiversity = this.calculateDietaryDiversity(imageData);
          const clutterScore = this.calculateClutterScore(imageData);
          const plateCoverage = this.calculatePlateCoverage(imageData);
          const thumbnail = this.generateThumbnail();
          
          resolve({
            dietaryDiversity,
            clutterScore,
            plateCoverage,
            thumbnail
          });
        } catch (error) {
          reject(new Error('Failed to analyze image'));
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(imageFile);
    });
  }

  /**
   * Calculate dietary diversity based on color diversity
   */
  private calculateDietaryDiversity(imageData: ImageData): number {
    const data = imageData.data;
    const hueBins = new Set<number>();
    
    // Sample every 10th pixel for performance
    for (let i = 0; i < data.length; i += 40) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Convert RGB to hue (simplified)
      const hue = this.rgbToHue(r, g, b);
      const hueBin = Math.floor(hue / 10); // 36 bins (360° / 10°)
      hueBins.add(hueBin);
    }
    
    // Diversity = unique hue bins / total possible bins
    return Math.min(hueBins.size / 36, 1);
  }

  /**
   * Calculate clutter score based on edge density
   */
  private calculateClutterScore(imageData: ImageData): number {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    let edgeCount = 0;
    let totalPixels = 0;
    
    // Simple edge detection using gradient threshold
    for (let y = 1; y < height - 1; y += 2) { // Sample every 2nd row
      for (let x = 1; x < width - 1; x += 2) { // Sample every 2nd column
        const idx = (y * width + x) * 4;
        
        // Calculate horizontal gradient
        const leftIdx = (y * width + (x - 1)) * 4;
        const rightIdx = (y * width + (x + 1)) * 4;
        const hGradient = Math.abs(data[idx] - data[leftIdx]) + 
                         Math.abs(data[idx] - data[rightIdx]);
        
        // Calculate vertical gradient
        const topIdx = ((y - 1) * width + x) * 4;
        const bottomIdx = ((y + 1) * width + x) * 4;
        const vGradient = Math.abs(data[idx] - data[topIdx]) + 
                         Math.abs(data[idx] - data[bottomIdx]);
        
        const totalGradient = hGradient + vGradient;
        
        // Edge threshold
        if (totalGradient > 50) {
          edgeCount++;
        }
        totalPixels++;
      }
    }
    
    return totalPixels > 0 ? Math.min(edgeCount / totalPixels, 1) : 0;
  }

  /**
   * Calculate plate coverage using simple thresholding
   */
  private calculatePlateCoverage(imageData: ImageData): number {
    const data = imageData.data;
    let foregroundPixels = 0;
    let totalPixels = 0;
    
    // Simple luminance-based thresholding
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Calculate luminance
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      
      // Simple threshold: anything not too dark is considered foreground
      if (luminance > 30) {
        foregroundPixels++;
      }
      totalPixels++;
    }
    
    return totalPixels > 0 ? foregroundPixels / totalPixels : 0;
  }

  /**
   * Convert RGB to hue (simplified)
   */
  private rgbToHue(r: number, g: number, b: number): number {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    
    if (delta === 0) return 0;
    
    let hue = 0;
    if (max === r) {
      hue = ((g - b) / delta) % 6;
    } else if (max === g) {
      hue = (b - r) / delta + 2;
    } else {
      hue = (r - g) / delta + 4;
    }
    
    hue *= 60;
    if (hue < 0) hue += 360;
    
    return hue;
  }

  /**
   * Generate thumbnail for gallery
   */
  private generateThumbnail(): string {
    // Create a smaller canvas for thumbnail
    const thumbCanvas = document.createElement('canvas');
    const thumbCtx = thumbCanvas.getContext('2d')!;
    
    // Set thumbnail size
    const maxSize = 150;
    const ratio = Math.min(maxSize / this.canvas.width, maxSize / this.canvas.height);
    const thumbWidth = this.canvas.width * ratio;
    const thumbHeight = this.canvas.height * ratio;
    
    thumbCanvas.width = thumbWidth;
    thumbCanvas.height = thumbHeight;
    
    // Draw scaled image
    thumbCtx.drawImage(this.canvas, 0, 0, thumbWidth, thumbHeight);
    
    // Convert to data URL
    return thumbCanvas.toDataURL('image/jpeg', 0.7);
  }

  /**
   * Analyze image from blob
   */
  public async analyzeMealImageBlob(imageBlob: Blob): Promise<ImageAnalysis> {
    const file = new File([imageBlob], 'meal.jpg', { type: 'image/jpeg' });
    return this.analyzeMealImage(file);
  }
} 