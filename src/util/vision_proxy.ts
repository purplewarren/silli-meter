/**
 * Vision proxy utility for meal photo analysis
 * Extracts derived metrics without storing raw image data
 * Ensures privacy by computing only numerical proxies
 */

export interface MealProxies {
  color_var: number;        // Color variance (0..1)
  plate_items_est: number;  // Estimated number of food items
  green_presence: number;   // Green color presence (0/1)
  clutter_est: number;      // Clutter estimation (0..1)
}

export interface VisionSettings {
  allow_blur_thumbs: boolean;
}

/**
 * Extract derived metrics from an image file
 * Does not persist raw image data - only computes numerical proxies
 */
export async function extractMealProxies(
  file: File, 
  settings: VisionSettings = { allow_blur_thumbs: false }
): Promise<{ proxies: MealProxies; thumbnail?: string }> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    const img = new Image();
    img.onload = () => {
      try {
        // Set canvas size for analysis (resize for performance)
        const maxSize = 400;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        // Draw image to canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Extract image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Compute derived proxies
        const proxies = computeProxies(data, canvas.width, canvas.height);

        // Generate thumbnail if setting enabled
        let thumbnail: string | undefined;
        if (settings.allow_blur_thumbs) {
          thumbnail = generateBlurredThumbnail(canvas, ctx);
        }

        // Clear canvas and image data immediately
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = 0;
        canvas.height = 0;

        resolve({ proxies, thumbnail });
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Load image from file
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Compute derived metrics from image data
 */
function computeProxies(data: Uint8ClampedArray, width: number, height: number): MealProxies {
  const pixels = width * height;
  const colors: number[] = [];
  let greenPixels = 0;
  let totalBrightness = 0;

  // Analyze each pixel
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Convert to grayscale for brightness
    const brightness = (r + g + b) / 3;
    totalBrightness += brightness;
    
    // Check for green presence (simple threshold)
    if (g > r * 1.2 && g > b * 1.2 && g > 100) {
      greenPixels++;
    }
    
    // Store color values for variance calculation
    colors.push(r, g, b);
  }

  // Calculate color variance
  const mean = colors.reduce((sum, val) => sum + val, 0) / colors.length;
  const variance = colors.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / colors.length;
  const color_var = Math.min(variance / 10000, 1); // Normalize to 0..1

  // Calculate green presence
  const green_presence = greenPixels / pixels > 0.1 ? 1 : 0;

  // Estimate plate items based on color variance and brightness patterns
  const avgBrightness = totalBrightness / pixels;
  const brightness_variance = Math.sqrt(
    Array.from({ length: pixels }, (_, i) => {
      const idx = i * 4;
      const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      return Math.pow(brightness - avgBrightness, 2);
    }).reduce((sum, val) => sum + val, 0) / pixels
  );

  // Estimate number of food items (simplified heuristic)
  const plate_items_est = Math.round(
    Math.min(
      Math.max(
        (color_var * 3 + brightness_variance / 50 + green_presence * 0.5),
        1
      ),
      8
    )
  );

  // Estimate clutter based on color variance and edge density
  const clutter_est = Math.min(color_var * 0.7 + (brightness_variance / 100), 1);

  return {
    color_var,
    plate_items_est,
    green_presence,
    clutter_est
  };
}

/**
 * Generate a blurred 64x64 thumbnail data URL
 */
function generateBlurredThumbnail(canvas: HTMLCanvasElement, _ctx: CanvasRenderingContext2D): string {
  // Create thumbnail canvas
  const thumbCanvas = document.createElement('canvas');
  const thumbCtx = thumbCanvas.getContext('2d');
  if (!thumbCtx) return '';

  thumbCanvas.width = 64;
  thumbCanvas.height = 64;

  // Draw scaled down version
  thumbCtx.drawImage(canvas, 0, 0, 64, 64);

  // Apply blur effect
  thumbCtx.filter = 'blur(2px)';
  thumbCtx.drawImage(thumbCanvas, 0, 0);

  // Return as data URL
  return thumbCanvas.toDataURL('image/jpeg', 0.3);
}

/**
 * Validate meal proxies
 */
export function validateMealProxies(proxies: MealProxies): boolean {
  return (
    typeof proxies.color_var === 'number' && proxies.color_var >= 0 && proxies.color_var <= 1 &&
    typeof proxies.plate_items_est === 'number' && proxies.plate_items_est >= 1 && proxies.plate_items_est <= 10 &&
    typeof proxies.green_presence === 'number' && (proxies.green_presence === 0 || proxies.green_presence === 1) &&
    typeof proxies.clutter_est === 'number' && proxies.clutter_est >= 0 && proxies.clutter_est <= 1
  );
} 