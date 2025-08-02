/**
 * Share Card Generator - creates PNG timeline cards
 */

interface CardData {
  score: number;
  badges: string[];
  duration: number;
}

export class ShareCard {
  async generateCard(data: CardData): Promise<Blob> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;
    
    // Background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Silli Parent Night Helper', canvas.width / 2, 60);
    
    // Score circle
    this.drawScoreCircle(ctx, data.score, canvas.width / 2, 200);
    
    // Score text
    ctx.fillStyle = '#6366f1';
    ctx.font = 'bold 48px Arial';
    ctx.fillText(`${data.score}/100`, canvas.width / 2, 220);
    
    // Badges
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Detected Features:', canvas.width / 2, 280);
    
    data.badges.forEach((badge, index) => {
      ctx.fillStyle = '#6366f1';
      ctx.fillRect(300 + index * 120, 300, 100, 30);
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.fillText(badge, 350 + index * 120, 320);
    });
    
    // Duration
    const minutes = Math.floor(data.duration / 60000);
    const seconds = Math.floor((data.duration % 60000) / 1000);
    ctx.fillStyle = '#888888';
    ctx.font = '14px Arial';
    ctx.fillText(`Duration: ${minutes}:${seconds.toString().padStart(2, '0')}`, canvas.width / 2, 400);
    
    // Privacy notice
    ctx.fillStyle = '#666666';
    ctx.font = '12px Arial';
    ctx.fillText('Privacy: Local analysis only', canvas.width / 2, 450);
    
    // Convert to blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png');
    });
  }

  private drawScoreCircle(ctx: CanvasRenderingContext2D, score: number, x: number, y: number): void {
    const radius = 80;
    const progress = score / 100;
    
    // Background circle
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Progress circle
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(x, y, radius, -Math.PI / 2, -Math.PI / 2 + (2 * Math.PI * progress));
    ctx.stroke();
  }
} 