/**
 * Gallery component for displaying meal session history
 * Shows last 14 meals as small cards with thumbnails and metadata
 */

import { localStore } from '../util/local_store';
import type { MealSession } from '../util/local_store';
import { copy } from './copy';

export interface GalleryHandle {
  mount(container: HTMLElement): void;
  refresh(): Promise<void>;
  destroy(): void;
}

export function createGallery(): GalleryHandle {
  let root: HTMLElement;
  let sessions: MealSession[] = [];

  function mount(container: HTMLElement) {
    container.innerHTML = '';
    root = document.createElement('div');
    root.className = 'gallery';
    root.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    `;

    container.appendChild(root);
    refresh();
  }

  async function refresh() {
    try {
      sessions = await localStore.getMealSessions();
      renderGallery();
    } catch (error) {
      console.error('Error loading meal sessions:', error);
      renderError();
    }
  }

  function renderGallery() {
    if (sessions.length === 0) {
      root.innerHTML = `
        <div style="
          text-align: center;
          padding: 32px;
          color: #666;
          font-style: italic;
        ">
          ${copy.empty.noMealsYet}
        </div>
      `;
      return;
    }

    const stats = calculateStats();
    
    root.innerHTML = `
      <div class="gallery-stats" style="
        background: white;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      ">
        <h3 style="margin: 0 0 12px 0; color: #333;">📊 Meal Gallery</h3>
        <div style="display: flex; gap: 24px; font-size: 14px;">
          <div>
            <strong>Total Meals:</strong> ${stats.total}
          </div>
          <div>
            <strong>Avg Rating:</strong> ${stats.avgRating} ⭐
          </div>
          <div>
            <strong>Top Type:</strong> ${stats.mostCommonType || 'None'}
          </div>
        </div>
      </div>
      
      <div class="gallery-grid" style="
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
      ">
        ${sessions.map(session => renderMealCard(session)).join('')}
      </div>
    `;
  }

  function renderMealCard(session: MealSession): string {
    const date = new Date(session.ts);
    const timeAgo = getTimeAgo(date);
    const rating = session.rating || 0;
    const stars = '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
    
    const thumbnail = session.thumbnail 
      ? `<img src="${session.thumbnail}" alt="Meal thumbnail" style="
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 8px;
        ">`
      : `<div style="
          width: 100%;
          height: 120px;
          background: #f0f0f0;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          font-size: 24px;
          margin-bottom: 8px;
        ">🍽️</div>`;

    const likedTags = session.liked_tags && session.liked_tags.length > 0
      ? `<div style="margin-top: 8px;">
          <div style="font-size: 12px; color: #666; margin-bottom: 4px;">Liked:</div>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${session.liked_tags.map(tag => `
              <span style="
                background: #e8f5e8;
                color: #2e7d32;
                padding: 2px 6px;
                border-radius: 12px;
                font-size: 11px;
              ">${tag}</span>
            `).join('')}
          </div>
        </div>`
      : '';

    const dislikedTags = session.disliked_tags && session.disliked_tags.length > 0
      ? `<div style="margin-top: 8px;">
          <div style="font-size: 12px; color: #666; margin-bottom: 4px;">Disliked:</div>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${session.disliked_tags.map(tag => `
              <span style="
                background: #ffebee;
                color: #c62828;
                padding: 2px 6px;
                border-radius: 12px;
                font-size: 11px;
              ">${tag}</span>
            `).join('')}
          </div>
        </div>`
      : '';

    return `
      <div class="meal-card" style="
        background: white;
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: transform 0.2s;
      " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
        ${thumbnail}
        
        <div style="margin-bottom: 8px;">
          <div style="font-weight: 600; color: #333; margin-bottom: 4px;">
            ${formatDate(date)}
          </div>
          <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
            ${timeAgo}
          </div>
          ${session.meal_type ? `
            <div style="
              background: #e3f2fd;
              color: #1976d2;
              padding: 2px 6px;
              border-radius: 12px;
              font-size: 11px;
              display: inline-block;
              margin-bottom: 4px;
            ">${session.meal_type}</div>
          ` : ''}
        </div>
        
        <div style="margin-bottom: 8px;">
          <div style="font-size: 14px; color: #333; margin-bottom: 2px;">
            ${stars}
          </div>
          ${session.eaten_pct !== undefined ? `
            <div style="font-size: 12px; color: #666;">
              Ate: ${session.eaten_pct}%
            </div>
          ` : ''}
        </div>
        
        ${likedTags}
        ${dislikedTags}
        
        ${session.notes ? `
          <div style="
            font-size: 12px;
            color: #555;
            font-style: italic;
            background: #f9f9f9;
            padding: 6px 8px;
            border-radius: 4px;
            margin-top: 8px;
          ">
            "${session.notes}"
          </div>
        ` : ''}
      </div>
    `;
  }

  function calculateStats() {
    if (sessions.length === 0) {
      return { total: 0, avgRating: 0, mostCommonType: null };
    }

    const ratings = sessions
      .map(s => s.rating)
      .filter(r => r !== undefined) as number[];
    
    const avgRating = ratings.length > 0 
      ? Math.round((ratings.reduce((sum, r) => sum + r, 0) / ratings.length) * 10) / 10
      : 0;

    const mealTypes = sessions
      .map(s => s.meal_type)
      .filter(t => t !== undefined) as string[];
    
    const mealTypeCounts = mealTypes.reduce((counts, mealType) => {
      counts[mealType] = (counts[mealType] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const mostCommonType = Object.keys(mealTypeCounts).length > 0
      ? Object.entries(mealTypeCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0]
      : null;

    return {
      total: sessions.length,
      avgRating,
      mostCommonType
    };
  }

  function renderError() {
    root.innerHTML = `
      <div style="
        text-align: center;
        padding: 32px;
        color: #d32f2f;
        font-style: italic;
      ">
        Error loading meal gallery. Please try again.
      </div>
    `;
  }

  function formatDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }

  function getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }

  function destroy() {
    if (root && root.parentNode) {
      root.parentNode.removeChild(root);
    }
  }

  return { mount, refresh, destroy };
} 